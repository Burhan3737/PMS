export const dataFormatters = {
  dateFormatter: (date) => {
    let tempDate = getDate(date);
    if (tempDate === null) {
      return date;
    } else {
      return tempDate.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  },
};
const getDate = (isoDate) => {
  if (!isoDate) return null;
  let date = new Date(isoDate);
  let dateTime = date.getTime();
  if (!isNaN(dateTime)) {
    return date;
  }

  return null;
};
