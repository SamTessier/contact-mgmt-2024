// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import type { Student, StaffMember } from "./_index";
export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "school",
    header: "School",
    enableSorting: true,
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
    enableSorting: true,
  },
  {
    accessorKey: "weeklySchedule",
    header: "Weekly Schedule",
    enableSorting: true,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "phoneOne",
    header: "Phone 1",
    enableSorting: true,
  },
  {
    accessorKey: "parentOne",
    header: "Parent 1",
    enableSorting: true,
  },
  {
    accessorKey: "parentTwo",
    header: "Parent 2",
    enableSorting: true,
  },
];

export const staffColumns: ColumnDef<StaffMember>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    enableSorting: true,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    enableSorting: true,
  },
  {
    accessorKey: "school",
    header: "School",
    enableSorting: true,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "availability",
    header: "Availability",
    
  },
];
