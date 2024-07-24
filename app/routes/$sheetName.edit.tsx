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
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <Form method="post">
        {sheetName === "Students" ? (
          <>
            <input type="text" name="studentName" placeholder="Student Name" />
            <input type="text" name="school" placeholder="School" />
            <input type="email" name="email" placeholder="Email" />
            <input type="text" name="phoneOne" placeholder="Phone One" />
            <input type="text" name="phoneTwo" placeholder="Phone Two" />
            <input type="text" name="weeklySchedule" placeholder="Weekly Schedule" />
            <input type="text" name="notes" placeholder="Notes" />
            <input type="text" name="parentOne" placeholder="Parent One" />
            <input type="text" name="parentTwo" placeholder="Parent Two" />
          </>
        ) : (
          <>
            <input type="text" name="firstName" placeholder="First Name" />
            <input type="text" name="lastName" placeholder="Last Name" />
            <input type="text" name="school" placeholder="School" />
            <input type="email" name="email" placeholder="Email" />
            <input type="text" name="phone" placeholder="Phone" />
            <input type="text" name="availability" placeholder="Availability" />
          </>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
        <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
      </Form>
    </div>
  );
}