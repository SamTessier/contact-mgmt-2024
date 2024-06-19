import { ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authorize, addData } from "./sheets.server";

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sheetName = url.pathname.split("/")[1];

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  console.log("Parsed data:", data); // Debugging log
  console.log("Sheet name:", sheetName); // Debugging log

  const auth = await authorize();
  await addData(auth, data, sheetName);
  return redirect("/profiles");
};

export default function ProfileAddPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Profile</h2>
      <Form method="post">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="text"
          name="school"
          placeholder="School"
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <input
          type="text"
          name="availability"
          placeholder="Availability"
          className="border-gray-300 shadow-lg px-4 py-2 mb-2 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Profile</button>
      </Form>
    </div>
  );
}
