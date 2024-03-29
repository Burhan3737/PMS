import React from "react";
import "./style.css";

import { languageService } from "../../Language/language.service";
import { logOut } from "react-icons-kit/ionicons/logOut";
import { Icon } from "react-icons-kit";

import { loadTopMethods } from "./navBarItems";

const TopBarView = (props) => {
  const { notifications } = props;
  let notificationCount = 0;
  if (notifications) {
    notificationCount = notifications.reduce((count, noti) => {
      if (noti.status === "unread") count++;

      return count;
    }, 0);
  }

  return (
    <header className="header">
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html:
            "@media print{.report-controls,.report-print,header,div#sideNav,.report-arrow,.nav-wrapper{display: none;}.main-content-area{top:0 !important;left:0 !important;position:relative !important;background:#fff}}.comment-box { page-break-inside: avoid !important; }",
        }}
      />

      {props.userLoggedOn && (
        <div className="user-area-topbar">
          <div className="top-bar-area"> {loadTopMethods(props.history)}</div>
          <div>
            <ul className="list-unstyled">
              <li
                data-value="value 3"
                onClick={(e) => {
                  props.history.push("/user");
                }}
              >
                {languageService("Hi")}, {props.userName.name}
              </li>
              <li>
                <div className={`notification-bar-click ${notificationCount > 0 ? "active" : ""}`} onClick={props.toggleRight}></div>
              </li>
              <li> |</li>{" "}
              <li>
                <a className="nav-link" id="Logout" href="/Logout">
                  <div>
                    <Icon size={20} icon={logOut} />
                    <span>{languageService("Logout")}</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};
export default TopBarView;
