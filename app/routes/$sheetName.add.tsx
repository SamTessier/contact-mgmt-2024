import { ActionFunction } from "@remix-run/node";
import { Form, useNavigate, useLocation } from "@remix-run/react";
import { useParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { staffStudentDataLayer } from "~/data/initializedatalayer.server";
import { LoaderFunction } from "@remix-run/node";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

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
  const navigate = useNavigate();
  const location = useLocation();
  const sheetName = location.state?.sheetName?.toLowerCase() || "students";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Add New {sheetName === "students" ? "Student" : "Staff Member"}</h2>
        
        <Form method="post" className="space-y-6">
          {sheetName === "students" ? (
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
              Add {sheetName === "students" ? "Student" : "Staff Member"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
