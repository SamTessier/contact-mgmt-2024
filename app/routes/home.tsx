import React, { useState, Suspense } from 'react';
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { calculateRatios } from '@/lib/utils';
import { authorize, getData } from '../googlesheetsserver';

export const loader: LoaderFunction = async () => {
  const auth = await authorize();
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEETS_ID environment variable is not set.");
  }
  const { staff, students } = await getData(auth, sheetId, "Data");
  return json({ staff, students });
};

const Chart = React.lazy(() => import('react-charts').then((mod) => ({ default: mod.Chart })));

const StaffStudentRatioChart = ({ staff, students, day }: { staff: any[], students: any[], day: string }) => {
  const data = React.useMemo(() => {
    const ratios = calculateRatios(staff, students, day);
    return [
      {
        label: 'Staff/Student Ratio',
        data: ratios.map(({ school, ratio }) => ({
          school,
          ratio,
        })),
      },
    ];
  }, [staff, students, day]);

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum: any) => datum.school,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum: any) => datum.ratio,
        elementType: 'bar',
      },
    ],
    []
  );

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Suspense fallback={<div>Loading chart...</div>}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </Suspense>
    </div>
  );
};

const HomePage = () => {
  const { staff, students } = useLoaderData();
  const [day, setDay] = useState('M'); // Default to Monday

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <label htmlFor="day-select" className="block text-sm font-medium text-gray-700">
          Select Day:
        </label>
        <select id="day-select" value={day} onChange={(e) => setDay(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
          <option value="M">Monday</option>
          <option value="T">Tuesday</option>
          <option value="W">Wednesday</option>
          <option value="TH">Thursday</option>
          <option value="F">Friday</option>
        </select>
      </div>
      <StaffStudentRatioChart staff={staff} students={students} day={day} />
    </div>
  );
};

export default HomePage;
