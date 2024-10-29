import SQLDataLayer from "./sqldatalayer";
import GoogleSheetsDataLayer from "./googlesheetsdatalayer";
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

const dataSource = process.env.DATA_SOURCE;

const userSessionDataLayer = new SQLDataLayer();

let staffStudentDataLayer: SQLDataLayer | GoogleSheetsDataLayer;

if (dataSource === 'mysql') {
  staffStudentDataLayer = new SQLDataLayer();
} else if (dataSource === 'googleSheets') {
  staffStudentDataLayer = new GoogleSheetsDataLayer(
    process.env.GOOGLE_SHEETS_ID || ''
  );
} else {
  throw new Error('Invalid data source specified');
}

export { userSessionDataLayer, staffStudentDataLayer };
