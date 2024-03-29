import { useState, useEffect, useRef } from "react";
import { MyButton, button } from "../../components/Common/Forms/formsMiscItems";
import { Row, Col } from "reactstrap";
import { UserSelectArea } from "../../components/DailyLogging/FilterMethods/UserSelectArea";
import { CRUDFunction } from "../../reduxCURD/container";
import { downloadCsv } from "../../utils/downloadCsv";
import { dataFormatters } from "../../utils/dateFormatters";
import * as XLSX from "xlsx";

import FilterArea from "../../components/DailyLogging/FilterMethods/FilterArea";
import moment from "moment";
import "moment-timezone";
import { curdActions } from "../../reduxCURD/actions";
import { SelectField } from "../../components/FormInputs/InputFields";
import { isLoggedOn } from "../../utils/util";
import { isJSON } from "../../utils/isJson";
import { loggedInUser } from "../../utils/util";
import { NumberFormat } from "xlsx";
import SessionSummary from "./SessionSummary";
// import "bootstrap/dist/css/bootstrap.min.css";

const filterValues = {
  Day: { from: moment().startOf("d"), to: moment().endOf("d") },
  Week: { from: moment().startOf("w"), to: moment().endOf("w") },
  Month: { from: moment().startOf("month"), to: moment().endOf("month") },
};

