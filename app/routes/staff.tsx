import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ProfileViewModal } from "@/components/ui/profile-view-modal";
import { getStaffColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import { LoaderFunction } from "@remix-run/node";
import { staffStudentDataLayer } from "../data/initializedatalayer.server";
import { requireUser } from "@/lib/utils";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async (args) => {
  console.log("Loading staff data...");
  try {
    await requireUser(args);
    const data = await staffStudentDataLayer.getData("Staff");
    const staff = 'staff' in data ? data.staff : [];
    console.log("Loaded staff data:", staff);
    return { staff };
  } catch (error) {
    console.error("Failed to load staff data:", error);
    return redirect("/login");
  }
};

export default function Staff() {
  const data = useLoaderData<{ staff: any[] }>();
  const staff = data?.staff || [];
  
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (profile: any) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };
  
  const handleAddProfile = () => {
    navigate('/staff/add');
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
    <div className="space-y-6 p-6 pb-16">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
        <Button onClick={handleAddProfile} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <DataTable 
          columns={staffColumnsWithClick} 
          data={filteredStaff}
        />
      </div>

      <ProfileViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={selectedProfile}
        onUpdate={() => window.location.reload()}
        sheetName="Staff"
      />
    </div>
  );
}
