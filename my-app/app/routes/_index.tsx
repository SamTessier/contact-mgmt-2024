import React, { useState } from "react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authorize, getData } from "./sheets.server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "../../@/components/ui/data-table";
import { studentColumns, staffColumns } from "./columns";
import { Input } from "../../@/components/ui/input";

export interface StaffMember {
  firstName: string;
  lastName: string;
  school: string;
  phone: string;
  email: string;
  availability: string;
}

export interface Student {
  school: string;
  studentName: string;
  weeklySchedule: string;
  notes: string;
  email: string;
  phoneOne: string;
  parentOne: string;
  parentTwo: string;
}

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
  const [searchText, setSearchText] = useState("");
  const filteredStaff = staff.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredStudents = students.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email.toLowerCase().includes(searchText.toLowerCase())
  );

  console.log("Staff Data:", staff);
  console.log("Students Data:", students);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
         <Input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <h1 className="text-4xl font-bold text-center p-4 uppercase">
        School App
      </h1>
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <h2 className="text-2xl font-bold mb-4">Students</h2>
          <DataTable columns={studentColumns} data={filteredStudents} />
        </TabsContent>

        <TabsContent value="staff">
          <h2 className="text-2xl font-bold mb-4">Staff</h2>
          <DataTable columns={staffColumns} data={filteredStaff} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
