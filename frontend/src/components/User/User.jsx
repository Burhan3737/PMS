import React, { Component } from "react";
import { CRUDFunction } from "../../reduxCURD/container";
import { Row, Col } from "reactstrap";
import permissionCheck from "../../utils/permissionCheck";
import { isJSON } from "../../utils/isJson";
import { loggedInUser } from "../../utils/util";
import UserList from "./UserList/UserList";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidMount() {
    let viewUserCheck = permissionCheck("USER", "view");
    if (!viewUserCheck) {
      this.props.history.push("/");
    }
    const currentUser = isJSON(loggedInUser());
    if (currentUser) {
      this.setState({
        selectedUserId: currentUser._id,
        addUser: false,
        currentUser: currentUser,
      });
    }
    this.props.getUsers();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.name !== this.state.name) {
      this.handler();
    }
  }

  componentWillUnmount() { }

  // Prototype methods, Bind in Constructor (ES2015)
  handleEvent() { }

  // Class Properties (Stage 3 Proposal)
  handler = () => {
    this.setState();
  };

  render() {
    return (
      <div>

        <Row>
          <Col md={4}>
            <UserList userLIst={this.props.users} />
          </Col>
          <Col md={4}>Staff Profile</Col>
        </Row>
      </div>
    );
  }
}
//export default CRUDFunction(User, "user", null, null, null, "users");
