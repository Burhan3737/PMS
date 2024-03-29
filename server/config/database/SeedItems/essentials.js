var _ = require("lodash");
let UserGroup = require("../../../api/userGroup/userGroup.model");
let GroupPermission = require("../../../api/permission/permission.model");
let Tenant = require("../../../api/tenant/tenant.model");
let User = require("../../../api/user/user.model");
let config = require("../../environment/index");
import { permissionsToAdd } from "../permissionRoles";
import { addIfNotExist, UpdateOrAddIfNotExist } from "../dbFunctions/dbHelperMethods";
import { managersList, memberList, teamManagersList } from "./employees";
export async function createTenant() {
  await addIfNotExist(
    Tenant,
    { tenantId: "tenant" },
    {
      active: true,
      isDefault: true,
      tenantId: "tenant",
      name: "Tenant",
    },
  );
}

export async function createPermissions() {
  for (const per of permissionsToAdd) {
    await addIfNotExist(GroupPermission, per, per);
  }
}

export async function createUserGroups() {
  let permissions = await GroupPermission.find({}).exec(); // get all permissions
  let permissionAry = _.map(permissions, (item) => item._id);
  let restrictedPerms = ["USER MANAGER VIEW"];
  let memberPermissionsAry = permissions.filter((perm) => restrictedPerms.find((rPerm) => rPerm !== perm.name)).map((item) => item._id);
  let groupsToAdd = [
    {
      group_id: config.defaultData.adminGroup.id,
      name: config.defaultData.adminGroup.desc,
      permissions: permissionAry,
      isAdmin: true,
      level: 0,
    },
    { group_id: "manager", name: "Management", permissions: permissionAry, isAdmin: false, level: 1 },
    { group_id: "supervisor", name: "Team Manager", permissions: permissionAry, isAdmin: false, level: 2 },
    { group_id: "member", name: "Member", permissions: memberPermissionsAry, isAdmin: false, level: 3 },
  ];

  for (const grp of groupsToAdd) {
    await UpdateOrAddIfNotExist(UserGroup, grp, grp, { group_id: grp.group_id });
  }
}
export async function createUsers() {
  let tenantId = "tenant";
  let username = "admin";
  let email = "admin@pms.com";
  let adminUG = await UserGroup.findOne({ isAdmin: true });
  let manager = await UserGroup.findOne({ group_id: "manager" });
  let teamManager = await UserGroup.findOne({ group_id: "supervisor" });
  let memberGroup = await UserGroup.findOne({ group_id: "member" });
  if (!adminUG) {
    console.log("error: createDatabase: createUsers: cannot find admin user group");
    return;
  }
  let adminUsers = [
    {
      name: username,
      tenantId: tenantId,
      email: email,
      password: "admin",
      isAdmin: false,
      userGroup: adminUG._id,
      group_id: adminUG.group_id,
      genericEmail: "admin2@pms.com",
      department: "administration",
      mobile: "",
    },
  ];
  let managerListFull = managersList.map((user) => {
    return {
      name: user.name,
      tenantId: tenantId,
      email: user.email,
      password: "welcome",
      isAdmin: false,
      userGroup: manager._id,
      group_id: manager.group_id,
      genericEmail: "",
      department: "",
      mobile: "",
    };
  });

  let teamManagerListFull = teamManagersList.map((user) => {
    return {
      name: user.name,
      tenantId: tenantId,
      email: user.email,
      password: "welcome",
      isAdmin: false,
      userGroup: teamManager._id,
      group_id: teamManager.group_id,
      genericEmail: "",
      department: "",
      mobile: "",
    };
  });

  let memeberListFull = memberList.map((user) => {
    return {
      name: user.name,
      tenantId: tenantId,
      email: user.email,
      password: "welcome",
      isAdmin: false,
      userGroup: memberGroup._id,
      group_id: memberGroup.group_id,
      genericEmail: "",
      department: "",
      mobile: "",
    };
  });
  await addUserList(adminUsers);
  await addUserList(managerListFull);
  await addUserList(teamManagerListFull);
  await addUserList(memeberListFull);
}

async function addUserList(userList) {
  for (const usr of userList) {
    await addIfNotExist(User, { email: usr.email }, usr);
  }
}
