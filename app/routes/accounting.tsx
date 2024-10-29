// import { useState } from "react";
// import { useLoaderData } from "@remix-run/react";
// import { DataTable } from "@/components/ui/data-table";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { ProfileViewModal } from "@/components/profile-view-modal";
// import { getAccountingColumns } from "./columns";
// import { useSelectedMonth } from "context/selectedMonthContext";
// import { staffStudentDataLayer } from "~/data/initializedatalayer.server";


// export async function loader() {
//   const { default: staffStudentDataLayer } = await import("../data/initializedatalayer.server");
//   const data = await staffStudentDataLayer.getData();
//   return data;
// }

// export default function Accounting() {
//   const { students } = useLoaderData();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const { selectedMonth, setSelectedMonth } = useSelectedMonth();
//   const months = Array.from({ length: 12 }, (_, index) => ({
//     label: new Date(0, index).toLocaleString("default", { month: "long" }),
//     value: index,
//   }));
//   const monthNames = Array.from({ length: 12 }, (_, index) =>
//     new Date(0, index).toLocaleString("default", { month: "long" })
//   );

//   const handleProfileClick = (profile) => {
//     setSelectedProfile(profile);
//     setIsModalOpen(true);
//   };

//   const accountingColumnsWithClick = getAccountingColumns(handleProfileClick, selectedMonth);

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Accounting</h2>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button className="button-style" variant="outline">
//             {monthNames[selectedMonth]}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           {months.map((month) => (
//             <DropdownMenuItem
//               className="dropdown-menu-item"
//               key={month.value}
//               onClick={() => setSelectedMonth(month.value)}
//             >
//               {month.label}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <ProfileViewModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         profile={selectedProfile}
//         onUpdate={() => window.location.reload()}
//       />
//       <DataTable columns={accountingColumnsWithClick} data={students} />
//     </div>
//   );
// }
