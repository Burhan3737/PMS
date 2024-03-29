import React from "react";
import moment from "moment";
import 'moment-timezone'


export default function Times({ timezone, time, taskSession, show }) {
  let duration = '', hours = '', minutes = '', days = ''
  if (taskSession) {
    if (!taskSession.checkout) {
      if (taskSession.timed) {
        duration = moment.duration(moment(time).diff(new Date(taskSession.checkin)));
        hours = Math.floor(duration.asHours());

        minutes = duration.minutes();

      }
    }
  }

  const displaySessionTime = () => {

    if (hours > 0) {
      if (hours > 1) {
        return (`${hours} hours ${minutes} minutes`)
      }

      else {

        return (`${hours} hour ${minutes} minutes`)

      }

    }

    else return (`${minutes} minutes`)







  }

  return (
    <div>

      <div className="time-wrapper">

        <div className="time-small-wrapper">
          <label className="time-label">Local Time</label>


          {moment.tz(time, Intl.DateTimeFormat().resolvedOptions().timeZone).format("dddd, MMM DD, YYYY h:mm A")}

        </div>








        {show && duration && <div className="time-small-wrapper">
          <label className="time-label">Session Time</label>



          {displaySessionTime()}

        </div>}


        {!(timezone === Intl.DateTimeFormat().resolvedOptions().timeZone) && <div className="time-small-wrapper">
          <label className="time-label">{timezone} Time</label>

          {moment.tz(time, timezone).format("dddd, MMM DD, YYYY h:mm A")}


        </div>}



      </div>
    </div>

  )
}