let ServiceLocator = require("../../framework/servicelocator");

exports.read = async function (req, res) {
  let taskSessionDbService = ServiceLocator.resolve("TaskSessionDbService");
  let resultObj = await taskSessionDbService.getSessions(req.query);
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};


exports.activeSession = async function (req, res) {
  let taskSessionDbService = ServiceLocator.resolve("TaskSessionDbService");
  let resultObj = await taskSessionDbService.getActiveSession(req.query);

  res.status(resultObj.status);
  if (resultObj.status == 200) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.create = async function (req, res) {
  let taskSessionDbService = ServiceLocator.resolve("TaskSessionDbService");
  let resultObj = await taskSessionDbService.createNew(req.body.taskSession);
  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.update = async function (req, res) {
  let taskSessionDbService = ServiceLocator.resolve("TaskSessionDbService");
  let resultObj = await taskSessionDbService.updateTaskSession(req.body);
  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.exportsummary = async function (req, res) {
  let taskSessionDbService = ServiceLocator.resolve("TaskSessionDbService");
  let resultObj = await taskSessionDbService.getTasksSummary(req.user, req.query);
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.exportsession = async function (req, res) {
  let taskSessionDbService = ServiceLocator.resolve("TaskSessionDbService");

  let resultObj = await taskSessionDbService.getSessionSummary(req.user,req.query);
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};


