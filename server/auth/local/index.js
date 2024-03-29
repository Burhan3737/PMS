"use strict";
let express = require("express");
let router = express.Router();
let User = require("../../api/user/user.model");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let config = require("../../config/environment/index");
let tenantInfo = require("../../utilities/tenantInfo");
let ServiceLocator = require("../../framework/servicelocator");
import * as permitTypes from "../../config/permissions";
import { unitsFactors } from "@turf/turf";

let loginUser = async function (req, res, next) {
  let tenantId = tenantInfo.getTenantId(req.hostname);

  //console.log(tenantId);
  //let user= await User.findOne({tenantId:'tenant'}).populate({path:'userGroup',populate :{path: 'permissions'}}).exec();
  User.findOne({ tenantId: tenantId, email: req.body.user.email }, function (err, result) {
    if (err) return res.send({ "Error on the server.": err });
    if (!result) {
      res.status(403);
      return res.send("No user found.");
    }
    if (result.isRemoved) {
      res.status(404);
      return res.send("No user found.");
    }
    if (!result.active) {
      res.status(403);
      return res.send("User is not active");
    }
    let passwordIsValid = bcrypt.compareSync(req.body.user.password, result.hashedPassword);
    if (!passwordIsValid) {
      res.status(401);
      return res.send("Invalid Password");
    }
    let token = jwt.sign({ userId: result._id }, config.secrets.session, {
      //expiresIn: 86400, // expires in 24 hours
    });

    return res.send({ result, token });
    //return res.send({result, token, permissions: permitTypes});
  }).populate({
    path: "userGroup",
    select: ["name", "isAdmin", "level", "group_id"],
    populate: { path: "permissions", select: ["resource", "action", "name"] },
  });
};

router.post("/", loginUser);
module.exports = router;
