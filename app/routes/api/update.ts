import { ActionFunction, json } from "@remix-run/node";
import { authorize, updateData } from "../sheets.server";

export const action: ActionFunction = async ({ request }) => {
  const { data, range } = await request.json();
  const client = await authorize();
  await updateData(client, data, range);
  return json({ message: "Data updated" });
};
