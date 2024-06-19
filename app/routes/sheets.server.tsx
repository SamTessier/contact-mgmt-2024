import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];
const TOKEN_PATH = path.join(process.cwd(), process.env.TOKEN_PATH || "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), process.env.CREDENTIALS_PATH || "credentials.json");

async function loadSavedCredentialsIfExist(): Promise<any | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: any): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

export async function authorize(): Promise<any> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

interface Data {
  staff: Record<string, string>[];
  students: Record<string, string>[];
}

export async function getData(auth: any, spreadsheetId: string): Promise<Data> {
  const sheets = google.sheets({ version: "v4", auth });

  const staffHeaders = [
    "firstName",
    "lastName",
    "school",
    "phone",
    "email",
    "availability",
  ];
  const studentHeaders = [
    "school",
    "studentName",
    "weeklySchedule",
    "notes",
    "email",
    "phoneOne",
    "parentOne",
    "parentTwo",
    "phoneTwo",
  ];

  const staffRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Staff!A2:F101",
  });
  const staffRows = staffRes.data.values || [];
  const staff = staffRows.map((row) =>
    Object.fromEntries(row.map((cell, index) => [staffHeaders[index], cell]))
  );

  const studentsRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Students!A2:I401",
  });
  const studentsRows = studentsRes.data.values || [];
  const students = studentsRows.map((row) =>
    Object.fromEntries(row.map((cell, index) => [studentHeaders[index], cell]))
  );

  return { staff, students };
}

export async function addData(auth: any, data: any, sheetName: string): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth });
  const range = sheetName === "Students" ? "Students!A2:I401" : "Staff!A2:F101";
  const values = [Object.values(data)];
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID ?? '',
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values,
    },
  });
}

export async function deleteData(auth: any, spreadsheetId: string, data: any, sheetName: string): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth });
  const range = sheetName === "Students" ? "Students!A2:I401" : "Staff!A2:F101";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];
  const emailToDelete = data.email.trim().toLowerCase();
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
          sheetId: sheetName === "Students" ? parseInt(process.env.GOOGLE_SHEETS_STUDENTS_ID, 10) : parseInt(process.env.GOOGLE_SHEETS_STAFF_ID, 10),
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
    throw new Error("No matching row found for deletion");
  }
}

export async function updateData(auth: any, spreadsheetId: string, data: any, sheetName: string): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth });
  const range = sheetName === "Students" ? "Students!A2:I401" : "Staff!A2:F101";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];
  const emailToUpdate = data.email.trim().toLowerCase();
  let rowIndex = -1;

  rows.forEach((row, index) => {
    if (row[4] && typeof row[4] === 'string' && row[4].trim().toLowerCase() === emailToUpdate) {
      rowIndex = index + 2; // Google Sheets row index starts from 1
    }
  });

  if (rowIndex > 1) {
    const values = [Object.values(data)];
    const updateRange = `${sheetName}!A${rowIndex}:${sheetName === "Students" ? "I" : "F"}${rowIndex}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        values,
      },
    });
  } else {
    throw new Error("No matching row found for update");
  }
}


