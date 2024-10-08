import { ColumnDef } from "@tanstack/react-table";
import { calculateMonthlyRate, countWeekdaysInMonth } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copybutton"; 
import { Button } from "@/components/ui/button";
import { Student, StaffMember } from "../types";

export const getStudentColumns = (handleProfileClick: (profile: Student | StaffMember) => void): ColumnDef<Student | StaffMember>[] => [
  {
    accessorKey: "studentName",
    header: "Student Name",
    enableSorting: true,
    cell: info => (
      <div onClick={() => handleProfileClick(info.row.original)} className="cursor-pointer hover:text-blue-800">
        {info.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "school",
    header: "School",
    enableSorting: true,
  },
  {
    accessorKey: "weeklySchedule",
    header: "Weekly Schedule",
    enableSorting: true,
  },
  {
    accessorKey: "phoneOne",
    id: "phoneOne", 
    header: "Phone 1",
    enableSorting: true,
    cell: info => (
      <div className="flex items-center">
        <CopyButton text={String(info.getValue())} />
        {info.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "phoneTwo",
    id: "phoneTwo",
    header: "Phone 2",
    enableSorting: true,
    cell: info => (
      <div className="flex items-center">
        <CopyButton text={String(info.getValue())} />
        {info.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "email",
    id: "email", 
    header: "Email",
    enableSorting: true,
    cell: info => (
      <div className="flex items-center">
        <CopyButton text={String(info.getValue())} />
        {info.getValue() as React.ReactNode}
      </div>
    ),
  },
];

export const getStaffColumns = (handleProfileClick: (profile: Student | StaffMember) => void): ColumnDef<Student | StaffMember>[] => [
  {
    accessorKey: "firstName",
    header: "First Name",
    enableSorting: true,
    cell: info => (
      <div onClick={() => handleProfileClick(info.row.original)} className="cursor-pointer hover:text-blue-800">
        {`${info.row.original.firstName} ${info.row.original.lastName}`}
      </div>
    ),
  },
  {
    accessorKey: "school",
    header: "School",
    enableSorting: true,
  },
  {
    accessorKey: "phone",
    id: "phone", 
    header: "Phone",
    enableSorting: true,
    cell: info => (
      <div className="flex items-center">
        <CopyButton text={String(info.getValue())} />
        {info.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "email",
    id: "email", 
    header: "Email",
    enableSorting: true,
    cell: info => (
      <div className="flex items-center">
        <CopyButton text={String(info.getValue())} />
        {info.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "availability",
    header: "Availability",
    enableSorting: true,
  },
  {
    header: "Actions",
    cell: (info) => (
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => handleProfileClick(info.row.original)}>
          View
        </Button>
      </div>
    ),
  },
];


export const getAccountingColumns = (handleProfileClick: (profile: Student | StaffMember) => void, selectedMonth: number): ColumnDef<Student | StaffMember>[] => [
  ...getStudentColumns(handleProfileClick).map(column => ({
    ...column,
  })),
  {
    id: 'billing',
    accessorKey: 'billing',
    header: 'Billing',
    cell: info => {
      const year = new Date().getFullYear();
      const weekdayCounts = countWeekdaysInMonth(year, selectedMonth + 1);
      const rate = calculateMonthlyRate(info.row.original.weeklySchedule, weekdayCounts);
      return `$${rate.toFixed(2)}`;
    },
  },
];
