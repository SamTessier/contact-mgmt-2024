import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { deleteData } from "./sheets.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const bodyText = await request.text();
    console.log("Request body:", bodyText);

    const { data, isStudent } = JSON.parse(bodyText); // This helps pinpoint if the JSON.parse is failing
    const parsedData = JSON.parse(data);
    const parsedIsStudent = isStudent === 'true';

    if (!parsedData || typeof parsedIsStudent !== 'boolean') {
      return json({ error: 'Invalid data' }, { status: 400 });
    }

    await deleteData(parsedData, parsedIsStudent); // Implement this function to handle the deletion

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting data:", error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
