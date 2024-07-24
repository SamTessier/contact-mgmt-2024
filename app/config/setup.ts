import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

// Ensure the environment variable is set
const credentialsPath = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS || 'credentials.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

/**
 * Load service account credentials.
 *
 * @return {Promise<OAuth2Client>}
 */
export async function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFilename: credentialsPath,
    scopes: SCOPES,
  });

  return google.auth.getClient(auth);
}
