// import React, { useState } from 'react';
// import { useLoaderData } from "@remix-run/react";
// import { LoaderFunction } from "@remix-run/node";
// import { StaffStudentRatioChart } from "@/components/ui/ratio-chart";
// import { staffStudentDataLayer } from "~/data/initializedatalayer.server";
// import { requireUser } from "@/lib/utils";

// export const loader: LoaderFunction = async (args) => {
//   try {
//     await requireUser(args); // Ensure the user is authenticated

//     // Fetch data for both staff and students
//     const staff = await staffStudentDataLayer.getData("staff");
//     const students = await staffStudentDataLayer.getData("students");
//     const results = { /* Add logic to fetch results if needed */ };

//     // Ensure both staff and students are arrays
//     return { staff: Array.isArray(staff) ? staff : [], students: Array.isArray(students) ? students : [], results };
//   } catch (error) {
//     console.error("Failed to load data:", error);
//     throw new Response("Failed to load data", { status: 500 });
//   }
// };

// const HomePage = () => {
//   const { staff, students } = useLoaderData();
//   const [day, setDay] = useState('M'); // Default to Monday

//   // Handle changing the selected day
//   const handleDayChange = (event) => {
//     setDay(event.target.value);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <select value={day} onChange={handleDayChange} className="p-2 border rounded">
//           <option value="M">Monday</option>
//           <option value="T">Tuesday</option>
//           <option value="W">Wednesday</option>
//           <option value="TH">Thursday</option>
//           <option value="F">Friday</option>
//         </select>
//       </div>
//       <StaffStudentRatioChart staff={staff} students={students} day={day} />
//     </div>
//   );
// };

// export default HomePage;
