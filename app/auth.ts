import { google } from 'googleapis';
import bcrypt from 'bcrypt';
import { getUser, createSession, authorize } from "./googlesheetsserver";
import { commitSession, getSession } from "./session.server";
import { redirect } from "@remix-run/node";

export async function addUser(auth: any, user: { email: string, password: string }) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
  const range = 'Users!A2:B';

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const emails = res.data.values?.map(row => row[0]);
  if (emails?.includes(user.email)) {
    throw new Error('User already exists');
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
}

export async function authenticateUser(auth: any, { email, password }: { email: string, password: string }) {
  const user = await getUser(auth, email);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return null;
}

export async function loginUser({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const auth = await authorize();
  const user = await authenticateUser(auth, { email, password });

  if (user) {
    const session = await getSession(request.headers.get("Cookie"));
    const sessionId = await createSession(auth, user.email, { userId: user.email });

    session.set("sessionId", sessionId);
    return redirect("/students", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return { error: "Invalid credentials" };
  }
}
