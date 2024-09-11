import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUser } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ProfileViewModal } from "@/components/profile-view-modal";
import { getStaffColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { staffStudentDataLayer } from "../data/initializedatalayer.server";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async (args) => {
  console.log("Loading staff data...");
  try {
    await requireUser(args);
    const staff = await staffStudentDataLayer.getData("Staff");
    console.log("Loaded staff data:", staff);
    return { staff };
  } catch (error) {
    console.error("Failed to load staff data:", error);
    return redirect("/login");
  }
};

export default function Students() {
  const { staff } = useLoaderData<{ staff: any[] }>();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleAddProfile = () => {
    navigate("/staff/add", { state: { sheetName: "Staff" } });
  };

  const filteredStaff = staff.filter((member) => {
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
