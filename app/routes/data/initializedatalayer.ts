import GoogleSheetsDataLayer from './googleSheetsDataLayer';
import SQLDataLayer from './sqlDataLayer';

let dataLayer;

if (process.env.DATA_SOURCE === 'googleSheets') {
  dataLayer = new GoogleSheetsDataLayer(process.env.GOOGLE_SHEETS_ID, process.env.GOOGLE_SHEETS_NAME);
} else if (process.env.DATA_SOURCE === 'sql') {
  dataLayer = new SQLDataLayer(process.env.SQL_CONNECTION_STRING);
} else {
  throw new Error('Invalid data source specified');
}

export default dataLayer;
