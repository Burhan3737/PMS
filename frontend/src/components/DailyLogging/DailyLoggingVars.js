
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';
//import { formatInTimeZone } from 'date-fns-tz';
import moment from "moment";
import 'moment-timezone';







export const projects = [
  { text: "General", val: "General" },
  { text: "TIMPS", val: "TIMPS" },
  { text: "SITE", val: "SITE" },
  { text: "EUTILS", val: "EUTILS" },
  { text: "GLM", val: "GLM" },
  { text: "RMS", val: "RMS" },
  { text: "GMS", val: "GMS" },
  { text: "SLM", val: "SLM" },
  { text: "Commander", val: "Commander" },
  { text: "Project Management", val: "PMS" },
  { text: "Client Meetings", val: "ClientMeetings" },
  { text: "Interviews", val: "Interviews" },
  { text: "Self Improvements", val: "Self Improvements" },
];







const currentDate = new Date();

let timezone = 'Asia/Karachi';




const convertedDate = utcToZonedTime(currentDate, timezone);

export function getTimezone() {
  return timezone;
}

export const defaultFormVal = {
  checkin: convertedDate,
  checkout: convertedDate,
  task: "",
  timezone: timezone,
  project: projects[0].val,
};

export function updateTimezone(newTimezone) {
  timezone = newTimezone;
  const currentDate = new Date();
  const convertedDate = utcToZonedTime(currentDate, timezone);
  defaultFormVal.checkin = convertedDate
  defaultFormVal.checkout = convertedDate

}

export function editLocation(timezone) {
  defaultFormVal.timezone = timezone
}


export const timezoneList = ["Asia/Karachi", "America/Chicago", "America/New_York", "Europe/London"]
export const timezoneListAlias = ["Pakistan/Lahore", "America/Chicago", "Canada/Toronto", "England/London"]

