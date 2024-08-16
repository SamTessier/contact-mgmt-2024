// // HomePage.tsx
// import React, { useState } from 'react';
// import { useLoaderData } from "@remix-run/react";
// import { LoaderFunction } from "@remix-run/node";
// import { StaffStudentRatioChart } from "@/components/ui/ratio-chart";
// import { DatePicker } from "@/components/ui/date-picker";
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
//   const { staff, students, results } = useLoaderData();
//   const [day, setDay] = useState('M'); // Default to Monday

//   const handleDateSelect = (selectedDay: string) => {
//     setDay(selectedDay);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {JSON.stringify(results)}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <DatePicker onDateSelect={handleDateSelect} />
//       </div>
//       <StaffStudentRatioChart staff={staff} students={students} day={day} />
//     </div>
//   );
// };

// export default HomePage;
