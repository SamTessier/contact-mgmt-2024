// columns.tsx
import { ColumnDef, CellContext } from "@tanstack/react-table";
import type { Student, StaffMember } from "./_index";
import { calculateMonthlyRate, countWeekdaysInMonth, rates } from '@/lib/utils';

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

export const accountingColumns: ColumnDef<Student>[] = [
  ...studentColumns,
  {
    accessorKey: 'billing',
    header: 'Billing',
    cell: (info: CellContext<Student, unknown>) => {
      const weekdayCounts = countWeekdaysInMonth(2024, 1); 
      const rate = calculateMonthlyRate(info.row.original.weeklySchedule, weekdayCounts);
      return `$${rate.toFixed(2)}`;
    }
  },
];