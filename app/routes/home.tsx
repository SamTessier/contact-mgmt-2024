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
    const { staff, students } = await staffStudentDataLayer.getData("Staff");
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

  const getSchoolDistribution = () => {
    const schools = new Map();
    students.forEach(student => {
      if (student.school) {
        schools.set(student.school, (schools.get(student.school) || 0) + 1);
      }
    });
    return Array.from(schools.entries()).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Select
          value={selectedDay}
          onValueChange={setSelectedDay}
        >
          <option value="M">Monday</option>
          <option value="T">Tuesday</option>
          <option value="W">Wednesday</option>
          <option value="TH">Thursday</option>
          <option value="F">Friday</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(students.map(s => s.school)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Ratio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateSchoolRatios().reduce((acc, { ratio }) => acc + parseFloat(ratio), 0) / calculateSchoolRatios().length || 0}:1
            </div>
          </CardContent>
        </Card>
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

        <Card>
          <CardHeader>
            <CardTitle>School Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getSchoolDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getSchoolDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
