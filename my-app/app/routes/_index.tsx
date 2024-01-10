// app/routes/_index.tsx
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authorize, getData } from "./sheets.server";
import { DataTable } from "../../@/components/ui/data-table"; // Import the DataTable component
import { studentColumns, staffColumns } from "./columns"; // Import the column definitions

// Define the data structure for a single staff member
interface StaffMember {
  firstName: string;
  lastName: string;
  school: string;
  phone: string;
  email: string;
  availability: string;
}

// Define the data structure for a single student
interface Student {
  school: string;
  studentName: string;
  weeklySchedule: string;
  notes: string;
  email: string;
  phoneOne: string;
  parentOne: string;
  parentTwo: string;
}

// Update the Data interface to use these new structures
interface Data {
  staff: StaffMember[];
  students: Student[];
}


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async (): Promise<Data> => {
  const client = await authorize();
  const data = await getData(client);
  return data;
};

export default function Index() {
  const { staff, students } = useLoaderData<Data>();
  console.log("Staff Data:", staff);
  console.log("Students Data:", students);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-4xl font-bold text-center p-4 uppercase">
        School App
      </h1>
      <div className="px-6">
        <h2 className="text-2xl font-bold mb-4">Students</h2>
        <DataTable columns={studentColumns} data={students} />

        <h2 className="text-2xl font-bold mb-4 mt-8">Staff</h2>
        <DataTable columns={staffColumns} data={staff} />
      </div>
    </div>
  );
}
