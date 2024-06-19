import { json, ActionFunction } from "@remix-run/node";
import { useFetcher, useNavigate, useLocation } from "@remix-run/react";
import { authorize, deleteData } from "./sheets.server";
import { useEffect } from "react";

export const action: ActionFunction = async ({ request }) => {
  const text = await request.text();
  let formData;
  try {
    formData = JSON.parse(text);
  } catch (error) {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data, sheetName } = formData;
  if (!data || !sheetName) {
    return json({ error: "Invalid data" }, { status: 400 });
  }

  const auth = await authorize();
  await deleteData(auth, process.env.GOOGLE_SHEETS_ID ?? '', data, sheetName);
  return json({ success: true });
};

export default function ProfileDeletePage() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, sheetName } = location.state;

  const handleDelete = () => {
    const requestData = {
      data: profile,
      sheetName,
    };

    fetcher.submit(
      requestData,
      {
        method: "post",
        action: "/profile/delete", 
        encType: "application/json",
      }
    );

    navigate(sheetName === 'Staff' ? "/staff" : "/students");
  };

  const handleCancel = () => {
    navigate(sheetName === 'Staff' ? "/staff" : "/students");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Delete Profile</h2>
      <p>Are you sure you want to delete this profile?</p>
      <div>
        {sheetName === "Students" ? (
          <>
            <p>Name: {profile.studentName}</p>
            <p>School: {profile.school}</p>
            <p>Email: {profile.email}</p>
            <p>Phone 1: {profile.phoneOne}</p>
            <p>Phone 2: {profile.phoneTwo}</p>
            <p>Weekly Schedule: {profile.weeklySchedule}</p>
            <p>Notes: {profile.notes}</p>
            <p>Parent 1: {profile.parentOne}</p>
            <p>Parent 2: {profile.parentTwo}</p>
          </>
        ) : (
          <>
            <p>Name: {profile.firstName} {profile.lastName}</p>
            <p>School: {profile.school}</p>
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phone}</p>
            <p>Availability: {profile.availability}</p>
          </>
        )}
      </div>
      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
      <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
    </div>
  );
}
