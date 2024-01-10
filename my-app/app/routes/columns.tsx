// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import type { Student, StaffMember } from './your-type-definitions-path'; // Adjust the import path as necessary

export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "school",
    header: "School",
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "weeklySchedule",
    header: "Weekly Schedule",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneOne",
    header: "Phone 1",
  },
  {
    accessorKey: "parentOne",
    header: "Parent 1",
  },
  {
    accessorKey: "parentTwo",
    header: "Parent 2",
  },
];

export const staffColumns: ColumnDef<StaffMember>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "school",
    header: "School",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "availability",
    header: "Availability",
  },
];
