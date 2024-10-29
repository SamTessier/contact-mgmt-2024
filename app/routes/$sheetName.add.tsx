import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useNavigate, useLoaderData, Params } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { staffStudentDataLayer } from "~/data/initializedatalayer.server";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import invariant from "tiny-invariant";

const sheetNameFromParams = (params: Params) => {
  let sheetName = params.sheetName;
  invariant(sheetName, "Missing sheet name");
  sheetName = sheetName.toLowerCase();
  sheetName = sheetName.charAt(0).toUpperCase() + sheetName.slice(1);
  invariant(sheetName === "Students" || sheetName === "Staff", "Invalid sheet name");
  return sheetName;
};

export const loader: LoaderFunction = async ({ params }) => {
  const sheetName = sheetNameFromParams(params);
  console.log("Add page - Sheet name:", sheetName); // Debug log
  return { sheetName };
};

export const action: ActionFunction = async ({ request, params }) => {
  const sheetName = sheetNameFromParams(params);
  const formData = await request.formData();
  
  // Convert FormData to a plain object
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  console.log('Adding data:', { sheetName, data }); // Debug log
  
  try {
    await staffStudentDataLayer.addData(data, sheetName);
    return redirect(`/${sheetName.toLowerCase()}`);
  } catch (error) {
    console.error('Error adding data:', error);
    throw error;
  }
};

export default function ProfileAddPage() {
  const { sheetName } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Add New {sheetName === "Students" ? "Student" : "Staff Member"}</h2>
        
        <Form method="post" className="space-y-6">
          {sheetName === "Students" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  name="studentName"
                  label="Student Name"
                  required
                  placeholder="Full Name"
                />
                <FormField
                  name="school"
                  label="School"
                  required
                  placeholder="School Name"
                />
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  required
                  placeholder="student@example.com"
                />
              </div>
              <div className="space-y-4">
                <FormField
                  name="phoneOne"
                  label="Primary Phone"
                  required
                  placeholder="(555) 555-5555"
                />
                <FormField
                  name="phoneTwo"
                  label="Secondary Phone"
                  placeholder="(555) 555-5555"
                />
                <FormField
                  name="weeklySchedule"
                  label="Weekly Schedule"
                  required
                  placeholder="Mon, Wed, Fri"
                />
              </div>
              <div className="col-span-2 space-y-4">
                <FormField
                  name="parentOne"
                  label="Primary Parent"
                  required
                  placeholder="Parent Name"
                />
                <FormField
                  name="parentTwo"
                  label="Secondary Parent"
                  placeholder="Parent Name"
                />
                <FormField
                  name="notes"
                  label="Notes"
                  component="textarea"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  name="firstName"
                  label="First Name"
                  required
                  placeholder="First Name"
                />
                <FormField
                  name="lastName"
                  label="Last Name"
                  required
                  placeholder="Last Name"
                />
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  required
                  placeholder="staff@example.com"
                />
              </div>
              <div className="space-y-4">
                <FormField
                  name="phone"
                  label="Phone"
                  required
                  placeholder="(555) 555-5555"
                />
                <FormField
                  name="school"
                  label="School"
                  required
                  placeholder="School Name"
                />
                <FormField
                  name="availability"
                  label="Availability"
                  required
                  placeholder="Mon-Fri 9am-5pm"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add {sheetName === "Students" ? "Student" : "Staff Member"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
