import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
//import { addUsers } from "../redux/user"

import { useRef } from "react";
import { CRUDFunction } from "../../reduxCURD/container";
import { curdActions } from "../../reduxCURD/actions";
import { button } from "../Common/Forms/formsMiscItems";

function CreateUser(props) {
  const history = useHistory();
  const { createUserAction, getGroups, groups, users, getUsersAction } = props;

  useEffect(() => {
    getGroups();

    getUsersAction();
  }, []);

  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    userGroup: 0,
    group_id: "",
    group_name: "",
  });

  const [error, setError] = useState("");

  const { name, email, password, mobile, group_id, userGroup, group_name } = state;

  const handleChange = (e) => {
    let { name, value } = e.target;
    let id = 0;
    let newGroup_id = "";

    if (name === "group_id") {
      for (const group of groups) {
        if (group.name == value) {
          id = group._id;
          newGroup_id = group.group_id;
        }
      }
      setState({ ...state, group_name: value, group_id: newGroup_id, userGroup: id });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let emailCheck = false;

    for (const myUser of users) {
      if (myUser.email == email) {
        emailCheck = true;
      }
    }
    if (!name || !email || !password || !mobile || !group_id || !userGroup) {
      setError("Please Input All Values");
    } else if (emailCheck) {
      setError("Email Already Exists");
    } else if (window.confirm("Are You Sure?")) {
      createUserAction(state);
      if (props.userErrorMessage) {
        setError(props.userErrorMessage);
      } else {
        setError("");
        setState({
          name: "",
          email: "",
          password: "",
          mobile: "",
          group_id: "",
          userGroup: 0,
          group_name: "",
        });

        history.push("/usermodule");
      }
    }
  };

  return (
    <div className="form-wrapper">
      <div className="user-wrapper">
        <h2>Create User</h2>

        <button className="create-button" onClick={() => history.push("/usermodule")}>
          Go Back
        </button>
      </div>
      {error && <h3 style={{ color: "red" }}>{error}</h3>}
      <div className="table-wrapper">
        <form className="realform" onSubmit={handleSubmit}>
          <div className="field-wrapper">
            <label>Name</label>

            <input className="form-input" value={name} name="name" onChange={handleChange} type="text" />
          </div>

          <div className="field-wrapper">
            <label>Email</label>

            <input className="form-input" value={email} name="email" onChange={handleChange} type="email" />
          </div>

          <div className="field-wrapper">
            <label>Password</label>

            <input className="form-input" value={password} name="password" onChange={handleChange} type="password" />
          </div>

          <div className="field-wrapper">
            <label>Phone</label>

            <input className="form-input" value={mobile} name="mobile" onChange={handleChange} type="text" />
          </div>

          <div className="field-wrapper">
            <label>User Group</label>
            <select className="form-select" placeholder="Select" value={group_name} name="group_id" onChange={handleChange}>
              <option>Select</option>
              {groups.map((group) => {
                return <option>{group.name}</option>;
              })}
            </select>
          </div>

          <button className="create-button" type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    //userData: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //addUsers: (state) => dispatch(createUser(state))
  };
};

const createUserAction = curdActions.createUser;
const getUsersAction = curdActions.getUsers;

let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: { createUserAction, getUsersAction },
};
let variableList = {
  userReducer: {
    user: {},
    users: [],
  },
};

let myReducer = ["userReducer"];
const CreateuserContainer = CRUDFunction(CreateUser, "group", actionOptions, variableList, myReducer, "userGroup");

export default CreateuserContainer;
