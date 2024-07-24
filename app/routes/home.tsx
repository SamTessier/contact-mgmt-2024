import React, { useState, Suspense } from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { calculateRatios } from "@/lib/utils";
import { authorize, getData } from "../googlesheetsserver";
import { DatePicker } from "@/components/ui/date-picker";
import connection from "~/config/db";


export const loader: LoaderFunction = async () => {
  const auth = await authorize();
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEETS_ID environment variable is not set.");
  }
  const { staff, students } = await getData(auth, sheetId, "Data");
  const results = await connection.query("SELECT 1 + 1 AS solution");
  return json({ staff, students, results });
};

const Chart = React.lazy(() => import('react-charts').then((mod) => ({ default: mod.Chart })));

const StaffStudentRatioChart = ({ staff, students, day }) => {
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
      getValue: (datum) => datum.school,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum.ratio,
        elementType: 'bar',
      },
    ],
    []
  );

  const getColor = (ratio) => {
    if (ratio >= 16) return 'darkred'; // Way too many students per staff
    if (ratio >= 8) return 'green';
    if (ratio >= 4) return 'orange';
    return 'red';
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Suspense fallback={<div>Loading chart...</div>}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            getSeriesStyle: (series) => ({
              fill: series.datums.map((datum) => getColor(datum.originalDatum.ratio)),
            }),
          }}
        />
      </Suspense>
    </div>
  );
};

const HomePage = () => {
  const { staff, students, results } = useLoaderData();
  const [day, setDay] = useState('M'); // Default to Monday

  const handleDateSelect = (selectedDay: string) => {
    setDay(selectedDay);
  };

  return (
    <div className="container mx-auto p-4">
      {JSON.stringify(results)}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DatePicker onDateSelect={handleDateSelect} />
      </div>
      <StaffStudentRatioChart staff={staff} students={students} day={day} />
    </div>
  );
};

export default HomePage;
