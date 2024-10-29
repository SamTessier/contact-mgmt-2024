import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/node";
import { requireUser } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ProfileViewModal } from "@/components/profile-view-modal";
import { getStudentColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { staffStudentDataLayer } from "../data/initializedatalayer.server";


export const loader: LoaderFunction = async (args) => {
  console.log("Loading students data...");
  try {
    await requireUser(args);
    const students = await staffStudentDataLayer.getData("Students");
    console.log("Loaded students data:", students);
    return { students };

  } catch (error) {
    console.error("Failed to load students data:", error);
return redirect("/login");
  }
}

export default function Students() {
  const { students } = useLoaderData<{ students: any[] }>();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleAddProfile = () => {
    navigate("/students/add", { state: { sheetName: "Students" } });
  };

  const filteredStudents = students.filter((student) => {
    if (!student || !student.studentName || !student.email) {
      return false;
    }
    return (
      student.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const studentColumnsWithClick = getStudentColumns(handleProfileClick);

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
        <Button onClick={handleAddProfile} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <DataTable 
          columns={studentColumnsWithClick} 
          data={filteredStudents}
        />
      </div>

      <ProfileViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={selectedProfile}
        onUpdate={() => window.location.reload()}
        sheetName="Students"
      />
    </div>
  );
}
