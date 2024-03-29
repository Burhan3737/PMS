export const rolesPermissionUpdate = true;

export const permissionsToAdd = [
  { name: "USER VIEW", resource: "USER", action: "view" },
  { name: "USER READ", resource: "USER", action: "read" },
  { name: "USER CREATE", resource: "USER", action: "create" },
  { name: "USER UPDATE", resource: "USER", action: "update" },
  { name: "USER DELETE", resource: "USER", action: "delete" },
  { name: "USER GROUP UPDATE", resource: "USER", action: "group_update" },
  { name: "USER MANAGER VIEW", resource: "USER", action: "manager_view" },

  { name: "SETUP PAGE", resource: "SETUP", action: "view" },

  { name: "DASHBOARD VIEW", resource: "DASHBOARD", action: "view" },

  { name: "TEAM CREATE", resource: "TEAM", action: "create" },
  { name: "TEAM VIEW", resource: "TEAM", action: "view" },
  { name: "TEAM DELETE", resource: "TEAM", action: "delete" },
];
