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

  console.log("Fetching rows from sheet:", sheetName, "with range:", range);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];
  console.log("Rows fetched:", JSON.stringify(rows, null, 2));

  const firstNameToDelete = data.firstName.trim().toLowerCase();
  let rowIndex = -1;

  rows.forEach((row, index) => {
    console.log(`Processing row ${index + 2}:`, JSON.stringify(row, null, 2));
    if (row[0] && typeof row[0] === 'string' && row[0].trim().toLowerCase() === firstNameToDelete) {
      rowIndex = index + 2; 
    }
  });

  console.log("Row index to delete:", rowIndex);

  if (rowIndex > 1) {
    console.log("Deleting row:", rowIndex);
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

    console.log("Batch update request:", JSON.stringify(requests, null, 2));
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
    console.log("Row deleted");
  } else {
    console.log("No matching row found for deletion");
    throw new Error("No matching row found for deletion");
  }
}


