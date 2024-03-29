import React, { Component } from "react";
import { loggedInUser } from "../../utils/util";
import { InputDateField, Label, InputFieldCustom, TextAreaField, SelectField } from "../FormInputs/InputFields";
import { Col, Row } from "reactstrap";
import Icon from "react-icons-kit";
import { pmsThemeColors } from "../../style/basic/basicColors";
import { check } from "react-icons-kit/metrize/check";
import { cross } from "react-icons-kit/metrize/cross";
import { themeService } from "../../theme/service/activeTheme.service";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { refresh } from "react-icons-kit/metrize/refresh";
import { play } from "react-icons-kit/metrize/play";
import { stop } from "react-icons-kit/metrize/stop";
import { defaultFormVal, projects } from "./DailyLoggingVars";
import { Tooltip } from "reactstrap";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import moment from "moment";
import "moment-timezone";
import { getTimezone, updateTimezone, editLocation } from "./DailyLoggingVars";
import { timezoneList, timezoneListAlias } from "./DailyLoggingVars";
import Times from "./Times";

import {
  handleAddSessionState,
  resetOrEditMethod,
  cancelMethod,
  saveSession,
  loadFormRelatedState,
  getSessions,
  getActiveSession,
  editMode,
  convertTimezone,
} from "./DailyLoggingMethods";
import { CRUDFunction } from "../../reduxCURD/container";
import { isJSON } from "../../utils/isJson";
import SessionsList from "./SessionsList/SessionsList";
import "./style.css";
import { filtersMethod } from "./FilterMethods/filterMethods";
import FilterArea from "./FilterMethods/FilterArea";
import permissionCheck from "../../utils/permissionCheck";
import { curdActions } from "../../reduxCURD/actions";
import { UserSelectArea } from "./FilterMethods/UserSelectArea";

