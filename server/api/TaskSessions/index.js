let controller = require("./taskSessions.controller");
let isAuthenticated = require("../../auth/auth");
let express = require("express");
let router = express.Router();

router.get("/exportsummrystatus", [isAuthenticated], controller.exportsummary);
router.get("/exportsessionstatus", [isAuthenticated], controller.exportsession);
router.get("/activeSession", [isAuthenticated], controller.activeSession);
router.get("/", [isAuthenticated], controller.read);
router.post("/", [isAuthenticated], controller.create);
router.put("/:id", [isAuthenticated], controller.update);

module.exports = router;
