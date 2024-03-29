import userModel from "./user.model";
import _ from "lodash";
import ServiceLocator from "../../framework/servicelocator";
//let Level=require('./../levels/level.model');
exports.getLevel = function (levelId) {
  return null; //await Level.findOne({level:levelId}).exec();
};

/**
 * @typedef {Object} UserInfo
 * @property {import("mongoose").ObjectId} _id - Id of the user document
 * @property {string} email - Email of the user
 * @property {string} name - Name of the user
 */

class UserService {
  async getUsersByUser(user) {
    if (!user) return [];
    try {
      // permission check
      if (
        !user.userGroup ||
        !user.userGroup.permissions ||
        !user.userGroup.permissions.find((p) => p.resource === "USER" && p.action === "view")
      ) {
        return { value: [] };
      }

      // aggregation based on level

      let criteria = {};
      let result = await userModel
        .aggregate()
        .lookup({
          from: "usergroups",
          let: { groupId: "$userGroup", userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$_id", "$$groupId"] },
                        {
                          $gt: ["$level", user.userGroup.level],
                        },
                      ],
                    },
                    { $eq: [user._id, "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "userGroupObj",
        })
        .match(
          {
            userGroupObj: { $ne: [] },
            isRemoved: { $ne: true },
            isAdmin: { $in: [false, user.isAdmin] },
            ...criteria,
          },
          "-password -isRemoved",
        )
        .exec();
      return { value: result };
    } catch (err) {
      console.log("err in getUsersByUser", err);
      return { errorVal: err };
    }
  }
  /**
   * Returns the user's info based on the unique email address
   * @param {string} email - unique email address of the user
   * @returns {UserInfo | null} Information of the user
   */
  async getUserInfo(email) {
    let user = await userModel.findOne({ email: email }).lean();
    if (user) {
      return _.pick(user, ["_id", "email", "name"]);
    }
    return null;
  }
}
const UserSeviceInstance = new UserService();
export default UserSeviceInstance;
