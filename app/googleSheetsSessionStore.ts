import session from 'express-session';
import { google } from 'googleapis';

export class GoogleSheetsStore extends session.Store {
  private authorize: () => Promise<any>;
  private spreadsheetId: string;

  constructor(authorize: () => Promise<any>, spreadsheetId: string) {
    super();
    this.authorize = authorize;
    this.spreadsheetId = spreadsheetId;
  }

  async get(sid: string, callback: (err: any, session?: session.SessionData | null) => void) {
    try {
      const auth = await this.authorize();
      const sheets = google.sheets({ version: 'v4', auth });
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `Sessions!A2:D`,
      });

      const rows = res.data.values || [];
      const sessionRow = rows.find(row => row[0] === sid);

      if (!sessionRow) {
        return callback(null, null);
      }

      const sessionData = JSON.parse(sessionRow[1]);
      const expires = new Date(sessionRow[2]);

      if (expires <= new Date()) {
        return this.destroy(sid, callback);
      }

      callback(null, sessionData);
    } catch (err) {
      callback(err);
    }
  }

  async set(sid: string, session: session.SessionData, callback?: (err?: any) => void) {
    try {
      const auth = await this.authorize();
      const sheets = google.sheets({ version: 'v4', auth });
      const expires = new Date(session.cookie.expires).toISOString();
      const sessionData = JSON.stringify(session);

      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `Sessions!A2:D`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[sid, sessionData, expires]],
        },
      });

      callback && callback(null);
    } catch (err) {
      callback && callback(err);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      const auth = await this.authorize();
      const sheets = google.sheets({ version: 'v4', auth });
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `Sessions!A2:D`,
      });

      const rows = res.data.values || [];
      const sessionRowIndex = rows.findIndex(row => row[0] === sid);

      if (sessionRowIndex === -1) {
        return callback && callback(null);
      }

      const range = `Sessions!A${sessionRowIndex + 2}:D${sessionRowIndex + 2}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: { values: [['', '', '', '']] },
      });

      callback && callback(null);
    } catch (err) {
      callback && callback(err);
    }
  }
}
