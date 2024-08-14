import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useNavigate, useParams, Form, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { staffStudentDataLayer } from '~/data/initializedatalayer.server';
import invariant from "tiny-invariant";

const sheetNameFromParams = (params) => {
  let sheetName = params.sheetName;
  invariant(sheetName, "Missing sheet name");
  sheetName = sheetName.toLowerCase();
  sheetName = sheetName.charAt(0).toUpperCase() + sheetName.slice(1);
  invariant(sheetName === "Students" || sheetName === "Staff", "Invalid sheet name");
  return sheetName;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const sheetName = sheetNameFromParams(params);
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  invariant(email, "Missing email");

  const allData = await staffStudentDataLayer.getData(sheetName);
  const data = allData.find(item => item.email === email);
  invariant(data, "Data not found");

  return { data, sheetName };
};

export const action: ActionFunction = async ({ request, params }) => {
  const sheetName = sheetNameFromParams(params);
  invariant(sheetName === "Students" || sheetName === "Staff", "Invalid sheet name");

  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const email = formData.get("email");

  await staffStudentDataLayer.updateData(data, email.toString(), sheetName);
  return redirect(`/${sheetName}`);
};

export default function ProfileEditPage() {
  const { data, sheetName } = useLoaderData();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <Form method="post">
          {sheetName === "Students" ? (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="studentName"
                  defaultValue={data.studentName}
                  placeholder="Student Name"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="school"
                  defaultValue={data.school}
                  placeholder="School"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  defaultValue={data.email}
                  placeholder="Email"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phoneOne"
                  defaultValue={data.phoneOne}
                  placeholder="Phone One"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phoneTwo"
                  defaultValue={data.phoneTwo}
                  placeholder="Phone Two"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="weeklySchedule"
                  defaultValue={data.weeklySchedule}
                  placeholder="Weekly Schedule"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="notes"
                  defaultValue={data.notes}
                  placeholder="Notes"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="parentOne"
                  defaultValue={data.parentOne}
                  placeholder="Parent One"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="parentTwo"
                  defaultValue={data.parentTwo}
                  placeholder="Parent Two"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="firstName"
                  defaultValue={data.firstName}
                  placeholder="First Name"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="lastName"
                  defaultValue={data.lastName}
                  placeholder="Last Name"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="school"
                  defaultValue={data.school}
                  placeholder="School"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  defaultValue={data.phone}
                  placeholder="Phone"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  defaultValue={data.email}
                  placeholder="Email"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="availability"
                  defaultValue={data.availability}
                  placeholder="Availability"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
        </Form>
      </div>
    </div>
  );
}
