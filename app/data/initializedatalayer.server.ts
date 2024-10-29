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
  // Create credentials file from environment variable
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  const credentialsPath = join(process.cwd(), 'credentials.json');
  
  if (credentialsJson) {
    try {
      writeFileSync(
        credentialsPath,
        Buffer.from(credentialsJson, 'base64').toString()
      );
      console.log('✅ Successfully wrote credentials file');
    } catch (error) {
      console.error('❌ Failed to write credentials file:', error);
    }
  } else {
    console.error('❌ No credentials JSON found in environment');
  }

  staffStudentDataLayer = new GoogleSheetsDataLayer(
    process.env.GOOGLE_SHEETS_ID || '',
    credentialsPath
  );
} else {
  throw new Error('Invalid data source specified');
}

export { userSessionDataLayer, staffStudentDataLayer };
