import { DataLayer } from './datalayer';
import { google } from 'googleapis';
import fs from 'fs/promises';

class GoogleSheetsDataLayer extends DataLayer {
  private authClient: any;

  constructor(
    private spreadsheetId: string,
    private sheetName: string,
    private credentialsPath: string
  ) {
    super();
    this.authClient = null;
  }

  private async authenticate() {
    if (!this.authClient) {
      const auth = new google.auth.GoogleAuth({
        keyFile: this.credentialsPath, // Path to your JSON key file
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
      });
      this.authClient = await auth.getClient(); // Logs in as the service account
    }
    return this.authClient;
  }

  async getData() {
    const auth = await this.authenticate(); // Logs in as the service account
    const sheets = google.sheets({ version: 'v4', auth }); // Talks to Google Sheets

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId, // Your Google Sheet ID
      range: `${this.sheetName}!A2:F101`, // The part of the sheet you want to read
    });
    return res.data.values || []; // Returns the data from the sheet
  }

  async addData(data: { [key: string]: any }) {
    const auth = await this.authenticate();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!A:F`,
      valueInputOption: 'RAW',
      resource: {
        values: [Object.values(data)],
      },
    });
  }

  async updateData(data: { [key: string]: any }, id: number) {
    const auth = await this.authenticate();
    const sheets = google.sheets({ version: 'v4', auth });

    const range = `${this.sheetName}!A${id}:F${id}`; // Assume the ID corresponds to the row number
    await sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [Object.values(data)],
      },
    });
  }

  async deleteData(id: number) {
    const auth = await this.authenticate();
    const sheets = google.sheets({ version: 'v4', auth });

    const range = `${this.sheetName}!A${id}:F${id}`; // Assume the ID corresponds to the row number
    await sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range,
    });
  }
}

export default GoogleSheetsDataLayer;
