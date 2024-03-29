//import { fetchUsers } from "../redux/user";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
//import { deleteUser } from "../redux/user";
import { useHistory } from "react-router";
import { CRUDFunction } from "../../reduxCURD/container";
import React, { Component } from "react";
import permissionCheck from "../../utils/permissionCheck";
import { isJSON } from "../../utils/isJson";
import { loggedInUser } from "../../utils/util";
import "./usermodulestyle.css";
import { curdActions } from "../../reduxCURD/actions";
import { useRef } from "react";
import UserList from "../User/UserList/UserList";
import { Row, Col } from "reactstrap";
import { button } from "../Common/Forms/formsMiscItems";

function UserDetails(props) {
  const history = useHistory();
  //const { onChange, userData, fetchUsers, deleteUser } = props

  const prevActionType = props.actionType;
  const prevActionTypeRef = useRef(prevActionType);

  const [users, setUsers] = useState([]);

  // const handleDelete = (id) => {
  //   if (window.confirm("Are You Sure?")) {
  //     deleteUser(id)
  //   }
  // }

  // useEffect(() => {
  //   fetchUsers()
  // }, [])

  let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    props.getUsers();
  }, []);

  useEffect(() => {
    setUsers(props.users);
  }, [props.users]);

  useEffect(() => {
    if (prevActionTypeRef.current !== props.actionType && props.actionType === "USERS_READ_SUCCESS") {
      setUsers(props.users);
    }

    if (prevActionTypeRef.current !== props.actionType && props.actionType === "USER_DELETE_SUCCESS") {
      window.alert("User Deleted");
      handleDeleteUser(props.user._id);
    }

    if (prevActionTypeRef.current !== props.actionType && props.actionType === "USER_CREATE_SUCCESS") {
      props.getUsers();
      window.alert("User Created");
    }

    if (prevActionTypeRef.current !== props.actionType) {
      prevActionTypeRef.current = props.actionType;
    }
  }, [props.actionType]);

  const handleDelete = (user) => {
    if (currentUser._id != user._id) {
      if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
        props.deleteUser(user, user._id);
      }
    }
  };

  const handleDeleteUser = (id) => {
    // Remove the team at the specified index from the teams list
    const copyUsers = [...users];
    let updatedUsers = copyUsers.filter((u) => u._id !== id);
    setUsers(updatedUsers);
  };

  return (
    <div className="form-wrapper">
      <div className="user-wrapper">
        <h2>User List</h2>
        <button className="create-button" onClick={() => history.push("/createuser")}>
          Create User
        </button>
      </div>

      {props.errorMessage && <h2 style={{ color: "red" }}>{props.errorMessage}</h2>}

      <div className="table-wrapper">
        <table className="table table-striped table-responsive">
          <thead className="table-head">
            <tr>
              <th>Name </th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr style={{ height: "40px" }}>
                  <td>{user.name} </td>
                  <td>{user.email}</td>
                  <td>
                    {currentUser._id != user._id && (
                      <div className="action-class">
                        <span className="action-item" onClick={() => handleDelete(user)}>
                          {" "}
                          Delete
                        </span>
                        <span className="action-item" onClick={() => history.push(`/edituser/${user._id}`)}>
                          Edit
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// let actionOptions = {
//   create: true,
//   update: true,
//   read: true,
//   delete: true,
//   others: {}
// }

export default CRUDFunction(UserDetails, "user", null, null, null, "users");
