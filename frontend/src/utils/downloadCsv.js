import { languageService } from "../Language/language.service";
import { arrayToCsv } from "./arrayToCsv";

export const downloadCsv = (rows, doc, filename) => {
  if (rows && rows.length > 0) {
    let csv = arrayToCsv(rows);
    var hiddenElement = doc.createElement("a");
    var universalBOM = "\uFEFF";
    hiddenElement.href = "data:text/csv; charset=utf-8," + encodeURIComponent(universalBOM + csv);
    hiddenElement.target = "_blank";
    // provide the name for the CSV file to be downloaded
    hiddenElement.download = `${filename}.csv`;
    hiddenElement.click();
    console.log(`${languageService("Successfully exported")} ${rows.length} ${languageService("records to")} '${hiddenElement.download}'.`);
  } else {
    console.log(`${languageService("No Records Available")}!`);
  }
};
