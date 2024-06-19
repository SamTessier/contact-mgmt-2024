import { json, ActionFunction } from "@remix-run/node";
import { useFetcher, useNavigate, useLocation } from "@remix-run/react";
import { authorize, updateData } from "./sheets.server";
import { useState } from "react";

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
  await updateData(auth, process.env.GOOGLE_SHEETS_ID ?? '', data, sheetName);
  return json({ success: true });
};

export default function ProfileEditPage() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, sheetName } = location.state;
  const [editableProfile, setEditableProfile] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableProfile({
      ...editableProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const requestData = {
      data: editableProfile,
      sheetName,
    };
  
    fetcher.submit(
      requestData,
      { method: "post", action: "/profile/edit", encType: "application/json" }
    );
  
    navigate(sheetName === 'Staff' ? "/staff" : "/students");
  };

  const handleCancel = () => {
    navigate(sheetName === 'Staff' ? "/staff" : "/students");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {sheetName === "Students" ? (
          <>
            <input
              type="text"
              name="studentName"
              value={editableProfile.studentName}
              onChange={handleChange}
              placeholder="Student Name"
            />
            <input
              type="text"
              name="school"
              value={editableProfile.school}
              onChange={handleChange}
              placeholder="School"
            />
            <input
              type="email"
              name="email"
              value={editableProfile.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phoneOne"
              value={editableProfile.phoneOne}
              onChange={handleChange}
              placeholder="Phone One"
            />
            <input
              type="text"
              name="phoneTwo"
              value={editableProfile.phoneTwo}
              onChange={handleChange}
              placeholder="Phone Two"
            />
            <input
              type="text"
              name="weeklySchedule"
              value={editableProfile.weeklySchedule}
              onChange={handleChange}
              placeholder="Weekly Schedule"
            />
            <input
              type="text"
              name="notes"
              value={editableProfile.notes}
              onChange={handleChange}
              placeholder="Notes"
            />
            <input
              type="text"
              name="parentOne"
              value={editableProfile.parentOne}
              onChange={handleChange}
              placeholder="Parent One"
            />
            <input
              type="text"
              name="parentTwo"
              value={editableProfile.parentTwo}
              onChange={handleChange}
              placeholder="Parent Two"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="firstName"
              value={editableProfile.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={editableProfile.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              type="text"
              name="school"
              value={editableProfile.school}
              onChange={handleChange}
              placeholder="School"
            />
            <input
              type="email"
              name="email"
              value={editableProfile.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={editableProfile.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            <input
              type="text"
              name="availability"
              value={editableProfile.availability}
              onChange={handleChange}
              placeholder="Availability"
            />
          </>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
        <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
      </form>
    </div>
  );
}
