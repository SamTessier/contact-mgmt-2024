import GoogleSheetsDataLayer from "./googlesheetsdatalayer";
import SQLDataLayer from "./sqldatalayer";

let dataLayer: DataLayer;

if (process.env.DATA_SOURCE === 'googleSheets') {
  dataLayer = new GoogleSheetsDataLayer(
    process.env.GOOGLE_SHEETS_ID!,
    process.env.GOOGLE_SHEETS_NAME!,
    process.env.CREDENTIALS_PATH!
  );
} else if (process.env.DATA_SOURCE === 'sql') {
  dataLayer = new SQLDataLayer();
} else {
  throw new Error('Invalid data source specified');
}

export default dataLayer;
