import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useNavigate, useParams, Form, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { staffStudentDataLayer } from '~/data/initializedatalayer.server';
import invariant from "tiny-invariant";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

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

  const result = await staffStudentDataLayer.getData(sheetName);
  const dataArray = sheetName === "Staff" ? result.staff : result.students;
  invariant(dataArray, "No data found");
  
  const data = dataArray.find(item => item.email === email);
  invariant(data, "Profile not found");

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Edit {sheetName} Profile</h2>
        <Form method="post" className="space-y-6">
          {sheetName === "Students" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  name="studentName"
                  label="Student Name"
                  defaultValue={data.studentName}
                  required
                />
                <FormField
                  name="school"
                  label="School"
                  defaultValue={data.school}
                  required
                />
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  defaultValue={data.email}
                  required
                />
              </div>
              <div className="space-y-4">
                <FormField
                  name="phoneOne"
                  label="Primary Phone"
                  defaultValue={data.phoneOne}
                  required
                />
                <FormField
                  name="phoneTwo"
                  label="Secondary Phone"
                  defaultValue={data.phoneTwo}
                />
                <FormField
                  name="weeklySchedule"
                  label="Weekly Schedule"
                  defaultValue={data.weeklySchedule}
                  required
                />
              </div>
              <div className="col-span-2 space-y-4">
                <FormField
                  name="parentOne"
                  label="Primary Parent"
                  defaultValue={data.parentOne}
                  required
                />
                <FormField
                  name="parentTwo"
                  label="Secondary Parent"
                  defaultValue={data.parentTwo}
                />
                <FormField
                  name="notes"
                  label="Notes"
                  defaultValue={data.notes}
                  component="textarea"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  name="firstName"
                  label="First Name"
                  defaultValue={data.firstName}
                  required
                />
                <FormField
                  name="lastName"
                  label="Last Name"
                  defaultValue={data.lastName}
                  required
                />
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  defaultValue={data.email}
                  required
                />
              </div>
              <div className="space-y-4">
                <FormField
                  name="phone"
                  label="Phone"
                  defaultValue={data.phone}
                  required
                />
                <FormField
                  name="school"
                  label="School"
                  defaultValue={data.school}
                  required
                />
                <FormField
                  name="availability"
                  label="Availability"
                  defaultValue={data.availability}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
