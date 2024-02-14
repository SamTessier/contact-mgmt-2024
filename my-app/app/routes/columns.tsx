import { ColumnDef } from "@tanstack/react-table";
import type { Student, StaffMember } from "./_index"; 
import { calculateMonthlyRate, countWeekdaysInMonth } from '@/lib/utils';

export const getStudentColumns = (handleProfileClick: (profile: Student | StaffMember) => void): ColumnDef<Student | StaffMember>[] => [
  {
    accessorKey: "studentName",
    header: "Student Name",
    enableSorting: true,
    cell: info => (
      <div onClick={() => handleProfileClick(info.row.original)} className="cursor-pointer text-blue-600 hover:text-blue-800">
        {info.getValue() as ReactNode}
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
    header: "Phone 1",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },

];

export const getStaffColumns = (handleProfileClick: (profile: Student | StaffMember) => void): ColumnDef<Student | StaffMember>[] => [
  {
    accessorKey: "firstName",
    header: "First Name",
    enableSorting: true,
    cell: info => (
      <div onClick={() => handleProfileClick(info.row.original)} className="cursor-pointer text-blue-600 hover:text-blue-800">
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
    enableSorting: true,
  },
];

export const getAccountingColumns = (handleProfileClick: (profile: Student | StaffMember) => void, selectedMonth: number): ColumnDef<Student | StaffMember>[] => [
  ...getStudentColumns(handleProfileClick).map(column => ({
    ...column,
  })),
  // 
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
