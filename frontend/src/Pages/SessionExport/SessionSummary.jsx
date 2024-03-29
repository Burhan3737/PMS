import React, { useEffect, useState } from "react";
import styles from "./SessionSummary.module.css";
const SessionSummary = ({ data }) => {
  //   const userData = props.Data;

  const [duration, setDuration] = useState(0);
  const [absents, setAbsents] = useState(0);
  const [month, setMonth] = useState("");

  useEffect(() => {
    let totalDuration = 0;
    let totalAbsents = 0;
    data.forEach((element) => {
      let x = element.Duration;
      if (x !== "") {
        totalDuration += parseFloat(x);
      }
      if (element.Checkin === "") {
        totalAbsents += 1;
      }
    });
    // const avg = (duration / data.length).toFixed(3);
    let date = new Date(data[0].Date);
    let month = date.toLocaleString("en-US", { month: "long" });
    setMonth(month);
    setDuration(totalDuration);
    setAbsents(totalAbsents);
  }, [data]);

  return (
    <div className={`${styles.container}`}>
      <div className={``}>
        <div>
          <h2>Summary</h2>
        </div>
      </div>

      <div class={`${styles.row}`}>
        <table className={`table table-responsive table-striped ${styles.table}`}>
          <thead className="table-head">
            <tr>
              <th>User</th>
              <th>Month</th>
              <th>Total Work Hours</th>
              <th>Number of Absences</th>
              <th>Average Work Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data[0].Member}</td>
              <td>{month}</td>
              <td>{duration} hrs</td>
              <td>{absents}</td>
              <td>{(duration / data.length).toFixed(3)} hrs</td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <br />
    </div>
  );
};

export default SessionSummary;
