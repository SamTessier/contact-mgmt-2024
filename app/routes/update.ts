import { ActionFunction, json } from "@remix-run/node";
import { authorize, updateData } from "./sheets.server";

export const loader = async () => {
  return json({ message: "Update route is working. Use POST to update data." });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const { data, range } = await request.json();
    const client = await authorize();
    await updateData(client, data, range);
    return json({ message: "Data updated" });
  } catch (error) {
    console.error("Error updating data:", error);
    return json({ error: "Failed to update data" }, { status: 500 });
  }
};
