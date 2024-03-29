import taskSessionDbService from "../api/TaskSessions/taskSessions.dbService";
import TeamDbService from "../api/Team/team.dbService";
let ServiceLocator = require("./servicelocator");

let TaskSessionsModel = require("../api/TaskSessions/taskSessions.model");
let TeamModel = require("../api/Team/team.model");
export function registerServices() {
  ServiceLocator.register("TaskSessionModal", TaskSessionsModel);
  ServiceLocator.register("TeamModal", TeamModel);

  ServiceLocator.register("TaskSessionDbService", new taskSessionDbService());
  ServiceLocator.register("TeamDbService", new TeamDbService());
}
