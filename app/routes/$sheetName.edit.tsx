import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useNavigate, useParams, Form } from "@remix-run/react";
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

export const loader: LoaderFunction = async ({ params }) => {
  sheetNameFromParams(params);
  return null;
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
  const params = useParams();
  const sheetName = params.sheetName;
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
          placeholder="Student Name"
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
          name="phoneTwo"
          placeholder="Phone Two"
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
    </>
  ) : (
    <>
      <div className="mb-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>
    </>
  )}
</Form>
<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
<button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
</div>
</div>
);
}
