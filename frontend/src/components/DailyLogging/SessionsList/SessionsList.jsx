import React, { Component } from "react";
import moment from "moment";
import 'moment-timezone'
import { utcToZonedTime, format } from 'date-fns-tz';
import { sortBy } from "lodash";
import { updateTimezone, getTimezone } from "../DailyLoggingVars";






class SessionsList extends Component {
  render() {
    moment.tz.setDefault(getTimezone())

    const sortedSessionList = this.props.sessionList ? sortBy(this.props.sessionList, "checkin") : [];
    const sessionsList = sortedSessionList.map((session) => {
      return (
        <SessionList editable={this.props.editable} session={session} key={session._id} handleEditClick={this.props.handleEditClick} />
      );
    });
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-head">
            <tr>
              <th scope="col" style={{ width: "15%" }}>
                Check In
              </th>
              <th scope="col" style={{ width: "15%" }}>
                Check Out
              </th>

              <th scope="col" style={{ width: "15%" }}>
                Timed
              </th>
              <th scope="col" style={{ width: "30%" }}>
                Task
              </th>
              <th scope="col" style={{ width: "15%" }}>
                Project
              </th>
              <th scope="col" style={{ width: "10%" }}>
                Duration (hrs)
              </th>
              <th scope="col" style={{ width: "15%" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{sessionsList}</tbody>
        </table>
      </div>
    );
  }
}

const SessionList = (props) => {
  return (
    <tr key={props.session._id}>

      {/* <td>{props.session.checkin && format(utcToZonedTime(props.session.checkin, timezone), 'MMM d, yyyy h:mm a')
      }</td>
      <td>{props.session.checkin && format(utcToZonedTime(props.session.checkout, timezone), 'MMM d, yyyy h:mm a')
      }</td> */}

      <td>{props.session.checkin && `${moment(props.session.checkin).format("ddd, MMM DD, YYYY h:mm A")}`}</td>
      <td>{props.session.checkout && `${moment(props.session.checkout).format("ddd, MMM DD, YYYY h:mm A")}`}</td>
      <td>{JSON.stringify(props.session.timed)}</td>
      <td>
        <div>{replaceNewLineToBr(props.session.task)}</div>
      </td>
      <td>{props.session.project}</td>
      <td>{calculateDuration(props.session)}</td>
      <td>
        {props.editable && (
          <span
            onClick={(e) => {

              const editSession = Object.assign({}, props.session)
              editSession.checkin = utcToZonedTime(editSession.checkin, getTimezone())
              editSession.checkout = utcToZonedTime(editSession.checkout, getTimezone())

              props.handleEditClick(editSession);
            }}
            className="action-item"
          >
            Edit
          </span>
        )}
      </td>
    </tr>
  );
};

export default SessionsList;

function calculateDuration(session) {
  let val = "";
  if (session && session.checkin && session.checkout) {
    let hourVal = moment(session.checkout).diff(moment(session.checkin), "hours", true);
    let roundedVal = Math.round(hourVal + "e" + 2);
    let roundedPlusDec = roundedVal + "e-" + 2;
    val = Number(roundedPlusDec);
  }
  return val;
}

function replaceNewLineToBr(task) {
  let newString = [];
  if (task) {
    let lineBreakArray = task.split(/\n/); //replace(/\n/g, "</br>");
    newString = lineBreakArray.map((lb) => <div style={{ textAlign: "left", padding: "0px 10px" }}>{lb}</div>);
  }
  return newString;
}
