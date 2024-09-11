import { google } from 'googleapis';
import path from 'path';

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS) : '';
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

export async function authorize(credentialsPath: string) {
  const auth = new google.auth.GoogleAuth({
    keyFilename: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  });
  return auth.getClient();
}

export async function getData(auth: any, spreadsheetId: string, sheetName: string) {
  const sheets = google.sheets({ version: 'v4', auth });
  
  const staffHeaders = ['firstName', 'lastName', 'school', 'phone', 'email', 'availability'];
  const studentHeaders = ['school', 'studentName', 'weeklySchedule', 'notes', 'email', 'phoneOne', 'parentOne', 'parentTwo', 'phoneTwo'];

  const staffRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Staff!A2:F101',
  });
  const staffRows = staffRes.data.values || [];
  const staff = staffRows.map(row => Object.fromEntries(row.map((cell, index) => [staffHeaders[index], cell])));

  const studentsRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Students!A2:I401',
  });
  const studentsRows = studentsRes.data.values || [];
  const students = studentsRows.map(row => Object.fromEntries(row.map((cell, index) => [studentHeaders[index], cell])));

  return [...staff, ...students];
}

export async function addData(auth: any, spreadsheetId: string, data: any, sheetName: string) {
  const sheets = google.sheets({ version: 'v4', auth });
  const range = `${sheetName}!A:F`;
  const values = [Object.values(data)];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values,
    },
  });
}

export async function updateData(auth: any, spreadsheetId: string, data: any, sheetName: string, email: string) {
  const sheets = google.sheets({ version: 'v4', auth });
  const range = `${sheetName}!A2:F101`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];
  const emailToUpdate = email.trim().toLowerCase();
  let rowIndex = -1;

  rows.forEach((row, index) => {
    if (row[4] && typeof row[4] === 'string' && row[4].trim().toLowerCase() === emailToUpdate) {
      rowIndex = index + 2; // Google Sheets row index starts from 1
    }
  });

  if (rowIndex > 1) {
    const values = [Object.values(data)];
    const updateRange = `${sheetName}!A${rowIndex}:${sheetName === 'Students' ? 'I' : 'F'}${rowIndex}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values,
      },
    });
  } else {
    throw new Error('No matching row found for update');
  }
}

export async function deleteData(auth: any, spreadsheetId: string, email: string, sheetName: string) {
  const sheets = google.sheets({ version: 'v4', auth });
  const range = `${sheetName}!A2:F101`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];
  const emailToDelete = email.trim().toLowerCase();
  let rowIndex = -1;

  rows.forEach((row, index) => {
    if (row[4] && typeof row[4] === 'string' && row[4].trim().toLowerCase() === emailToDelete) {
      rowIndex = index + 2; // Google Sheets row index starts from 1
    }
  });

  if (rowIndex > 1) {
    const requests = [{
      deleteDimension: {
        range: {
          sheetId: sheetName === 'Students' ? parseInt(process.env.GOOGLE_SHEETS_STUDENTS_ID!, 10) : parseInt(process.env.GOOGLE_SHEETS_STAFF_ID!, 10),
          dimension: 'ROWS',
          startIndex: rowIndex - 1,
          endIndex: rowIndex,
        },
      },
    }];

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
  } else {
    throw new Error('No matching row found for deletion');
  }
}


