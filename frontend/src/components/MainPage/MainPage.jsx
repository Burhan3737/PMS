import React, { Component } from "react";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import _ from "lodash";
// import ForgotPassword from "components/Login/ForgotPassword/ForgotPassword";
// import VerifyResetPass from "components/Login/ForgotPassword/VerifyResetPass";
// import ResetPassword from "components/Login/ForgotPassword/ResetPassword";
//import { sidebarWidth, sidebarWidthSmall } from "components/Common/Variables/CommonVariables";
//import "../../style/basic/color.css";
import LoginContainer from "containers/LoginContainer";
import Logout from "containers/LogOutContainer";
//import Test from 'components/TestComponent/test'
// import Data from 'components/data/data'
import { getServerEndpoint } from "utils/serverEndpoint";
import routePath from "routes/routes.js";
import TopBarContainer from "../TopBar/TopBar";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topBarVisible: true,
      userLoggedOn: false,
      routes: [],
      user: "",
      //showSideNav: true,
      language: "en",
      theme: "tenant",
      // rightValue: "-20%",
      routeComponent: routePath.map((route, index) => {
        return <Route key={route.path} path={route.path} component={route.component} />;
      }),
      // hideNav: window.innerWidth,
      // sidebarWidth: sidebarWidth,
      // textDisplay: "inline-flex",
      // sideNavDispaly: "0px",
      // hideToolTip: window.innerWidth <= 760,
      // mainSectionLeft: this.isLoggedOn() ? sidebarWidth : 0,
    };
  }

  isLoggedOn = () => localStorage.getItem("access_token") !== null;
  loggedInUser = () => localStorage.getItem("loggedInUser");
  componentWillMount() {
    //themeService("retro");
    localStorage.setItem("theme", this.state.theme);
    if (
      !this.isLoggedOn() &&
      !this.props.history.location.pathname.includes("confirmreset") &&
      !this.props.history.location.pathname.includes("resetPassword")
    ) {
      this.props.history.push("/login");
    }
  }

  render() {
    const { topBarVisible } = this.state;
    // const loginScreen = (
    //   <div className="App-container">
    //     <div className="App-login">
    //       <LoginContainer />
    //     </div>
    //   </div>
    //);

    let switchComp = (
      <Switch>
        <Route path="/login" component={LoginContainer} />
        <Route path="/logout" component={Logout} />

        {/* <Route path="/diagnostics" component={Diagnostics} /> */}
        {/* <Route path="/forgotPassword" component={ForgotPassword} />
        <Route path="/confirmreset/:id" component={VerifyResetPass} />
        <Route path="/resetPassword" component={ResetPassword} /> */}
        {this.state.routeComponent}
      </Switch>
    );
    return (
      <React.Fragment>
        {/* <SocketIO /> */}
        {topBarVisible && <TopBarContainer />}
        <div className="main-content-area">{switchComp}</div>
      </React.Fragment>
    );
  }
}

export default withRouter(MainPage);
