var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
process.env.NODE_ENV = process.env.NODE_ENV || "development";
let config = require("./config/environment/index");
let mongoose = require("mongoose");
var cors = require("cors");
let bodyParser = require("body-parser");
let utils = require("./utilities/utils");
var routes = require("./routes/routes");
var rfs = require("rotating-file-stream");
const schedule = require("node-schedule");

try {
  require("fs").mkdirSync("./log");
} catch (e) {
  if (e.code != "EEXIST") {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

var log4js = require("log4js");
//log4js.configure("./server/config/log4js.json");
log4js.configure("./config/log4js.json");
var startupLogger = log4js.getLogger("startup");

startupLogger.info("Starting up...");
import { registerServices } from "./framework/serviceRegister";
let ServiceLocator = require("./framework/servicelocator");
registerServices();

ServiceLocator.register("logger", log4js.getLogger("System"));

let mongoURL = "mongodb://127.0.0.1:27017/"; // default mongo db url
// if environment has databse url and port then make a new url
if (process.env.DB_URL && process.env.DB_PORT) {
  mongoURL = "mongodb://" + process.env.DB_URL + ":" + process.env.DB_PORT + "/";
}
// use database from environment if available
if (process.env.DB_NAME) {
  mongoURL = mongoURL + process.env.DB_NAME;
  config.mongo.uri = mongoURL;
}
mongoose.connect(config.mongo.uri, { useNewUrlParser: true, useFindAndModify: false }, async (e) => {
  if (!e) {
    if (process.env.DB_NAME) {
      console.log("Database settings from environment.");
      console.log("Database name:", process.env.DB_NAME);
      if (process.env.DB_URL && process.env.DB_PORT) {
        console.log("Database server:", process.env.DB_URL);
        console.log("Database port:", process.env.DB_PORT);
      }
    }
    console.log("Database Connected!");
    startupLogger.info("Database Connected!");
  } else {
    console.log("Error connecting database");
    console.log(e);

    startupLogger.error("Error connecting database");
    startupLogger.error(e);
  }
  utils = ServiceLocator.resolve("utils");
  mongoose.connection.on("error", utils.handleMongoDbError);
});
var app = express();

var accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use(logger("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));
utils = ServiceLocator.resolve("utils");

require("./routes/routes")(app);
console.log("Environment : " + process.env.NODE_ENV);

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// serve frontend through this server
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
///////////////////////////////////////

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

if (config.seedDB) {
  // let seed = require("./config/seed");
  let database = require("./config/database/database");

  database.createDatabase();

  console.log("Seed has been executed");
  startupLogger.info("Seed has been executed");
} else {
  console.log("Seed disabled");
  startupLogger.info("Seed disabled");
}

let migrations = ServiceLocator.resolve("MigrationsService");
if (migrations) {
  migrations.performStatusChecks();
}

module.exports = app;
