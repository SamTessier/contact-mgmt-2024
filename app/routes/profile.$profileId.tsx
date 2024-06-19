import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useFetcher, useNavigate } from "@remix-run/react";
import { authorize, deleteData, getData } from "./sheets.server";
import { ProfileViewModal } from "@/components/profile-view-modal";

export const loader: LoaderFunction = async ({ }) => {
  const auth = await authorize();
  const profile = await getData(auth, process.env.GOOGLE_SHEETS_ID ?? '');
  return json(profile);
};

export const action: ActionFunction = async ({ request }) => {
  const text = await request.text();
  console.log("Request body:", text); // Debugging log

  let formData;
  try {
    formData = JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data, sheetName } = formData;
  console.log("Parsed data:", data); // Debugging log
  console.log("Sheet name:", sheetName); // Debugging log

  if (!data || !sheetName) {
    console.error("Invalid data received");
    return json({ error: "Invalid data" }, { status: 400 });
  }

  const auth = await authorize();
  await deleteData(auth, process.env.GOOGLE_SHEETS_ID ?? "default_spreadsheet_id", data, sheetName);
  return json({ success: true });
};



export default function ProfilePage() {
  const fetcher = useFetcher();
  const profile = useLoaderData();
  const navigate = useNavigate();

  const handleUpdate = () => {
    fetcher.submit({}, { method: "get" });
  };

  const handleClose = () => {
    navigate(-1); 
  };

  return (
    <ProfileViewModal
      isOpen={true}
      profile={profile}
      onClose={handleClose}
      onUpdate={handleUpdate}
    />
  );
}
