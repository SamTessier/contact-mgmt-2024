import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

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

export async function getData(auth: any): Promise<Data> {
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
  ];

  const staffRes = await sheets.spreadsheets.values.get({
    spreadsheetId: "17bP4VBjiElXYd4ibo__zDFaI4iSyn42LqvhJgpBbbYA",
    range: "Staff!A2:F101",
  });
  const staffRows = staffRes.data.values || [];
  const staff = staffRows.map((row) =>
    Object.fromEntries(row.map((cell, index) => [staffHeaders[index], cell]))
  );

  const studentsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: "17bP4VBjiElXYd4ibo__zDFaI4iSyn42LqvhJgpBbbYA",
    range: "Students!A2:I401",
  });
  const studentsRows = studentsRes.data.values || [];
  const students = studentsRows.map((row) =>
    Object.fromEntries(row.map((cell, index) => [studentHeaders[index], cell]))
  );

  return { staff, students };
}

export async function addData(auth: any, data: any, range: string): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: "17bP4VBjiElXYd4ibo__zDFaI4iSyn42LqvhJgpBbbYA",
    range,
    valueInputOption: "RAW",
    resource: {
      values: [Object.values(data)],
    },
  });
}

export async function updateData(auth: any, data: any, range: string): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.update({
    spreadsheetId: "17bP4VBjiElXYd4ibo__zDFaI4iSyn42LqvhJgpBbbYA",
    range,
    valueInputOption: "RAW",
    resource: {
      values: [Object.values(data)],
    },
  });
}

export async function deleteData(data: any, isStudent: boolean): Promise<void> {
  const auth = await loadSavedCredentialsIfExist();
  if (!auth) {
    console.log("Failed to load saved credentials");
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  const sheetName = isStudent ? "Students" : "Staff";
  const range = isStudent ? "Students!A2:I401" : "Staff!A2:F101";

  console.log("Fetching rows from sheet:", sheetName, "with range:", range);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "17bP4VBjiElXYd4ibo__zDFaI4iSyn42LqvhJgpBbbYA",
    range,
  });

  const rows = res.data.values || [];
  console.log("Rows fetched:", rows);
  const rowIndex = rows.findIndex((row) => row.includes(data.email)) + 2;
  console.log("Row index to delete:", rowIndex);

  if (rowIndex > 1) {
    const deleteRange = isStudent
      ? `Students!A${rowIndex}:I${rowIndex}`
      : `Staff!A${rowIndex}:F${rowIndex}`;
    console.log("Deleting range:", deleteRange);
    await sheets.spreadsheets.values.clear({
      spreadsheetId: "17bP4VBjiElXYd4ibo__zDFaI4iSyn42LqvhJgpBbbYA",
      range: deleteRange,
    });
    console.log("Row deleted");
  } else {
    console.log("No matching row found for deletion");
    throw new Error("No matching row found for deletion");
  }
}

