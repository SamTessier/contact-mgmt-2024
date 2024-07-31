import React, { useState, Suspense } from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { calculateRatios, requireUser } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { staffStudentDataLayer } from "~/data/initializedatalayer.server";

export const loader: LoaderFunction = async (args) => {
  await requireUser(args);

  const data = await staffStudentDataLayer.getData("staff");

  return json(data);
};

const Chart = React.lazy(() =>
  import("react-charts").then((mod) => ({ default: mod.Chart }))
);

const StaffStudentRatioChart = ({ staff, students, day }) => {
  const data = React.useMemo(() => {
    const ratios = calculateRatios(staff, students, day);
    return [
      {
        label: "Staff/Student Ratio",
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
        elementType: "bar",
      },
    ],
    []
  );

  const getColor = (ratio) => {
    if (ratio >= 16) return "darkred"; // Way too many students per staff
    if (ratio >= 8) return "green";
    if (ratio >= 4) return "orange";
    return "red";
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Suspense fallback={<div>Loading chart...</div>}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            getSeriesStyle: (series) => ({
              fill: series.datums.map((datum) =>
                getColor(datum.originalDatum.ratio)
              ),
            }),
          }}
        />
      </Suspense>
    </div>
  );
};

const HomePage = () => {
  const { staff, students } = useLoaderData();
  const [day, setDay] = useState("M"); // Default to Monday

  const handleDateSelect = (selectedDay: string) => {
    setDay(selectedDay);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DatePicker onDateSelect={handleDateSelect} />
      </div>
      <StaffStudentRatioChart staff={staff} students={students} day={day} />
    </div>
  );
};

export default HomePage;
