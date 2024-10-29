import { DataLayer } from "./datalayer";
import { google } from 'googleapis';

// Import the Google Sheets functions
import { 
  gsGetData, 
  gsAddData, 
  gsUpdateData, 
  gsDeleteData 
} from './googlesheetsfunctions';  // Create this file if it doesn't exist

class GoogleSheetsDataLayer implements DataLayer {
  private authClient: any;

  constructor(private spreadsheetId: string) {
    console.log('📊 Creating GoogleSheetsDataLayer with spreadsheet ID:', spreadsheetId);
    this.authClient = null;
  }

  async authenticate() {
    try {
      console.log('🔍 Starting Google Sheets authentication...');
      
      const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
      console.log('📦 Raw credentials exist:', !!credentialsJson);
      console.log('📦 Credentials type:', typeof credentialsJson);
      
      if (!credentialsJson) {
        console.error('❌ No Google credentials found in environment');
        throw new Error('GOOGLE_CREDENTIALS_JSON not found in environment');
      }

      try {
        const parsedCreds = JSON.parse(credentialsJson);
        console.log('✅ Google credentials parsed successfully');
        console.log('🔑 Project ID:', parsedCreds.project_id);
        console.log('📧 Service Account:', parsedCreds.client_email);

        const auth = new google.auth.GoogleAuth({
          credentials: parsedCreds,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        console.log('✅ Google auth object created');
        this.authClient = await auth.getClient();
        console.log('✅ Google client obtained successfully');
        return this.authClient;
      } catch (parseError) {
        console.error('💥 Error parsing Google credentials:', parseError);
        throw parseError;
      }
    } catch (error) {
      console.error('❌ Google Sheets authentication failed:', error);
      throw error;
    }
  }

  async getData() {
    const auth = await this.authenticate();
    return gsGetData(auth, this.spreadsheetId);
  }

  async addData(data: any, sheetName: string) {
    const auth = await this.authenticate();
    await gsAddData(auth, this.spreadsheetId, data, sheetName);
  }

  async updateData(data: any, email: string, sheetName: string) {
    const auth = await this.authenticate();
    await gsUpdateData(auth, this.spreadsheetId, data, sheetName, email);
  }

  async deleteData(email: string, sheetName: string) {
    const auth = await this.authenticate();
    await gsDeleteData(auth, this.spreadsheetId, email, sheetName);
  }
}

export default GoogleSheetsDataLayer;
