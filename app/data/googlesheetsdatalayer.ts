import { DataLayer } from "./datalayer";
import { google } from 'googleapis';

class GoogleSheetsDataLayer implements DataLayer {
  private authClient: any;

  constructor(private spreadsheetId: string) {
    this.authClient = null;
  }

  async authenticate() {
    try {
      console.log('🔍 Starting authentication process...');
      
      const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
      if (!credentialsJson) {
        console.error('❌ No credentials found in environment');
        throw new Error('GOOGLE_CREDENTIALS_JSON not found in environment');
      }

      // Create credentials object directly
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(credentialsJson),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      console.log('✅ Auth object created');
      const client = await auth.getClient();
      console.log('✅ Client obtained successfully');
      return client;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
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
