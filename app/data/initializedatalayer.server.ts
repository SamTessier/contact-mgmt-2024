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
      console.log('📝 Writing credentials file...');
      writeFileSync(
        credentialsPath,
        Buffer.from(credentialsJson, 'base64').toString()
      );
      console.log('✅ Successfully wrote credentials file to:', credentialsPath);
      console.log('📄 File contents exist:', require('fs').existsSync(credentialsPath));
    } catch (error) {
      console.error('❌ Failed to write credentials file:', error);
      throw error; // This will help us see the error in logs
    }
  } else {
    console.error('❌ No GOOGLE_CREDENTIALS_JSON found in environment');
    console.log('Available env vars:', Object.keys(process.env));
  }

  staffStudentDataLayer = new GoogleSheetsDataLayer(
    process.env.GOOGLE_SHEETS_ID || '',
    credentialsPath
  );
} else {
  throw new Error('Invalid data source specified');
}

export { userSessionDataLayer, staffStudentDataLayer };
