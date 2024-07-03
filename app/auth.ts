import { google } from 'googleapis';
import bcrypt from 'bcrypt';
import path from 'path';

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS) : '';

export async function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  });
  return auth.getClient();
}

export async function addUser(auth: any, user: { email: string, password: string }): Promise<boolean> {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
  const range = 'Users!A2:B';

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const emails = res.data.values?.map(row => row[0]);
  if (emails?.includes(user.email)) {
    return false;
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        [user.email, hashedPassword],
      ],
    },
  });

  return true;
}

export async function authenticateUser(auth: any, user: { email: string, password: string }) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
  const range = 'Users!A2:B';

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];
  const foundUser = rows.find(row => row[0] === user.email);

  if (!foundUser || !await bcrypt.compare(user.password, foundUser[1])) {
    return null;
  }

  return user;
}