const SessionExport = (props) => {
  const [filterMode, setFilterMode] = useState("Month");
  const [range, setRange] = useState(filterValues["Month"]);
  //const [sessions, setSession] = useState([]);

  const [filterBy, setFilterBy] = useState("User");

  const prevActionType = props.actionType;
  const prevActionTypeRef = useRef(prevActionType);

  const [selectedUser, setSelectedUser] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [tableDataIndex, setTableDataIndex] = useState(0);
  useEffect(() => {
    props.getTeams();
    props.getUsers();
    const loggedUser = isJSON(loggedInUser());
    // fetchFromServer(range);
    if (loggedUser) {
      setSelectedUser(loggedUser._id);
    }
  }, []);

  useEffect(() => {
    if (prevActionTypeRef.current !== props.actionType && props.actionType === "SESSIONEXPORTS_READ_SUCCESS") {
      // setSessionExports(props.SessionExports)
      // setSessionExports(prevData => (
      //   prevData.map(obj => ({
      //     ...obj,
      //     PlannedorUnplanned: "Unplanned"
      //   }))
      // ));
      setTableData(props.SessionExports);

      //setSession(props.SessionExports);
    }

    if (prevActionTypeRef.current !== props.actionType) {
      prevActionTypeRef.current = props.actionType;
    }
  }, [props.actionType]);

  useEffect(() => {
    fetchFromServer(range, filterBy, selectedUser);
  }, [range, filterBy, selectedUser]);

  function handleExportClick() {
    // fetchFromServer(range, filterBy, selectedUser);
    loadWorkBook(tableData);
  }
  //exporting the xlsx file
  const loadWorkBook = (dataArray) => {
    if (dataArray && dataArray.length > 0) {
      let exportDate = "";
      exportDate = dataFormatters.dateFormatter(new Date());
      const formattedFromDate = range.from.format("D MMM YY");
      const formattedToDate = range.to.format("D MMM YY");

      let dateRange = `${formattedFromDate} - ${formattedToDate}`;

      // header[filterBy === "Team" ? "Team Lead's Name" : "User's Name"] = props.users.find((u) => u._id === selectedUser).name;

      const wb = XLSX.utils.book_new();
      for (let data of dataArray) {
        let absents = 0;

        let newData = data.map((d) => {
          if (!d.Checkin) {
            absents += 1;
          }

          const { Member, ...newObj } = d;
          return newObj;
        });

        let header = { Member: data[0].Member, Absents: absents };
        let ws = XLSX.utils.json_to_sheet([header]);
        XLSX.utils.sheet_add_json(ws, newData, { origin: 3 });

        for (let R = 5; R <= newData.length + 4; R++) {
          const checkinCell = "B" + R;
          const checkoutCell = "C" + R;
          try {
            ws[checkinCell].z = "h:mm AM/PM";
            ws[checkoutCell].z = "h:mm AM/PM";
          } catch (e) {
            console.log(e);
          }
        }

        ws["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];

        XLSX.utils.book_append_sheet(wb, ws, `${data[0].Member}`);
      }

      dateRange = dateRange.toString();

      XLSX.writeFileXLSX(wb, `SessionSummary-${dateRange}.xlsx`);
    }
  };

  function handleFilterMoveClick(direction) {
    let dateRange = { ...range };
    let dateLogic = {
      Day: "d",
      Week: "w",
      Month: "month",
    };
    if (direction == 1) {
      // right
      dateRange.from.add(1, dateLogic[filterMode]);
      dateRange.to.add(1, dateLogic[filterMode]);
    } else {
      // left
      dateRange.from.subtract(1, dateLogic[filterMode]);
      dateRange.to.subtract(1, dateLogic[filterMode]);
    }
    //fetchFromServer(dateRange);

    setRange(dateRange);
  }
  function handleFilterClick(filter) {
    let dateRange = filterValues[filter];
    //fetchFromServer(dateRange);

    setFilterMode(filter);
    setRange(dateRange);
  }

  function handleFilterByChange(filter) {
    //fetchFromServer(dateRange);

    setFilterBy(filter);
  }

  function convertToTeam(users, teams) {
    let usersToReturn = [];
    teams.forEach((t) => {
      let found = -1;
      if (t && t.teamLead) {
        found = users.find((u) => u.email === t.teamLead.email);
      }
      if (found) {
        usersToReturn.push(found);
      }
    });

    return usersToReturn;
  }

  function fetchFromServer(Range, FilterBy, SelectedUser) {
    getSessions(Range ? Range : range, FilterBy ? FilterBy : filterBy, SelectedUser ? SelectedUser : selectedUser, props.getSessionExports);
  }
  function excelDateToJSDateString(excelDate) {
    if (excelDate) {
      const dateOffset = 25569;
      const milliseconds = (excelDate - dateOffset) * 24 * 60 * 60 * 1000;
      const jsDate = new Date(milliseconds);
      return jsDate.toDateString();
    }
    return "";
  }
  function getSessions(range, FilterBy, SelectedUser, method) {
    let query = "";

    if (range) {
      var jsonArray = encodeURIComponent(JSON.stringify(range));
      query = query + "?range=" + jsonArray;
    }

    if (FilterBy && range) {
      query = query + "&filterBy=" + FilterBy;
    }

    if (FilterBy && range && SelectedUser) {
      query = query + "&selectedUser=" + SelectedUser;
    }
    method(`/exportsessionstatus/${query}`);
  }

  function handleUserSelect(user_id) {
    setSelectedUser(user_id);

    //this.fetchFromServer(user_id);
  }

  return (
    <div>
      <div className="form-wrapper">
        <h2> Export Session Summary Data </h2>

        <button className="create-button" onClick={handleExportClick}>
          Export Data
        </button>
      </div>
      <div className="form-wrapper">
        <h2> Filter Area</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ width: "400px" }}>
            <UserSelectArea
              className="form-select"
              onUserSelectChange={handleUserSelect}
              selectedUser={selectedUser}
              customStyle={{ width: "200px" }}
              userList={filterBy === "Team" ? convertToTeam(props.users, props.teams) : props.users}
              label={filterBy === "Team" ? "Team Lead" : filterBy}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "500px",
            }}
          >
            <select value={filterBy} onChange={(e) => handleFilterByChange(e.target.value)} className="form-select-session">
              <option value={"Team"}>Filter By Team</option>;<option value={"User"}>Filter By User</option>;
            </select>
          </div>

          <div style={{ width: "400px" }}>
            <FilterArea
              handleFilterClick={handleFilterClick}
              filterMode={filterMode}
              dateRange={range}
              customStyle={{ textAlign: "right" }}
              handleFilterMoveClick={handleFilterMoveClick}
            />
          </div>
        </div>
      </div>
      <div className="form-wrapper">
        <h2>Table</h2>
        {tableData.length > 0 && (
          <select
            name=""
            id=""
            onChange={(e) => {
              console.log(e.target.value);
              setTableDataIndex(e.target.value);
            }}
          >
            {tableData.map((row, index) => (
              <option key={index} value={index}>
                {row[0].Member}
              </option>
            ))}
          </select>
        )}

        <div className="table-wrapper">
          <table className="table table-striped table-responsive">
            <thead className="table-head">
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  Sr.No
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Member
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Date
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Checkin
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Checkout
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 &&
                (tableData[tableDataIndex] || tableData[0]).map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.Member}</td>
                    <td>{entry.Date}</td>
                    <td>{excelDateToJSDateString(entry.Checkin)}</td>
                    <td>{excelDateToJSDateString(entry.Checkout)}</td>
                    <td>{entry.Duration}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {tableData.length > 0 && <SessionSummary data={tableData[tableDataIndex] || tableData[0]} />}
      </div>
    </div>
  );
};

let variableList = {
  userReducer: { users: [] },
  teamReducer: { teams: [] },
};
const getUsers = curdActions.getUsers;
const getTeams = curdActions.getTeams;
let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getUsers, getTeams },
};
let reds = ["userReducer", "teamReducer"];

const SessionExportContainer = CRUDFunction(SessionExport, "SessionExport", actionOptions, variableList, reds, "taskSession");
export default SessionExportContainer;
