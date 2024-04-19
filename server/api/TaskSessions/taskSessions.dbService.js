import { isJSON } from "../../utilities/isJson";
import UserSeviceInstance from "../user/user.service";
let ServiceLocator = require("../../framework/servicelocator");
import moment from "moment";
import _ from "lodash";

export default class taskSessionDbService {
  constructor() {
    this.criteria = {
      getByUserId: (id) => ({ "user.id": id }),
      getByUserEmail: (email) => ({ "user.email": email }),
      getByRange: (range) => ({ $and: [{ checkin: { $gte: range.from } }, { checkin: { $lte: range.to } }] }),
    };
  }
  async getSessions(query) {
    let criteria = {};
    let result = {};
    try {
      if (query.userId) criteria = { ...criteria, ...this.criteria.getByUserId(query.userId) };
      if (query.email) criteria = { ...criteria, ...this.criteria.getByUserEmail(query.email) };
      if (query.range) {
        let dateRange = isJSON(query.range);
        if (dateRange) {
          criteria = { ...criteria, ...this.criteria.getByRange(dateRange) };
        }
      }
      let TaskSessionModel = ServiceLocator.resolve("TaskSessionModal");

      let sessions = await TaskSessionModel.find(criteria).exec();

      console.log("These are the active sessions", sessions);

      result.status = 200;
      result.value = sessions;
    } catch (error) {
      console.log("error in getSessions taskSessionDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }

  async getTasksSummary(user, query) {
    // console.log("user ->", user, "\nQuery ->", query);
    let result = {};
    let dateCriteria = null;
    if (query.today) dateCriteria = moment().format("YYYY-MM-DD");
    else if (query.yesterday) {
      if (moment().day() === 1) dateCriteria = moment().subtract(3, "day").format("YYYY-MM-DD");
      else dateCriteria = moment().subtract(1, "day").format("YYYY-MM-DD");
    } else {
      let dateKey = Object.keys(query)[0];
      // console.log("dateKey->", dateKey, "\ttype->", typeof dateKey);
      dateCriteria = dateKey;
    }
    // console.log("\ndate criteria ->", dateCriteria, "\ttype ->>", typeof dateCriteria);
    if (!dateCriteria) {
      console.log("No Date provided in getTasksSummary");
      return { errorVal: "No Date provided", status: 404 };
    }
    try {
      let taskSummary = [];
      let allUsersResult = await UserSeviceInstance.getUsersByUser(user);
      if (allUsersResult.erroVal) {
        return allUsersResult;
      }
      let allUsers = allUsersResult.value.filter((u) => u.isAdmin === false);
      let userIds = allUsers.map((u) => u._id.toString());
      let TaskSessionModel = ServiceLocator.resolve("TaskSessionModal");
      let TeamDbService = ServiceLocator.resolve("TeamDbService");
      let teams = await TeamDbService.getSelfTeams(user);
      let criteria = {};
      criteria["user.id"] = { $in: userIds };
      criteria["$expr"] = { $eq: [dateCriteria, { $dateToString: { date: "$checkin", format: "%Y-%m-%d" } }] };
      let userSessions = await TaskSessionModel.find(criteria);
      pushSessionToSummary(taskSummary, userSessions, allUsers, teams, dateCriteria);
      result.status = 200;
      result.value = taskSummary;
    } catch (error) {
      console.log("error in getTasksSummary taskSessionDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }

  async getSessionSummary(user, query) {
    let result = {};
    let criteria = {};
    // let dateCriteria = null;
    // if (query.today) dateCriteria = moment().format("YYYY-MM-DD");
    // if (query.yesterday) dateCriteria = moment().subtract(1, "day").format("YYYY-MM-DD");
    // if (!dateCriteria) {
    //   console.log("No Date provided in getTasksSummary");
    //   return { errorVal: "No Date provided", status: 404 };
    // }
    try {
      if (query.range) {
        let dateRange = isJSON(query.range);
        if (dateRange) {
          criteria = { ...criteria, ...this.criteria.getByRange(dateRange) };
        }
      }
      let taskSummary = [];
      let allUsersResult = await UserSeviceInstance.getUsersByUser(user);
      if (allUsersResult.erroVal) {
        return allUsersResult;
      }
      let allUsers = allUsersResult.value.filter((u) => u.isAdmin === false);
      let userIds = allUsers.map((u) => u._id.toString());
      let selectedUser = user;
      if (query.selectedUser && query.filterBy) {
        selectedUser = allUsers.find((u) => u._id.toString() === query.selectedUser);
      }

      let TaskSessionModel = ServiceLocator.resolve("TaskSessionModal");
      let TeamDbService = ServiceLocator.resolve("TeamDbService");

      let teams = await TeamDbService.getSelfTeams(selectedUser);

      criteria["user.id"] = { $in: userIds };
      //criteria["$expr"] = { $eq: [dateCriteria, { $dateToString: { date: "$checkin", format: "%Y-%m-%d" } }] };
      let userSessions = await TaskSessionModel.find(criteria);
      if (selectedUser && query.filterBy && query.range) {
        pushSessionToMonthSummary(taskSummary, userSessions, allUsers, teams, query.filterBy, selectedUser, query.range);
        result.status = 200;
        result.value = taskSummary;
      } else {
        console.log("error in getTasksSummary taskSessionDbService : ");
        result.status = 500;
        result.errorVal = "error";
      }
    } catch (error) {
      console.log("error in getTasksSummary taskSessionDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }

  async getActiveSession(query) {
    let criteria = {};
    let result = {};

    try {
      if (query.userId) criteria = { ...criteria, ...this.criteria.getByUserId(query.userId) };
      if (query.email) criteria = { ...criteria, ...this.criteria.getByUserEmail(query.email) };

      let TaskSessionModel = ServiceLocator.resolve("TaskSessionModal");
      let sessions = await TaskSessionModel.find(criteria).exec();

      result.status = 200;
      result.value = sessions;

      console.log("These are the timed sessions", sessions);

      //filtering to find only the active timed session
      result.value = result.value.filter((session) => session.timed === true);
      result.value = result.value.filter((session) => !session.checkout);
      console.log(result.value[0]);
      let newTS = new TaskSessionModel(result.value[0]);
      await this.saveTaskSession(newTS);
      result.status = 200;
      if (result.value[0]) {
        result.value = newTS;
      } else {
        result.value = null;
      }
    } catch (error) {
      console.log("error in getSession taskSessionDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }

  async createNew(tS) {
    let result = {};
    let TaskSessionModel = ServiceLocator.resolve("TaskSessionModal");
    try {
      let newTS = new TaskSessionModel(tS);
      await this.saveTaskSession(newTS);
      result.status = 200;
      result.value = newTS;
    } catch (error) {
      console.log("error in createNew taskSessionDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }

  async saveTaskSession(tS) {
    if (tS) await tS.save();
    else console.log("Task Session Db service : not a valid task session");
  }
  async updateTaskSession(tS) {
    let result = {};
    let TaskSessionModel = ServiceLocator.resolve("TaskSessionModal");
    try {
      if (tS) {
        await TaskSessionModel.updateOne({ _id: tS._id }, { $set: { ...tS } });

        result.status = 200;
        result.value = tS;
      } else {
        result.status = 404;
        result.errorVal = "Cant update, session not found";
      }
    } catch (error) {
      console.log("error in updateTaskSession taskSessionDbService : ", error);
      result.status = 500;
      result.errorVal = error;
    }
    return result;
  }
}

function pushSessionToSummary(taskSummary, userSessions, allUsers, teams, dateCriteria) {
  let row = {
    Date: "",
    Project: "",
    Member: "",
    TaskSummary: "",
  };
  for (let team of teams) {
    let users = [team.teamLead, ...team.team];
    for (let user of users) {
      let filteredSession = userSessions.filter((s) => s.user.id === user.id);
      if (filteredSession.length > 0) {
        for (let fSession of filteredSession) {
          let toPushRow = { ...row };
          toPushRow.Member = user.name;
          toPushRow.Date = moment(fSession.checkin).format("D-MMM-YYYY");
          toPushRow.Project = fSession.project;
          toPushRow.TaskSummary = fSession.task;
          taskSummary.push(toPushRow);
        }
      } else {
        let toPushRow = { ...row };
        toPushRow.Member = user.name;
        toPushRow.Date = moment(dateCriteria, "YYYY-MM-DD").format("D-MMM-YYYY");
        taskSummary.push(toPushRow);
      }
    }
  }
}

function pushSessionToMonthSummary(taskSummary, userSessions, allUsers, teams, filterBy, selectedUser, range) {
  let row = {
    Member: "",
    Checkin: "",
    Checkout: "",
    Duration: "",
  };

  const dateRange = JSON.parse(range);
  const datesInRange = getDatesInRange(dateRange.from, dateRange.to);
  if (filterBy === "User") {
    let filteredSession = userSessions.filter((s) => s.user.id === selectedUser._id.toString());
    createTaskSummary(taskSummary, filteredSession, row, selectedUser, datesInRange);
  } else {
    let users = [];
    for (let team of teams) {
      let teamUsers = [team.teamLead, ...team.team];
      users.push(...teamUsers);
    }
    users = removeDuplicates(users, "name");
    for (let user of users) {
      let filteredSession = userSessions.filter((s) => s.user.id === user.id);
      createTaskSummary(taskSummary, filteredSession, row, user, datesInRange);
    }
  }
}

function createTaskSummary(taskSummary, filteredSession, row, user, range) {
  let userData = [];
  let taskSummaryData = [];
  if (filteredSession.length > 0) {
    let duration = "",
      hours = "",
      minutes = "";

    for (let fSession of filteredSession) {
      if (fSession.checkin) {
        if (fSession.checkout) {
          duration = moment.duration(moment(new Date(fSession.checkout)).diff(new Date(fSession.checkin)));
          hours = Math.floor(duration.asHours());
          minutes = duration.minutes();
        } else {
          hours = 0;
          minutes = 0;
        }

        let toPushRow = { ...row };
        toPushRow.Member = user.name;
        toPushRow.Checkin = fSession.checkin ? fSession.checkin : "";
        toPushRow.Checkout = fSession.checkout ? fSession.checkout : "";
        toPushRow.CheckinFormat = fSession.checkin ? moment(fSession.checkin).format("DD-MMM-YYYY") : "";
        toPushRow.Duration = (hours * 60 + minutes) / 60;
        //taskSummary.push(toPushRow);
        userData.push(toPushRow);
      }
    }
  }

  calculateAbsents(userData, range, user);

  userData.sort((a, b) => {
    return new Date(a.CheckinFormat) - new Date(b.CheckinFormat);
  });

  let groupedDates = _.groupBy(userData, "CheckinFormat");

  for (const property in groupedDates) {
    if (groupedDates[property][0].Checkin) {
      let duration = 0;
      let checkin = new Date(groupedDates[property][0].Checkin);
      let checkout = groupedDates[property][0].Checkout
        ? new Date(groupedDates[property][0].Checkout)
        : new Date(groupedDates[property][0].Checkin);
      groupedDates[property].forEach((g) => {
        duration += Number(g.Duration);
        if (g.Checkout) {
          if (checkout < new Date(g.Checkout)) {
            checkout = new Date(g.Checkout);
          }
        }

        if (g.Checkin) {
          if (checkin > new Date(g.Checkin)) {
            checkin = new Date(g.Checkin);
          }
        }
      });

      taskSummaryData.push({
        Member: groupedDates[property][0].Member,
        Date: moment(checkin).format("DD-MMM-YYYY"),
        // Checkin: moment(checkin).format("DD-MMM-YYYY h:mm A"),
        // Checkout: moment(checkout).format("DD-MMM-YYYY h:mm A"),
        Checkin: 25569.0 + (checkin.getTime() - checkin.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24),
        Checkout: 25569.0 + (checkout.getTime() - checkout.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24),

        // Checkin: new Date(checkin),
        // Checkout: new Date(checkout),
        Duration: Math.round(duration * 100) / 100,
      });
    } else {
      taskSummaryData.push({
        Member: groupedDates[property][0].Member,
        Date: groupedDates[property][0].CheckinFormat,
        Checkin: "",
        Checkout: "",
        Duration: "",
      });
    }
  }

  taskSummary.push(taskSummaryData);
}
function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

function getDatesInRange(startDateUtc, endDateUtc) {
  const startDate = new Date(startDateUtc);
  const endDate = new Date(endDateUtc);

  const dates = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const currentDay = currentDate.getDay();

    // Check if it's not Saturday (6) or Sunday (0)
    if (currentDay !== 6 && currentDay !== 0) {
      dates.push(new Date(currentDate));
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
}

function calculateAbsents(userData, range, user) {
  for (let date of range) {
    let found = -1;
    if (userData && userData.length > 0) {
      found = userData.findIndex((u) => u.CheckinFormat === moment(date).format("DD-MMM-YYYY"));
    }

    if (found === -1) {
      userData.push({
        Member: user.name,
        Checkin: "",
        Checkout: "",
        Duration: "",
        CheckinFormat: moment(date).format("DD-MMM-YYYY"),
      });
    }
  }
}
