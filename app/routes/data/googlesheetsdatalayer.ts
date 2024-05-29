import { DataLayer } from './datalayer';
import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { authenticate } from '@google-cloud/local-auth';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

class GoogleSheetsDataLayer extends DataLayer {
  constructor(spreadsheetId, sheetName, credentialsPath, tokenPath) {
    super();
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
    this.credentialsPath = credentialsPath;
    this.tokenPath = tokenPath;
    this.sheets = google.sheets('v4');
  }

  async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(this.tokenPath);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client) {
    const content = await fs.readFile(this.credentialsPath);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(this.tokenPath, payload);
  }

  async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: this.credentialsPath,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  async getData() {
    const auth = await this.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    const staffHeaders = ['firstName', 'lastName', 'school', 'phone', 'email', 'availability'];
    const studentHeaders = ['school', 'studentName', 'weeklySchedule', 'notes', 'email', 'phoneOne', 'parentOne', 'parentTwo'];

    const staffRes = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Staff!A2:F101',
    });
    const staffRows = staffRes.data.values || [];
    const staff = staffRows.map(row => Object.fromEntries(row.map((cell, index) => [staffHeaders[index], cell])));

    const studentsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Students!A2:I401',
    });
    const studentsRows = studentsRes.data.values || [];
    const students = studentsRows.map(row => Object.fromEntries(row.map((cell, index) => [studentHeaders[index], cell])));

    return { staff, students };
  }

  async addData(data, range) {
    const auth = await this.authorize();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [Object.values(data)],
      },
    });
  }

  async updateData(data, range) {
    const auth = await this.authorize();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [Object.values(data)],
      },
    });
  }

  async deleteData(data, isStudent) {
    const auth = await this.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    const range = isStudent ? 'Students!A2:I401' : 'Staff!A2:F101';
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range,
    });
    const rows = res.data.values || [];
    const rowIndex = rows.findIndex(row => row.includes(data.email)) + 2;

    if (rowIndex > 1) {
      const deleteRange = isStudent ? `Students!A${rowIndex}:I${rowIndex}` : `Staff!A${rowIndex}:F${rowIndex}`;
      await sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: deleteRange,
      });
    }
  }
}

export default GoogleSheetsDataLayer;

