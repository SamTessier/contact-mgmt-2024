import SQLDataLayer from "./sqldatalayer";
import GoogleSheetsDataLayer from "./googlesheetsdatalayer";
import dotenv from 'dotenv';

dotenv.config();

const dataSource = process.env.DATA_SOURCE;

const userSessionDataLayer = new SQLDataLayer();

let staffStudentDataLayer: SQLDataLayer | GoogleSheetsDataLayer;

if (dataSource === 'mysql') {
  staffStudentDataLayer = new SQLDataLayer();
} else if (dataSource === 'googleSheets') {
  staffStudentDataLayer = new GoogleSheetsDataLayer(
    process.env.GOOGLE_SHEETS_ID || '',
    process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
  );
} else {
  throw new Error('Invalid data source specified');
}

export { userSessionDataLayer, staffStudentDataLayer };
