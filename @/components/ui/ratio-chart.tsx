// import React, { useMemo } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
// import { calculateRatios } from "@/lib/utils";

// const StaffStudentRatioChart = ({ staff, students, day }) => {
//   const data = useMemo(() => {
//     const ratios = calculateRatios(staff, students, day);
//     return ratios.map(({ school, ratio }) => ({
//       school,
//       ratio,
//     }));
//   }, [staff, students, day]);

//   const getColor = (ratio) => {
//     return ratio === 8 ? 'green' : 'red';
//   };

//   const renderCustomBarLabel = ({ x, y, width, value }) => {
//     return (
//       <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>
//         {value.toFixed(2)}
//       </text>
//     );
//   };

//   return (
//     <div style={{ width: '100%', height: '300px' }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={data}
//           margin={{ top: 50, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="school" />
//           <YAxis domain={[0, 16]} label={{ value: 'Student/Staff Ratio', angle: -90, position: 'insideLeft' }} />
//           <Tooltip />
//           <Bar
//             dataKey="ratio"
//             fill="#8884d8"
//             label={renderCustomBarLabel}
//             barSize={30}
//             fill={({ payload }) => getColor(payload.ratio)}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export { StaffStudentRatioChart };
