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

  const calculateRatios = () => {
    const availableStaff = staff.filter(s => 
      s.availability && s.availability.includes(selectedDay)
    ).length;

    const scheduledStudents = students.filter(s => 
      s.weeklySchedule && s.weeklySchedule.includes(selectedDay)
    ).length;

    return [
      {
        day: selectedDay,
        staff: availableStaff,
        students: scheduledStudents,
        ratio: availableStaff ? (scheduledStudents / availableStaff).toFixed(2) : 0
      }
    ];
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
          options={[
            { value: 'M', label: 'Monday' },
            { value: 'T', label: 'Tuesday' },
            { value: 'W', label: 'Wednesday' },
            { value: 'TH', label: 'Thursday' },
            { value: 'F', label: 'Friday' }
          ]}
        />
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
              {calculateRatios()[0].ratio}:1
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff/Student Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calculateRatios()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="staff" fill="#8884d8" name="Staff" />
                  <Bar dataKey="students" fill="#82ca9d" name="Students" />
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
