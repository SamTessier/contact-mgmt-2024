import { ActionFunction, json } from "@remix-run/node";
import { authorize, deleteData } from "../sheets.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { data, range } = await request.json();
    const client = await authorize();
    await deleteData(client, data, range);
    return json({ message: "Data deleted" });
  } catch (error) {
    console.error("Error deleting data:", error);
    return json({ error: "Failed to delete data" }, { status: 500 });
  }
};
