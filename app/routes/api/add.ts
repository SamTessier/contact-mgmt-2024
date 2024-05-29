import { ActionFunction, json } from "@remix-run/node";
import { authorize, addData } from "../sheets.server";

export const action: ActionFunction = async ({ request }) => {
  console.log("Received add request");
  try {
    const { data, range } = await request.json();
    console.log("Data to add:", data);
    console.log("Range:", range);
    const client = await authorize();
    await addData(client, data, range);
    return json({ message: "Data added" });
  } catch (error) {
    console.error("Error adding data:", error);
    return json({ error: "Failed to add data" }, { status: 500 });
  }
};
