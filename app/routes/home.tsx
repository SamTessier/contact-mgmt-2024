import { useState } from 'react';
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/node";
import { staffStudentDataLayer } from "~/data/initializedatalayer.server";
import { requireUser } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Users, UserCheck, School, Calendar } from "lucide-react";

export const loader: LoaderFunction = async (args) => {
  try {
    await requireUser(args);
    const staff = await staffStudentDataLayer.getData("Staff");
    const students = await staffStudentDataLayer.getData("Students");
    
    return { staff, students };
  } catch (error) {
    console.error("Failed to load data:", error);
    return redirect("/login");
  }
};

export default function HomePage() {
  const { staff, students } = useLoaderData();
  const [selectedDay, setSelectedDay] = useState('M');

  const calculateSchoolRatios = () => {
    const schoolRatios = new Map();

    students.forEach(student => {
      if (student.weeklySchedule && student.weeklySchedule.includes(selectedDay)) {
        const school = student.school;
        if (!schoolRatios.has(school)) {
          schoolRatios.set(school, { students: 0, staff: 0 });
        }
        schoolRatios.get(school).students += 1;
      }
    });

    staff.forEach(member => {
      if (member.availability && member.availability.includes(selectedDay)) {
        const school = member.school;
        if (schoolRatios.has(school)) {
          schoolRatios.get(school).staff += 1;
        }
      }
    });

    return Array.from(schoolRatios.entries()).map(([school, { students, staff }]) => {
      const ratio = staff ? (students / staff).toFixed(2) : 0;
      let color = '#FF0000'; // Red by default
      if (ratio >= 7 && ratio <= 9) {
        color = '#00FF00'; // Green
      } else if (ratio >= 6 && ratio <= 10) {
        color = '#FFFF00'; // Yellow
      }
      return { school, ratio, color };
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Select
          value={selectedDay}
          onValueChange={setSelectedDay}
          options={[
            { value: 'M', label: 'Monday' },
            { value: 'T', label: 'Tuesday' },
            { value: 'W', label: 'Wednesday' },
            { value: 'TH', label: 'Thursday' },
            { value: 'F', label: 'Friday' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>School Student/Staff Ratios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calculateSchoolRatios()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="school" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ratio" name="Ratio" fill="#8884d8">
                    {calculateSchoolRatios().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
