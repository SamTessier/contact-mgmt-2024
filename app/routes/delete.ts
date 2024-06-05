import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { deleteData } from "./sheets.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    console.log("Delete action triggered");
    const bodyText = await request.text();
    console.log("Request body:", bodyText);

    const params = new URLSearchParams(bodyText);
    const data = JSON.parse(params.get('data'));
    const sheetName = params.get('sheetName');

    console.log("Parsed data:", data);
    console.log("Sheet name:", sheetName);

    const sheetId = sheetName === "Students" 
      ? process.env.GOOGLE_SHEETS_STUDENTS_ID 
      : process.env.GOOGLE_SHEETS_STAFF_ID;

    if (!data || !sheetId) {
      console.log("Invalid data received"); 
      return json({ error: 'Invalid data' }, { status: 400 });
    }

    await deleteData(data, sheetId);
    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in delete action:", error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
