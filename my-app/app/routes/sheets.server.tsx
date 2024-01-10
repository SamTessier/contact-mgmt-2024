import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
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

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
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

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
export async function getData(auth) {
  const sheets = google.sheets({ version: "v4", auth });

  // Headers for the staff and students sheets
  const staffHeaders = ['firstName', 'lastName', 'school', 'phone', 'email', 'availability'];
  const studentHeaders = ['school', 'studentName', 'weeklySchedule', 'notes', 'email', 'phoneOne', 'parentOne', 'parentTwo'];

  // Fetching data for Staff
  const staffRes = await sheets.spreadsheets.values.get({
    spreadsheetId: "17bP4VBjiElXYd4ibo__zDFaI4iSyn42LqvhJgpBbbYA",
    range: "Staff!A2:F101",
  });
  const staffRows = staffRes.data.values || [];
  const staff = staffRows.map(row => Object.fromEntries(row.map((cell, index) => [staffHeaders[index], cell])));

  // Fetching data for Students
  const studentsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: "17bP4VBjiElXYd4ibo__zDFaI4iSyn42LqvhJgpBbbYA",
    range: "Students!A2:I401",
  });
  const studentsRows = studentsRes.data.values || [];
  const students = studentsRows.map(row => Object.fromEntries(row.map((cell, index) => [studentHeaders[index], cell])));

  return { staff, students };
}

