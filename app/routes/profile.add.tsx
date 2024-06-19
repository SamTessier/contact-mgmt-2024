import { json, ActionFunction } from "@remix-run/node";
import { useFetcher, useNavigate, useLocation } from "@remix-run/react";
import { authorize, addData } from "./sheets.server";
import { useState } from "react";

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
  await addData(auth, data, sheetName);
  return json({ success: true });
};

export default function ProfileAddPage() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const sheetName = location.state?.sheetName || 'Staff'; // Default to Staff if not specified
  const [profile, setProfile] = useState({ firstName: '', lastName: '', school: '', phone: '', email: '', availability: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const requestData = {
      data: profile,
      sheetName,
    };
  
    fetcher.submit(
      requestData,
      { method: "post", encType: "application/json" }
    );
  
    navigate(sheetName === 'Staff' ? "/staff" : "/students");
  };
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={profile.firstName}
          onChange={handleChange}
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={profile.lastName}
          onChange={handleChange}
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="text"
          name="school"
          placeholder="School"
          value={profile.school}
          onChange={handleChange}
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={profile.phone}
          onChange={handleChange}
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="text"
          name="availability"
          placeholder="Availability"
          value={profile.availability}
          onChange={handleChange}
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Profile</button>
      </form>
    </div>
  );
}
