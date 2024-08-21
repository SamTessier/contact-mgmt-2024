// import React from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import { calculateRatios } from "@/lib/utils";

// const StaffStudentRatioChart = ({ staff, students, day }) => {
//   const data = React.useMemo(() => {
//     const ratios = calculateRatios(staff, students, day);
//     return ratios.map(({ school, ratio }) => ({
//       school,
//       ratio,
//     }));
//   }, [staff, students, day]);

//   const getColor = (ratio) => {
//     if (ratio >= 16) return 'darkred'; // Way too many students per staff
//     if (ratio >= 8) return 'green';
//     if (ratio >= 4) return 'orange';
//     return 'red';
//   };

//   return (
//     <div style={{ width: '100%', height: '300px' }}>
//       <ResponsiveBar
//         data={data}
//         keys={['ratio']}
//         indexBy="school"
//         margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//         padding={0.3}
//         colors={({ data }) => getColor(data.ratio)}
//         axisBottom={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: 'School',
//           legendPosition: 'middle',
//           legendOffset: 32,
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: 'Staff/Student Ratio',
//           legendPosition: 'middle',
//           legendOffset: -40,
//         }}
//         labelSkipWidth={12}
//         labelSkipHeight={12}
//         labelTextColor={{
//           from: 'color',
//           modifiers: [['darker', 1.6]],
//         }}
//         animate={true}
//         motionStiffness={90}
//         motionDamping={15}
//       />
//     </div>
//   );
// };

// export { StaffStudentRatioChart };