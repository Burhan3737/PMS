import User from "../components/User/User";
import UserDetails from "../components/UserModule/UserDetails";
import DailyLogging from "../components/DailyLogging/DailyLogging";
import StatusExport from "../Pages/StatusExport/StatusExport";
import Team from "../Pages/Team/Team";
import CreateUser from "../components/UserModule/CreateUser";
import EditUser from "../components/UserModule/EditUser";
import SessionExportContainer from "../Pages/SessionExport/SessionExport";

let route = [
  //{ path: "/user", component: User },
  { path: "/usermodule", component: UserDetails },
  { path: "/createuser", component: CreateUser },
  { path: "/edituser/:id", component: EditUser },
  { path: "/statusExport", component: StatusExport },
  { path: "/sessionExport", component: SessionExportContainer },
  { path: "/team", component: Team },
  { path: "/", component: DailyLogging },
];
export default route;
