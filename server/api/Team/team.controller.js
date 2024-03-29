let ServiceLocator = require("../../framework/servicelocator");

exports.read = async function (req, res) {
  let teamDbService = ServiceLocator.resolve("TeamDbService");
  let resultObj = await teamDbService.getTeams(req.query, req.user);
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.create = async function (req, res) {
  let teamDbService = ServiceLocator.resolve("TeamDbService");
  let resultObj = await teamDbService.createNew(req.body.team);
  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.update = async function (req, res) {
  let teamDbService = ServiceLocator.resolve("TeamDbService");
  let resultObj = await teamDbService.updateTeam(req.body);
  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.delete = async function (req, res) {
  let teamDbService = ServiceLocator.resolve("TeamDbService");
  let resultObj = await teamDbService.deleteTeam(req.params.id);
  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
