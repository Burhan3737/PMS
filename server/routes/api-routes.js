let express = require("express");
let router = express.Router();

let user_route = require("./../api/user/index");
let user_group_route = require("./../api/userGroup/index");
let local_route = require("./../auth/local/index");

let userHours_route = require("./../api/userHours/index");

let applicationLookups_route = require("./../api/ApplicationLookups/index");
let applicationresources_route = require("./../api/ApplicationResources/index");
let permissions_route = require("./../api/permission/index");
let notification_route = require("./../api/Notification/index");
let migration_route = require("./../api/migrations/index");

let taskSession_route = require("./../api/TaskSessions/index");

let team_route = require("./../api/Team/index");

router.use("/login", local_route);
router.use("/users", user_route);
router.use("/userHours", userHours_route);
router.use("/userGroup", user_group_route);

router.use("/taskSession", taskSession_route);

router.use("/applicationlookups", applicationLookups_route);
router.use("/applicationresources", applicationresources_route);
router.use("/permission", permissions_route);

router.use("/notification", notification_route);
router.use("/patch", migration_route);

router.use("/team", team_route);

module.exports = router;
