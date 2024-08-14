import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUser } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ProfileViewModal } from "@/components/profile-view-modal";
import { getStaffColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { staffStudentDataLayer } from "../data/initializedatalayer.server";
import { useEffect } from "react";

export const loader: LoaderFunction = async (args) => {
  try {
    await requireUser(args);
    const staff = staffStudentDataLayer.getData("staff");
    return { staff};
  } catch (error) {
    console.error("Failed to load staff data:", error);
    throw new Response("Failed to load staff data", { status: 500 });
  }
};
export default function Staff() {
  const { staff } = useLoaderData();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [sheetName, setSheetName] = useState("students");
  const navigate = useNavigate();

  useEffect(() => {
    setSheetName("staff");
  }, []);


  const staffArray = Array.isArray(staff) ? staff : [];


  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleAddProfile = () => {
    navigate("/staff/add", { state: { sheetName: "Staff" } });
  };

  const filteredStaff = staffArray.filter((member) => {
    if (!member || !member.firstName || !member.lastName) {
      return false;
    }
    return (
      member.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const staffColumnsWithClick = getStaffColumns(handleProfileClick);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Staff</h2>
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
        sheetName="Staff"
      />
      <DataTable columns={staffColumnsWithClick} data={filteredStaff} />
    </div>
  );
}
