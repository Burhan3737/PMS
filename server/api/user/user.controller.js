//This Controller deals with all functionalities of User
let userService = require("./user.service");
let User = require("./user.model");
let UserGroup = require("../userGroup/userGroup.model");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let crypto = require("crypto");
let config = require("../../config/environment/index");
let nodemailer = require("nodemailer");
let async = require("async");
//EmailService
let emailService = require("../../service/EmailService");
let isAllowed = require("../../middlewares/validatePermission");
let _ = require("lodash");
let tenantInfo = require("../../utilities/tenantInfo");
let ServiceLocator = require("../../framework/servicelocator");
// Permission registration
import * as permitTypes from "../../config/permissions"; // End
let validationError = function (res, err) {
  return res.status(422).json(err);
};

exports.index = async function (req, res) {
  if (
    _.find(req.user.userGroup.permissions, {
      resource: "USER",
      action: "view",
    })
  ) {
    let criteria = {};

    let agg = User.aggregate()
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
                        $gt: ["$level", req.user.userGroup.level],
                      },
                    ],
                  },
                  { $eq: [req.user._id, "$$userId"] },
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
          isAdmin: { $in: [false, req.user.isAdmin] },
          ...criteria,
        },
        "-password -isRemoved",
      )
      .exec(function (err, users) {
        if (err) {
          return handleError(res, err);
        }
        res.status(200);
        res.json(users);
      });
  } else {
    User.find({ $and: [{ _id: req.user._id }, { isRemoved: { $ne: true } }] }, "-password -isRemoved", function (err, users) {
      if (err) {
        return handleError(res, err);
      }
      res.status(200);
      res.json(users);
    });
  }
};
/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  User.findOne(
    {
      $and: [{ email: req.body.user.email }, { tenantId: tenantInfo.getTenantId(req.hostname) }],
    },
    (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        let newUser = new User(req.body.user);
        let tenantId = tenantInfo.getTenantId(req.hostname);
        newUser.tenantId = tenantId;
        newUser.active = true;

        newUser.save(function (err, user) {
          if (err) return handleError(res, err);
          //let token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
          res.status(200);
          return res.json(user);
        });
      } else {
        req.body.user.isRemoved = false;
        req.body.user.active = true;
        User.findOneAndUpdate({ _id: user._id }, { $set: req.body.user }, { upsert: true, new: true }, (err, user) => {
          if (err) return next(err);
          res.status(200);
          return res.json(user);
        });
      }
    },
  );
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  let userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return handleError(res, err);
    if (!user) {
      res.status(401);
      return res.send("Unauthorized");
    }
    let userHoursModel = ServiceLocator.resolve("UserHours");
    userHoursModel.findOne({ userId: user._id }, (err, userHoursDoc) => {
      if (err) return handleError(res, err);
      if (userHoursDoc) {
        user.userHours = userHoursDoc;
      }
      res.json(user);
    });
  });
};

function updateTeamAssingmend(user) {
  return new Promise(async (resolve, reject) => {
    if (user.group_id === "inspector" && user.teamLead) {
      let findLead = await User.findOne({ email: user.teamLead });

      if (findLead && findLead.team && findLead.team.length) {
        findLead.team = findLead.team.filter((t) => t.email !== user.email);
        await findLead.save();
      }

      user.teamLead = "";
    } else if (user.group_id === "supervisor" && user.team && user.team.length) {
      for (let team of user.team) {
        await User.findOneAndUpdate({ email: team.email }, { teamLead: "" });
      }

      user.team = [];
    }

    resolve(user);
  });
}

/**
 * Update an existing user
 */
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  User.findById(req.params.id, async function (err, user) {
    if (err) return handleError(res, err);
    if (!user) {
      res.status(404);
      return res.send("User not found");
    }
    // user.firstName = req.body.firstName;
    // user.lastName = req.body.lastName;

    // Check and release if user assigned to team or user is a team lead of any team.
    if (user.group_id !== req.body.group_id) {
      user = await updateTeamAssingmend(user);
    }

    user.name = req.body.name;

    user.phone = req.body.phone;
    user.mobile = req.body.mobile;
    user.address = req.body.address;
    user.group_id = req.body.group_id;
    user.group_name = req.body.group_name;
    user.assignedLocation = req.body.assignedLocation;
    user.assignedLocationName = req.body.assignedLocationName;

    user.userGroups = req.body.userGroups;
    if (req.body.userGroup) {
      user.userGroup = req.body.userGroup;
    }
    user.active = req.body.status;
    user.save(function (err, user) {
      if (err) {
        return handleError(res, err);
      }

      if (req.body.userWorkPlans && req.body.assignUserToWorkPlan) {
        let WorkPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
        WorkPlanTemplateService.updateUsersTemplates(req.body.userWorkPlans, req.body.assignUserToWorkPlan);
      }
      res.status(200);
      return res.json(user);
    });
  });
};

exports.logoutUser = function (req, res, next) {
  res.status(200);
  return res.json("LogOut Successful");
};
/**
 * Update an existing user
 */
