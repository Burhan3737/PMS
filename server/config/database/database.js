import { createTenant, createPermissions, createUserGroups, createUsers } from "./SeedItems/essentials";

export async function createDatabase() {
  //create tenant
  await createTenant();
  // create permissions
  await createPermissions();
  // create user group
  await createUserGroups();
  // create users
  await createUsers();
}
