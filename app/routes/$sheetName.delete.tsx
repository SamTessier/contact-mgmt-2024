import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useNavigate, useParams } from "@remix-run/react";
import { authorize, deleteData } from "../googlesheetsserver";

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sheetName = url.pathname.split("/")[1];

  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || !sheetName) {
    throw new Error("Email and sheet name are required");
  }

  console.log("Parsed data:", { email, sheetName }); // Debugging log
  console.log("Sheet name:", sheetName); // Debugging log

  const auth = await authorize('credentials.json');
  await deleteData(auth, process.env.GOOGLE_SHEETS_ID!, email.toString(), sheetName);
  return redirect(`/${sheetName}`);
};

export default function ProfileDeletePage() {
  const navigate = useNavigate();
  const params = useParams();
  const email = new URLSearchParams(window.location.search).get('email');
  const sheetName = params.sheetName;

  const handleCancel = () => {
    navigate(`/${sheetName}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Delete Profile</h2>
      <p>Are you sure you want to delete this profile?</p>
      <Form method="post">
        <input type="hidden" name="email" value={email || ""} />
        <input type="hidden" name="sheetName" value={sheetName} />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
        <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
      </Form>
    </div>
  );
}
