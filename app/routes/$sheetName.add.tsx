import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { Form, useNavigate, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { staffStudentDataLayer } from "~/data/initializedatalayer.server";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

export const loader: LoaderFunction = async ({ params }) => {
  const sheetName = params.sheetName === "staff" ? "Staff" : "Students";
  return json({ sheetName });
};

export const action: ActionFunction = async ({ request, params }) => {
  const sheetName = params.sheetName?.toLowerCase() === "students" ? "Students" : "Staff";
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await staffStudentDataLayer.addData(data, sheetName);
    return redirect(`/${sheetName.toLowerCase()}`);
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
};

export default function ProfileAddPage() {
  const { sheetName } = useLoaderData<{ sheetName: string }>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Add New {sheetName === "Students" ? "Student" : "Staff Member"}</h2>
        
        <Form method="post" className="space-y-6">
          {sheetName === "Students" ? (
            <>
              <FormField label="Student Name" name="studentName" required />
              <FormField label="School" name="school" required />
              <FormField label="Email" name="email" type="email" required />
              <FormField label="Phone One" name="phoneOne" required />
              <FormField label="Parent One" name="parentOne" required />
              <FormField label="Parent Two" name="parentTwo" />
              <FormField label="Phone Two" name="phoneTwo" />
              <FormField label="Weekly Schedule" name="weeklySchedule" />
              <FormField label="Notes" name="notes" />
            </>
          ) : (
            <>
              <FormField label="First Name" name="firstName" required />
              <FormField label="Last Name" name="lastName" required />
              <FormField label="School" name="school" required />
              <FormField label="Email" name="email" type="email" required />
              <FormField label="Phone" name="phone" required />
              <FormField label="Availability" name="availability" />
            </>
          )}
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate(`/${sheetName.toLowerCase()}`)}>
              Cancel
            </Button>
            <Button type="submit">Add {sheetName === "Students" ? "Student" : "Staff Member"}</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