exports.forgotPassword = function (req, res, next) {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          let token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            res.status(404);
            return res.send("not found");

            // req.flash('error', 'No account with that email address exists.');
            // return res.redirect('/forgot');
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        let mailOptions = {
          to: user.email,
          subject: "Password Reset Link",
          html:
            "<p>You are receiving this because you (or someone else) has requested to reset the password of your account.</p><br/>" +
            "<p>Please click on the following link, or paste this into your browser to complete the process:</p>" +
            "<p>http://" +
            config.ip +
            ":" +
            config.port +
            "/confirmreset/" +
            token +
            "</p>" +
            "<a href='http://" +
            config.ip +
            ":" +
            config.port +
            "/confirmreset/" +
            token +
            "'> Click Here </a>" +
            "<h3>If you did not request, please ignore this email and your password will remain unchanged.</h3>" +
            "<p>Thank You</p>" +
            "<p>TIMPS Team</p>",
        };
        emailService(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            res.status(500);
            return res.json(err);
          }
          //console.log("Email Sent");
          //console.log("Message sent: %s", info.messageId);
          return res.json("Email Sent!");
        });
      },
    ],
    function (err) {
      if (err) {
        res.status(500);
        return res.json(err);
      }
    },
  );
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
};

exports.verifyPassReset = function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (err) {
        return handleError(res, err);
      }
      if (!user) {
        res.status(403);
        return res.send("Password reset token is invalid or has expired.");
        //return res.redirect('/forgot');
      }
      return res.json(user);
    },
  );
};
/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findOne({ _id: req.params.id }, async (err, user) => {
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      res.status(404);
      return res.json("User Not Found");
    }
    if (user.isAdmin) {
      res.status(500);
      return res.json("Admin user can not be deleted");
    }

    // Check and release if user assigned to team or user is a team lead of any team.
    user = await updateTeamAssingmend(user);
    user.isRemoved = true;
    user.save(function (err, user) {
      if (err) {
        return next(err);
      }
      res.status(200);
      return res.json(user);
    });
  });
};

/**
 * Change a users password
 */
// exports.changePassword = function (req, res, next) {
//     let userId = req.params.id;
//     let oldPass = String(req.body.oldPassword);
//     let newPass = String(req.body.newPassword);

//     User.findById(userId, function (err, user) {
//         if (err) return next(err);
//         if (!user) {
//             res.status(404);
//             return res.send('User not found');
//         }
//         if (user.authenticate(oldPass)) {
//             user.password = newPass;
//             user.save(function (err) {
//                 if (err) return next(err);
//                 res.status(200);
//                 return res.send('Password updated');
//             });
//         } else {
//             res.status(403);
//             return res.send('Forbidden');
//         }
//     });
// };

// Change User Password By Admin also by using for forgot password logic

exports.changePassword = function (req, res, next) {
  let userId = req.params.id;
  let newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if (err) return handleError(res, err);
    if (!user) {
      res.status(404);
      return res.send("User not found");
    }
    user.password = newPass;
    User.update({ _id: userId }, { $set: { hashedPassword: user.hashedPassword } }, (err, user) => {
      if (err) return next(err);
      res.status(200);
      return res.json("Password updated");
    });

    // user.set({ hashedPassword:  user.hashedPassword });
    // user.save(function(err) {
    //   if (err) return next(err);
    //   res.status(200);
    //   return res.json("Password updated");
    // });
  });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
  let userId = req.user._id;
  User.findOne(
    {
      _id: userId,
    },
    "-salt -hashedPassword",
    function (err, user) {
      // don't ever give out the password or salt
      if (err) return handleError(res, err);
      if (!user) return res.status(401).send("Unauthorized");
      res.json(user);
    },
  );
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect("/");
};

exports.removeTeamMembers = function (req, res, next) {
  User.findById(req.params.id, function (err, teamLead) {
    if (err) return handleError(res, err);
    if (!teamLead) {
      res.status(404);
      return res.send("Supervisor not found");
    }

    // teamLead.team = _.difference(teamLead.team, req.body.newTeamMembers);
    let newTeam = _.cloneDeep(teamLead.team);
    _.remove(newTeam, (team) => {
      return team.email == req.body.userToDelete;
    });
    teamLead.team = newTeam;
    User.findOne(
      {
        $and: [{ email: req.body.userToDelete }, { tenantId: tenantInfo.getTenantId(req.hostname) }],
      },
      (err, user) => {
        if (user) {
          user.teamLead = "";
          user.save();
        }
        return;
      },
    );

    teamLead.save(function (err, teamLead) {
      if (err) {
        return handleError(res, err);
      }
      res.status(200);
      return res.json(teamLead);
    });
  });
};

exports.updateTeam = function (req, res, next) {
  User.findById(req.params.id, function (err, teamLead) {
    if (err) return handleError(res, err);
    if (!teamLead) {
      res.status(404);
      return res.send("Supervisor not found");
    }

    teamLead.team = [...teamLead.team, ...req.body.newTeamMembers];
    req.body.newTeamMembers.forEach((member) => {
      User.findOne(
        {
          $and: [{ email: member.email }, { tenantId: tenantInfo.getTenantId(req.hostname) }],
        },
        (err, user) => {
          if (user) {
            user.teamLead = req.body.email;
            user.save();
          }
          return;
        },
      );
    });
    teamLead.save(function (err, teamLead) {
      if (err) {
        return handleError(res, err);
      }
      res.status(200);
      return res.json(teamLead);
    });
  });
};
