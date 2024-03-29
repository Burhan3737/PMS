export const arrayToCsv = (arr) => {
  let cols = [];
  let header = "";
  if (arr && arr.length > 0) {
    cols = Object.keys(arr[0]);
    header = cols
      .map((val) => String(val)) // convert every value to String
      .join(","); // comma-separated-and-line-separated
  }
  return (
    header +
    "\r\n" +
    arr
      .map(
        (row) =>
          Object.keys(row)
            .map((key) => row[key])
            .map(String) // convert every value to String
            .join(","), // comma-separated
      )
      .join("\r\n")
  ); // rows starting on new lines
};
