import { ActionFunction, redirect } from "@remix-run/node";
import { staffStudentDataLayer } from '~/data/initializedatalayer.server';

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sheetName = url.pathname.split("/")[1];

  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || !sheetName) {
    throw new Error("Email and sheet name are required");
  }

  await staffStudentDataLayer.deleteData(email.toString(), sheetName);
  return redirect(`/${sheetName}`);
};
