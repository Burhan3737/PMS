import { isJSON } from "../../utilities/isJson";
import UserSeviceInstance from "../user/user.service";
let ServiceLocator = require("../../framework/servicelocator");

export default class TeamDbService {
  constructor() {
    this.criteria = {
      getByUserId: (id) => ({ "user.id": id }),
      getSelfTeams: (email) => ({ "teamLead.email": email }),
    };
  }
  async getTeams(query, user) {
    let criteria = {};
    let result = {};
    if (user.group_id === "Member") criteria["teamLead.email"] = user.email;
    try {
      let TeamModel = ServiceLocator.resolve("TeamModal");
      let teams = await TeamModel.find(criteria).exec();
      result.status = 200;
      result.value = teams;
    } catch (error) {
      console.log("error in getTeams teamDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }
  async getSelfTeams(user) {
    let result = [];
    try {
      let TeamModel = ServiceLocator.resolve("TeamModal");
      result = await TeamModel.find(this.criteria.getSelfTeams(user.email)).exec();
    } catch (error) {
      console.log("error in getTeams teamDbService : ", error);
    }
    return result;
  }
  async createNew(team) {
    let result = {};
    let TeamModel = ServiceLocator.resolve("TeamModal");
    try {
      let newTeam = new TeamModel(team);
      await this.saveTeam(newTeam);
      result.status = 200;
      result.value = newTeam;
    } catch (error) {
      console.log("error in createNew teamDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }

  async saveTeam(team) {
    if (team) await team.save();
    else console.log("not a valid model item");
  }
  async updateTeam(team) {
    let result = {};
    let TeamModel = ServiceLocator.resolve("TeamModal");
    try {
      if (team) {
        await TeamModel.updateOne({ _id: team._id }, { $set: { ...team } });

        result.status = 200;
        result.value = team;
      } else {
        result.status = 404;
        result.errorVal = "Cant update, session not found";
      }
    } catch (error) {
      console.log("error in updateTeam teamDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }
  async deleteTeam(team_id) {
    let result = {};
    let TeamModel = ServiceLocator.resolve("TeamModal");
    try {
      if (team_id) {
        await TeamModel.deleteOne({ _id: team_id });
        result.status = 200;
        result.value = { _id: team_id };
      }
    } catch (error) {
      console.log("error in updateTeam teamDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }
}
