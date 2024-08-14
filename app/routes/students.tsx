import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUser } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ProfileViewModal } from "@/components/profile-view-modal";
import { getStudentColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { staffStudentDataLayer } from "~/data/initializedatalayer.server";

export const loader: LoaderFunction = async (args) => {
  try {
    await requireUser(args);
    const students = await staffStudentDataLayer.getData("students");
    console.log("Students:", students);
    return { students };
  } catch (error) {
    console.error("Failed to load students data:", error);
    throw new Response("Failed to load students data", { status: 500 });
  }
};

export default function Students() {
  const { students } = useLoaderData<{ students: any[] }>();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [sheetName, setSheetName] = useState("students");
  const navigate = useNavigate();

  useEffect(() => {
    setSheetName("students");
  }, []);

  const studentsArray = Array.isArray(students) ? students : [];

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleAddProfile = () => {
    navigate("/students/add", { state: { sheetName: "students" } });
  };

  const filteredStudents = studentsArray.filter((student) => {
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <Input
        className="border-gray-300 shadow-lg px-4 py-2 justify-center rounded-md"
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Button variant="primary" onClick={handleAddProfile}>
        Add Profile
      </Button>
      <ProfileViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={selectedProfile}
        onUpdate={() => window.location.reload()}
        sheetName="Students"
      />
      <DataTable columns={studentColumnsWithClick} data={filteredStudents} />
    </div>
  );
}
