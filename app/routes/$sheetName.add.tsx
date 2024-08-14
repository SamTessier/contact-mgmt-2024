import { ActionFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { staffStudentDataLayer } from "~/data/initializedatalayer.server";
import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  const { sheetName } = params;
  return { sheetName };
};

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sheetName = url.pathname.split("/")[1];
  const data = Object.fromEntries(new URLSearchParams(await request.text()));
  await staffStudentDataLayer.addData(data, sheetName);
  console.log("Form Data:", data); // Debugging statement
  console.log("Sheet Name:", sheetName); // Debugging statement
  return redirect(`/${sheetName}`);
};

export default function ProfileAddPage() {
  const { sheetName } = useLoaderData();
  console.log("sheetName:", sheetName); // Debugging statement

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Profile</h2>
        <Form method="post">
          {sheetName === "staff" ? (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="school"
                  placeholder="School"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="availability"
                  placeholder="Availability"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
            </>
          ) : sheetName === "students" ? (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="school"
                  placeholder="School"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="studentName"
                  placeholder="Student Name"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="weeklySchedule"
                  placeholder="Weekly Schedule"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="notes"
                  placeholder="Notes"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phoneOne"
                  placeholder="Phone One"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="parentOne"
                  placeholder="Parent One"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="parentTwo"
                  placeholder="Parent Two"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phoneTwo"
                  placeholder="Phone Two"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
            </>
          ) : (
            <p>Invalid sheet name</p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Profile
          </button>
        </Form>
      </div>
    </div>
  );
}
