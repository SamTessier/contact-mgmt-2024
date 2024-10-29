import { DataLayer } from "./datalayer";
import { google } from 'googleapis';
import { getData, addData, updateData, deleteData } from '../googlesheetsserver';

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

  async getData(sheetName: string) {
    const auth = await this.authenticate();
    return getData(auth, this.spreadsheetId, sheetName);
  }

  async addData(data: any, sheetName: string) {
    const auth = await this.authenticate();
    await addData(auth, this.spreadsheetId, data, sheetName);
  }

  async updateData(data: any, email: string, sheetName: string) {
    const auth = await this.authenticate();
    await updateData(auth, this.spreadsheetId, data, sheetName, email);
  }

  async deleteData(email: string, sheetName: string) {
    const auth = await this.authenticate();
    await deleteData(auth, this.spreadsheetId, email, sheetName);
  }
}

export default GoogleSheetsDataLayer;