const filterValues = {
  Day: { from: moment().startOf("d"), to: moment().endOf("d") },
  Week: { from: moment().startOf("w"), to: moment().endOf("w") },
  Month: { from: moment().startOf("month"), to: moment().endOf("month") },
};
class DailyLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: { ...defaultFormVal },
      addMode: false,
      editMode: false,
      changeInForm: false,
      selectedSession: null,
      editExistingSession: null,
      filterMode: "Week",
      range: filterValues["Week"],
      userSelectAllowed: false,
      time: new Date(),
      sessionClicked: false,
      timezone: getTimezone(),
    };
    this.timeInterval = null;
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleActions = this.handleActions.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleFilterMoveClick = this.handleFilterMoveClick.bind(this);
    this.handleUserSelect = this.handleUserSelect.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.loggedInUser = isJSON(loggedInUser());
  }

  handleFilterMoveClick(direction) {
    let dateRange = { ...this.state.range };
    let dateLogic = {
      Day: "d",
      Week: "w",
      Month: "month",
    };
    if (direction == 1) {
      // right
      dateRange.from.add(1, dateLogic[this.state.filterMode]);
      dateRange.to.add(1, dateLogic[this.state.filterMode]);
    } else {
      // left
      dateRange.from.subtract(1, dateLogic[this.state.filterMode]);
      dateRange.to.subtract(1, dateLogic[this.state.filterMode]);
    }
    this.fetchFromServer(this.state.selectedUser, dateRange);
    this.setState({ range: dateRange });
  }
  handleFilterClick(filter) {
    let dateRange = filterValues[filter];
    this.fetchFromServer(this.state.selectedUser, dateRange);
    this.setState({
      filterMode: filter,
      range: dateRange,
    });
  }
  handleAddClick() {
    if (!this.state.addMode) {
      this.setState(handleAddSessionState());
    }
  }
  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }
  componentDidMount() {
    this._isMounted = true;

    this.loggedInUser = isJSON(loggedInUser());
    if (this.loggedInUser) {
      getSessions(this.loggedInUser._id, this.state.range, this.props.getTaskSessions);
      getActiveSession(this.loggedInUser._id, this.state.range, this.props.getTaskSession);

      this.multipleUserSelectionMethod(this.loggedInUser);
      this.setState({
        selectedUser: this.loggedInUser._id,
      });
    }

    this.timeInterval = setInterval(() => {
      this.setState({
        time: new Date(),
      });
      updateTimezone(getTimezone());
    }, 40000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType === "TASKSESSION_READ_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      if (this.props.taskSession) {
        this.setState({
          sessionClicked: true,
        });
      } else if (!this.props.taskSession) {
        this.setState({
          sessionClicked: false,
        });
      }
    }
    if (this.props.actionType === "TASKSESSION_CREATE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      let stateToSet = cancelMethod();
      stateToSet.selectedUser = this.loggedInUser._id;
      this.setState(stateToSet);
      this.fetchFromServer(this.loggedInUser._id);
    }
    if (this.props.actionType === "TASKSESSION_UPDATE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      let stateToSet = cancelMethod();
      stateToSet.selectedUser = this.loggedInUser._id;
      this.setState(stateToSet);
      this.fetchFromServer(this.loggedInUser._id);
    }
  }

  componentWillUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  multipleUserSelectionMethod(loggedInUser) {
    if (loggedInUser && loggedInUser._id) {
      let permCheck = permissionCheck("USER", "manager_view");
      if (permCheck) {
        this.props.getUsers();
        this.setState({
          userSelectAllowed: true,
        });
      }
    }
  }

  async fetchFromServer(userId, range) {
    if (userId) {
      getSessions(userId, range ? range : this.state.range, this.props.getTaskSessions);
    }
  }
  handleChange(value, name, blur) {
    let form = { ...this.state.form };
    form[name] = value;
    if (name === "checkin") {
      if (form.checkout < form.checkin) form.checkout = form.checkin;
    }
    this.setState({
      form: form,
      changeInForm: true,
    });
  }

  handleTimeChange(e) {
    if (e.target.value != "Select Timezone") {
      updateTimezone(e.target.value);
      this.setState({
        timezone: e.target.value,
      });

      console.log(getTimezone());

      if (this.state.addMode || this.state.editMode) {
        this.setState(cancelMethod);
      }
    }
  }

  handleActions(mode) {
    if (mode > 0) {
      console.log("In overall edit", this.props.taskSession);

      let stateToSet = loadFormRelatedState(this.state);

      console.log("State in overall", stateToSet);

      if (mode === 1) {
        if (stateToSet.form.timed === true) {
          if (
            stateToSet.form.checkin !== this.state.selectedSession.checkin ||
            stateToSet.form.checkout !== this.state.selectedSession.checkout
          )
            stateToSet.form = {
              ...stateToSet.form,
              timed: false,
            };
        }

        console.log("Added", stateToSet);

        stateToSet.form.timezone = getTimezone();

        convertTimezone(stateToSet, getTimezone());

        // //updating timezone on addition or edit
        editLocation(getTimezone());

        saveSession(stateToSet, this.loggedInUser, this.props.createTaskSession, this.props.updateTaskSession);
      } else if (mode === 2 && this.state.selectedSession !== null) {
        stateToSet.form.timezone = this.state.selectedSession.timezone;
        console.log("Reset or Edit", this.state.selectedSession);

        resetOrEditMethod(stateToSet, this.state.selectedSession);
      } else if (mode === 3) {
        console.log("Cancel", this.state.selectedSession);

        stateToSet = cancelMethod();
      }

      //start session
      else if (mode === 4) {
        this.setState({
          sessionClicked: true,
        });

        stateToSet.form = {
          ...stateToSet.form,
          timed: true,
        };

        stateToSet.form.checkin = utcToZonedTime(new Date(), getTimezone());
        stateToSet.form.checkout = null;

        console.log(stateToSet);

        stateToSet.form.timezone = getTimezone();

        convertTimezone(stateToSet, getTimezone());

        //updating timezone on addition or edit
        editLocation(getTimezone());

        saveSession(stateToSet, this.loggedInUser, this.props.createTaskSession, this.props.updateTaskSession);
      }

      //stop session
      else if (mode === 5 && this.props.taskSession.timed && !this.props.taskSession.checkout) {
        this.setState({
          sessionClicked: false,
        });

        console.log("IN STOP", this.props.taskSession);
        stateToSet.form = { ...this.props.taskSession };

        stateToSet.form.checkin = utcToZonedTime(new Date(this.props.taskSession.checkin), getTimezone());

        stateToSet.form.checkout = utcToZonedTime(new Date(), getTimezone());

        stateToSet.form.timezone = getTimezone();

        convertTimezone(stateToSet, getTimezone());

        //updating timezone on addition or edit
        editLocation(getTimezone());

        saveSession(stateToSet, this.loggedInUser, this.props.createTaskSession, this.props.updateTaskSession);
      }

      console.log("After perfroming action", this.props.taskSession);

      this.setState(stateToSet);

      getActiveSession(this.loggedInUser._id, this.state.range, this.props.getTaskSession);
    }
  }

  handleEditClick(session) {
    let stateToSet = loadFormRelatedState(this.state);
    editMode(stateToSet, session);
    this.setState(stateToSet);
  }
  handleUserSelect(user_id) {
    this.setState({
      selectedUser: user_id,
    });
    this.fetchFromServer(user_id);
  }

  render() {
    return (
      <Row>
        <Col className="task-area" md={12}>
          <Times
            timezone={getTimezone()}
            time={this.state.time}
            show={this.state.sessionClicked}
            taskSession={this.props.taskSession}
          ></Times>
        </Col>

        <Col className="task-area" md={12}>
          <div className="session-first">
            <h2>Task Sessions</h2>
            <Row>
              <select value={this.state.timezone} onChange={this.handleTimeChange} className="form-select-session">
                <option>Select Timezone</option>
                {timezoneList.map((timezone, index) => {
                  return <option value={timezoneList[index]}>{timezone}</option>;
                })}
              </select>
            </Row>

            <div className="session-first">
              {/* for timed session  play */}

              <span
                style={{
                  ...themeService(dailyStyles.iconStyle),
                  color: "green",
                  color: this.state.sessionClicked ? "grey" : "green",
                  cursor: this.state.sessionClicked ? "not-allowed" : "pointer",
                }}
                onClick={async (e) => {
                  await getActiveSession(this.loggedInUser._id, this.state.range, this.props.getTaskSession);
                  if (!this.props.taskSession) {
                    this.handleActions(4);
                  }
                }}
                id="Start"
              >
                <Icon icon={play} size={35} />
              </span>

              {/* for timed session  stop */}
              <span
                style={{
                  ...themeService(dailyStyles.iconStyle),
                  color: "#610016",

                  color: this.state.sessionClicked ? "#610016" : "grey",
                  cursor: this.state.sessionClicked ? "pointer" : "not-allowed",
                }}
                onClick={async (e) => {
                  await getActiveSession(this.loggedInUser._id, this.state.range, this.props.getTaskSession);

                  if (this.props.taskSession) {
                    this.handleActions(5);
                  }
                }}
                id="Stop"
              >
                <Icon icon={stop} size={35} />
              </span>

              <span className="add-click" onClick={this.handleAddClick}>
                <Icon icon={withPlus} size={42} />
              </span>
            </div>
          </div>

          {(this.state.addMode || this.state.editMode) && (
            <CheckinOutArea
              handleChange={this.handleChange}
              changeInForm={this.state.changeInForm}
              form={this.state.form}
              handleActions={this.handleActions}
              tooltipOpen={this.state.tooltipOpen}
              toggle={this.toggle}
              selectedSession={this.state.selectedSession}
            />
          )}
        </Col>

        <Col className="task-area" md={12}>
          <div className="session-first">
            <h2>Task Sessions List</h2>

            <div>
              {this.state.userSelectAllowed && (
                <UserSelectArea
                  className="form-select"
                  onUserSelectChange={this.handleUserSelect}
                  selectedUser={this.state.selectedUser}
                  userList={this.props.users}
                  label="User"
                />
              )}
            </div>
          </div>

          <br></br>

          <FilterArea
            handleFilterClick={this.handleFilterClick}
            filterMode={this.state.filterMode}
            dateRange={this.state.range}
            handleFilterMoveClick={this.handleFilterMoveClick}
          />
          <SessionsList
            sessionList={this.props.taskSessions}
            handleEditClick={this.handleEditClick}
            editable={this.loggedInUser && this.loggedInUser._id === this.state.selectedUser}
          />
        </Col>
      </Row>
    );
  }
}

