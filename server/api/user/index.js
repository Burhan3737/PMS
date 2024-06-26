import * as permitTypes from "../../config/permissions";
let controller = require("./user.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

// Permission Validation
let isAllowed = require("../../middlewares/validatePermission");

//var  permitTypes =require('../../config/permissions').default;

router.get("/", [isAuthenticated, isAllowed(permitTypes.VIEW_USER)], controller.index);
router.get("/:id", [isAuthenticated, isAllowed(permitTypes.READ_USER)], controller.show);
router.get("/me", [isAuthenticated], controller.me);
router.get("/reset/:token", controller.verifyPassReset);
router.put("/teamupdate/:id", [isAuthenticated], controller.updateTeam);
router.put("/teamremovemembers/:id", [isAuthenticated], controller.removeTeamMembers);
router.put("/:id/password", controller.changePassword);
router.put("/:id/", [isAuthenticated, isAllowed(permitTypes.UPDATE_USER)], controller.update);
router.put("/logout/:id", controller.logoutUser);
router.post("/", [isAuthenticated, isAllowed(permitTypes.CREATE_USER)], controller.create);
router.post("/forgot", controller.forgotPassword);
router.delete("/:id", [isAuthenticated, isAllowed(permitTypes.DELETE_USER)], controller.destroy);

module.exports = router;
