let controller = require("./team.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

router.get("/", [isAuthenticated], controller.read);
router.post("/", [isAuthenticated], controller.create);
router.put("/:id", [isAuthenticated], controller.update);
router.delete("/:id", [isAuthenticated], controller.delete);

module.exports = router;
