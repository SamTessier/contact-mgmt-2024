import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authorize, getData } from "./sheets.server";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ProfileViewModal } from "@/components/profile-view-modal";
import { getStaffColumns } from "./columns";
import { Button } from "@/components/ui/button";

export async function loader() {
  const client = await authorize();
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const data = await getData(client, spreadsheetId);
  return data;
}

export default function Staff() {
  const { staff } = useLoaderData();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleAddProfile = () => {
    navigate('/profile/add', { state: { sheetName: 'Staff' } });
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
      <Button variant="primary" onClick={handleAddProfile}>Add Profile</Button>
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
