import { useState, useEffect, useRef } from "react";
import { MyButton, button } from "../../components/Common/Forms/formsMiscItems";
import { Row, Col } from "reactstrap";
import { actionOptions } from "../../reduxCURD/actionOptions";
import { CRUDFunction } from "../../reduxCURD/container";
import { downloadCsv } from "../../utils/downloadCsv";
import { dataFormatters } from "../../utils/dateFormatters";
import * as XLSX from "xlsx";
import { StatusContext } from "../../App";
import { useContext } from "react";

const StatusExport = (props) => {
  const status = useContext(StatusContext);

  const { statusExports, setStatusExports } = status;

  const prevActionType = props.actionType;
  const prevActionTypeRef = useRef(prevActionType);
  const handleExport = (qName) => {
    props.getStatusExports(`/exportsummrystatus?${qName}=true`);
  };
  useEffect(() => {
    if (prevActionTypeRef.current !== props.actionType && props.actionType === "STATUSEXPORTS_READ_SUCCESS") {
      setStatusExports(props.statusExports);

      setStatusExports((prevData) =>
        prevData.map((obj) => ({
          ...obj,
          PlannedorUnplanned: "Unplanned",
        })),
      );
      //loadWorkBook(props.statusExports);
    }

    if (prevActionTypeRef.current !== props.actionType) {
      prevActionTypeRef.current = props.actionType;
    }
  }, [props.actionType]);

  //exporting the xlsx file
  const loadWorkBook = (data) => {
    let exportDate = "";
    if (data && data[0]) exportDate = data[0].Date;
    else exportDate = dataFormatters.dateFormatter(new Date());

    let ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 70 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daily Summary");
    XLSX.writeFileXLSX(wb, `TeamStatus${exportDate}.xlsx`);
  };

  const handleChange = (e) => {
    let { name, value, id } = e.target;

    let newStatusExports = [...statusExports];

    newStatusExports[id] = { ...newStatusExports[id], [name]: value };

    setStatusExports([...newStatusExports]);
  };

  const addRow = (e) => {
    setStatusExports([
      ...statusExports,
      { Date: statusExports[0].Date, Member: "", Project: "", TaskSummary: "", Team: "", PlannedorUnplanned: "Unplanned" },
    ]);
  };

  const deleteRow = (e) => {
    let { name, value, id } = e.target;
    const data = [...statusExports];
    data.splice(id, 1);
    setStatusExports([...data]);
  };

  return (
    <div>
      {/* <Row>
        <Col className="task-area" md={12}>
          <h3> Export Summary Data </h3>
          <button  onClick={(e) => handleExport("today")}>Today</button >
          <button  onClick={(e) => handleExport("yesterday")}>Yesterday</button >
        </Col>
      </Row> */}

      <div className="form-wrapper">
        <h2> Export Summary Data </h2>
        <div className="export-button-wrapper">
          <button className="create-button" onClick={(e) => handleExport("today")}>
            Today
          </button>
          <button className="create-button" onClick={(e) => handleExport("yesterday")}>
            Yesterday
          </button>
        </div>

        <>
          <input
            type="date"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              margin: "8px",
            }}
            onChange={(e) => handleExport(e.target.value)}
          />
        </>

        {statusExports[0] && (
          <button className="create-button" onClick={(e) => loadWorkBook(statusExports)}>
            Export Data
          </button>
        )}
        {statusExports[0] && (
          <div className="table-wrapper">
            <table className="table table-striped table-responsive">
              <thead className="table-head">
                <tr>
                  <th>Date</th>
                  <th>Member</th>
                  <th>Project</th>
                  <th>Task Summary</th>
                  <th>Planned/UnPlanned</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {statusExports.map((status, index) => {
                  return (
                    <tr>
                      <td>{status.Date}</td>
                      <td>
                        <input className="export-input" value={status.Member} id={index} onChange={handleChange} name="Member" />
                      </td>
                      <td>
                        <input className="export-input" value={status.Project} id={index} onChange={handleChange} name="Project" />
                      </td>
                      <td>
                        <textarea
                          className="export-input-task"
                          value={status.TaskSummary}
                          id={index}
                          onChange={handleChange}
                          name="TaskSummary"
                        ></textarea>
                      </td>
                      <td>
                        <select
                          className="export-input"
                          value={status.PlannedorUnplanned}
                          name="PlannedorUnplanned"
                          id={index}
                          onChange={handleChange}
                        >
                          <option>UnPlanned</option>
                          <option>Planned</option>
                        </select>
                      </td>
                      <td>
                        <button className="del-row-but" id={index} onClick={deleteRow}>
                          X
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {statusExports[0] && (
        <button className="create-button" onClick={addRow}>
          Add Row
        </button>
      )}
    </div>
  );
};
const StatusExportContainer = CRUDFunction(StatusExport, "statusExport", actionOptions, null, null, "taskSession");
export default StatusExportContainer;
