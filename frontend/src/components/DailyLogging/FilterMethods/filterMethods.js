import _ from "lodash";
import moment from "moment";

export const filtersMethod = {
  Day: calculateDay,
  Week: calculateWeek,
  Month: calculateMonthly,
};

function calculateDay(data, dateRange) {
  let returnData = [...data];
  let filteredData = _.filter((data) => { });
  return returnData;
}
function calculateWeek(data) {
  let returnData = [...data];
  return returnData;
}
function calculateMonthly(data) {
  let returnData = [...data];
  return returnData;
}

function dateInRange(start, end, date) {
  let range = moment().range(start, end);
  return range.contains(date);
}