let variableList = {
  userReducer: { users: [] },
};
const getUsers = curdActions.getUsers;
let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getUsers },
};
let reds = ["userReducer"];
let DailyLoggingContainer = CRUDFunction(DailyLogging, "taskSession", actionOptions, variableList, reds);
export default DailyLoggingContainer;

function CheckinOutArea(props) {
  return (
    <div>
      <InputDateField
        label="Check-In"
        changeHandler={(date, blurValue) => {
          props.handleChange(date, "checkin", blurValue);
        }}
        value={props.form.checkin}
        dayTimePickerProps={{ disableClock: true }}
        style={{ display: "inline-block" }}
      />
      <TextAreaField
        label="Task"
        changeHandler={(e, blurValue) => {
          props.handleChange(e.target.value, "task", blurValue);
        }}
        value={props.form.task}
        style={{ display: "inline-block" }}
        inputStyle={{ width: "300px" }}
      />
      <SelectField
        label="Project"
        options={projects}
        value={props.form.project}
        changeHandler={(e, blurValue) => {
          console.log(e);
          props.handleChange(e.target.value, "project", blurValue);
        }}
      />
      <InputDateField
        label="Check-Out"
        changeHandler={(date, blurValue) => {
          props.handleChange(date, "checkout", blurValue);
        }}
        value={props.form.checkout}
        dayTimePickerProps={{ disableClock: true }}
        style={{ display: "inline-block", margin: "0px 15px" }}
      />
      <span
        style={{
          ...themeService(dailyStyles.iconStyle),
          color: props.changeInForm ? pmsThemeColors.third : "grey",
          cursor: props.changeInForm ? "pointer" : "not-allowed",
        }}
        onClick={(e) => {
          if (props.changeInForm) props.handleActions(1);
        }}
        id="check"
      >
        <Icon icon={check} size={24} />
      </span>
      {/* <Tooltip placement="top" isOpen={props.tooltipOpen} target="check" toggle={props.toggle}>
        Check In
      </Tooltip> */}
      <span
        style={{ ...themeService(dailyStyles.iconStyle), color: pmsThemeColors.third }}
        onClick={(e) => {
          props.handleActions(2);
        }}
        id="refresh"
      >
        <Icon icon={refresh} size={24} />
      </span>
      {/* <Tooltip placement="top" isOpen={props.tooltipOpen} target="refresh" toggle={props.toggle}>
        Refresh
      </Tooltip> */}
      <span
        style={{ ...themeService(dailyStyles.iconStyle), color: "#610016" }}
        onClick={(e) => {
          props.handleActions(3);
        }}
        id="Cancel"
      >
        <Icon icon={cross} size={24} />
      </span>

      {/* <Tooltip placement="top" isOpen={props.tooltipOpen} target="Cancel" toggle={props.toggle}>
        Cancel
      </Tooltip> */}
    </div>
  );
}

const dailyStyles = {
  iconStyle: { tenant: { padding: "0px 5px", cursor: "pointer" } },
  taskAreaStyle: { tenant: { background: pmsThemeColors.fourth, margin: "15px", padding: "10px" } },
  headingthird: { tenant: { textAlign: "left", padding: "0px 15px" } },
};
