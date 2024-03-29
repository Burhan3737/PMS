import { MyButton } from "../Common/Forms/formsMiscItems";
import permissionCheck from "../../utils/permissionCheck";
export const navBarItems = [
  {
    name: "Session",
    path: "/",
  },
  { name: "Team", path: "/team", permission: { entity: "USER", action: "manager_view" } },
  { name: "Status Summary", path: "/statusexport", permission: { entity: "USER", action: "manager_view" } },
  //{ name: "User", path: "user", permission: { entity: "USER", action: "manager_view" } },
  { name: "Session Summary", path: "/sessionexport", permission: { entity: "USER", action: "manager_view" } },
  { name: "User", path: "/usermodule", permission: { entity: "USER", action: "manager_view" } },
];

export function loadTopMethods(history) {
  let toRet = navBarItems.map((item) => {
    return <>{checkItemPermission(item) && <MyButton onClick={(e) => history.push(item.path)}>{item.name} </MyButton>}</>;
  });
  return toRet;
}

function checkItemPermission(item) {
  return item.permission ? permissionCheck(item.permission.entity, item.permission.action) : true;
}
