import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router";
// import { fetchSingleUser } from "../redux/user"
// import { updateOldUser } from "../redux/user"
import { curdActions } from "../../reduxCURD/actions";
import { CRUDFunction } from "../../reduxCURD/container";

import { button } from "../Common/Forms/formsMiscItems";
import UpdatePassword from "./UpdatePassword";

function EditUser(props) {
  const { id } = useParams();
  const history = useHistory();
  const { user, updateUserAction, getUserAction, getGroups, Groups } = props;

  const [state, setState] = useState({
    email: "",
    name: "",
    password: "",
    mobile: "",
    group_id: "",
    userGroup: 0,
  });

  const [passText, setPassText] = useState("Update Password");

  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [display, setDisplay] = useState(false);

  const handleDisplay = () => {
    setDisplay((old) => !old);
  };

  useEffect(() => {
    if (display === false) setPassText("Update Password");
    else {
      setPassText("Cancel");
    }
  }, [display]);

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    getUserAction(id);
  }, []);

  useEffect(() => {
    if (user) {
      {
        console.log(user.hashedPassword);
      }
      let userGroupName = "";
      for (const group of Groups) {
        if (group.group_id == user.group_id) {
          userGroupName = group.name;
        }
      }
      setState({
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        group_id: user.group_id,
        userGroup: user.userGroup,
        group_name: userGroupName,
      });
    }
  }, [user]);

  const [error, setError] = useState("");

  const { name, email, mobile, group_id, userGroup, group_name } = state;

  const handleChange = (e) => {
    let { name, value } = e.target;
    let id = 0;
    let newGroup_id = "";
    if (name === "group_id") {
      for (const group of Groups) {
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

    setError("");

    if (display) {
      console.log("in password");

      if (password === newPassword) {
        if (!name || !email || !mobile || !group_id || !userGroup || !password || !newPassword) {
          setError("Please Input All Values");
        } else if (window.confirm("Are You Sure?")) {
          console.log({ ...state, password: password });

          updateUserAction({ ...state, password: password }, id);
          console.log(user);

          if (props.userErrorMessage) {
            setError(props.userErrorMessage);
          } else {
            setError("");
            setState({
              email: "",
              name: "",
              mobile: "",
              group_id: "",
              userGroup: 0,
              group_name: "",
            });

            history.push("/usermodule");
          }
        }
      } else {
        setError("Passwords Must Match");
      }
    } else {
      console.log(" not in password");

      if (!name || !email || !mobile || !group_id || !userGroup) {
        setError("Please Input All Values");
      } else if (window.confirm("Are You Sure?")) {
        console.log(state);

        updateUserAction(state, id);
        console.log(user);

        if (props.userErrorMessage) {
          setError(props.userErrorMessage);
        } else {
          setError("");
          setState({
            email: "",
            name: "",
            mobile: "",
            group_id: "",
            userGroup: 0,
            group_name: "",
          });

          history.push("/usermodule");
        }
      }
    }
  };

  // return (
  //   <div className="form-div">
  //     <h2>Edit User</h2>
  //     {error && <h3 style={{ color: 'red' }}>{error}</h3>}
  //     <form onSubmit={handleSubmit}>
  //       <div className="form-wrapper">
  //         <div className="field-wrapper"><label>Name</label>

  //           <input value={name} name='name' onChange={handleChange} type='text' /></div>

  //         <div className="field-wrapper"><label>Email</label>

  //           <input disabled='disabled' value={email} name='email' onChange={handleChange} type='email' /></div>

  //         <div className="field-wrapper"><label>Password</label>

  //           <input value={password} name='password' onChange={handleChange} type='password' /></div>

  //         <div className="field-wrapper"><label>Phone</label>

  //           <input value={mobile} name='mobile' onChange={handleChange} type='text' /></div>

  //         <div className="field-wrapper"><label>User Group</label>
  //           <select placeholder="Select" value={group_name} name='group_id' onChange={handleChange} >
  //             <option >Select</option>
  //             {Groups.map(group => {
  //               return (<option>{group.name}</option>)
  //             })}
  //           </select>
  //         </div>
  //         <button className="create-button" type='submit' >Confirm</button>
  //       </div>
  //     </form>
  //     <button className="create-button" onClick={() => history.push('/usermodule')}>Go Back</button>

  //   </div>

  // )

  return (
    <div className="form-wrapper">
      <div className="user-wrapper">
        <h2>Edit User</h2>

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

            <input className="form-input" disabled="disabled" value={email} name="email" onChange={handleChange} type="email" />
          </div>

          {/* <div className="field-wrapper"><label>Password</label>

            <input type="hidden" className="form-input" onChange={handleChange} /></div> */}

          <div className="field-wrapper">
            <label>Phone</label>

            <input className="form-input" value={mobile} name="mobile" onChange={handleChange} type="text" />
          </div>

          <div className="field-wrapper">
            <label>User Group</label>
            <select className="form-select" placeholder="Select" value={group_name} name="group_id" onChange={handleChange}>
              <option>Select</option>
              {Groups.map((group) => {
                return <option>{group.name}</option>;
              })}
            </select>
          </div>

          {/* {display && <UpdatePassword newPassword={newPassword} setNewPassword={setNewPassword} password={password} setPassword={setPassword} />}

            <div className="feild-wrapper">

              <button type="button" onClick={handleDisplay} className="create-button">{passText}</button>
            </div> */}

          <br></br>

          <button className="create-button" type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}

// const mapStateToProps = (state) => {
//   return {
//     userData: state.user
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     fetchSingleUser: (id) => dispatch(fetchSingleUser(id)),
//     updateOldUser: (user, id) => dispatch(updateOldUser(user, id))
//   }
// }

const updateUserAction = curdActions.updateUser;
const getUserAction = curdActions.getUser;

let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: { updateUserAction, getUserAction },
};
let variableList = {
  userReducer: { user: {} },
};

let myReducer = ["userReducer"];
const EditUserContainer = CRUDFunction(EditUser, "Group", actionOptions, variableList, myReducer, "userGroup");

export default EditUserContainer;
