import React, { useState } from "react";
import "../tailwind.css";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authorize, getData } from "./sheets.server";
import { useSelectedMonth } from "context/selectedMonthContext";
import { countWeekdaysInMonth, calculateMonthlyRate, rates } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "../../@/components/ui/data-table";
import { studentColumns, staffColumns } from "./columns";
import { Input } from "../../@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { accountingColumns } from "./columns";
import "../tailwind.css";

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
  const [selectedSchool, setSelectedSchool] = useState("all");
  const filteredStaff = staff.filter(
    (member: StaffMember) =>
      (selectedSchool === "all" || member.school === selectedSchool) &&
      (member.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchText.toLowerCase()))
  );

  const { selectedMonth, setSelectedMonth } = useSelectedMonth();
  const months = Array.from({ length: 12 }, (_, index) => ({
    label: new Date(0, index).toLocaleString("default", { month: "long" }),
    value: index,
  }));
  const monthNames = Array.from({ length: 12 }, (item, index) =>
    new Date(0, index).toLocaleString("default", { month: "long" })
  );

  const filteredStudents = students.filter(
    (student: Student) =>
      (selectedSchool === "all" || student.school === selectedSchool) &&
      (student.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase()))
  );

  function getUniqueSchools(
    staff: StaffMember[],
    students: Student[]
  ): string[] {
    const schoolSet = new Set<string>();
    staff.forEach((member) => schoolSet.add(member.school));
    students.forEach((student) => schoolSet.add(student.school));
    return Array.from(schoolSet);
  }

  const getAccountingColumns = (selectedMonth) => {
    return [
      ...studentColumns,
      {
        accessorKey: "billing",
        header: "Billing",
        cell: (info) => {
          const year = new Date().getFullYear(); // Adjust as needed
          const weekdayCounts = countWeekdaysInMonth(year, selectedMonth + 1); // Adjust for 0-indexed months
          const rate = calculateMonthlyRate(
            info.row.original.weeklySchedule,
            weekdayCounts
          );
          return `$${rate.toFixed(2)}`;
        },
      },
    ];
  };

  console.log("Staff Data:", staff);
  console.log("Students Data:", students);

  return (
    <div className="container">
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1 className="text-4xl font-bold text-center p-4 uppercase">
          School App
        </h1>

        <Input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter by School DROPDOWN</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedSchool("all")}>
              All
            </DropdownMenuItem>
            {getUniqueSchools(staff, students).map((school: string) => (
              <DropdownMenuItem
                key={school}
                onClick={() => setSelectedSchool(school)}
              >
                {school}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-4">
            <TabsTrigger value="students" className="tab-style">
              Students
            </TabsTrigger>
            <TabsTrigger value="staff" className="tab-style">
              Staff
            </TabsTrigger>
            <TabsTrigger value="accounting" className="tab-style">
              Accounting
            </TabsTrigger>
          </TabsList>
          <div className="relative w-full overflow-x-auto overflow-y-auto max-h-[500px]">
            <TabsContent value="students">
              <h2 className="text-2xl font-bold mb-4">Students</h2>

              <DataTable columns={studentColumns} data={filteredStudents} />
            </TabsContent>

            <TabsContent value="staff">
              <h2 className="text-2xl font-bold mb-4">Staff</h2>
              <DataTable columns={staffColumns} data={filteredStaff} />
            </TabsContent>

            <TabsContent value="accounting">
              <h2 className="text-2xl font-bold mb-4">Accounting</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{monthNames[selectedMonth]}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {months.map((month) => (
                    <DropdownMenuItem
                      className="dropdown-menu-item"
                      onClick={() => setSelectedMonth(month.value)}
                    >
                      {month.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DataTable
                columns={getAccountingColumns(selectedMonth)}
                data={filteredStudents}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
