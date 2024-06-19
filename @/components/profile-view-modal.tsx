import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copybutton";
import { useFetcher, useNavigate } from "@remix-run/react";

export interface Student {
  studentName: string;
  school: string;
  phoneOne: string;
  phoneTwo: string;
  email: string;
  weeklySchedule: string;
  notes: string;
  parentOne: string;
  parentTwo: string;
}

export interface StaffMember {
  firstName: string;
  lastName: string;
  school: string;
  phone: string;
  email: string;
  availability: string;
}

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Student | StaffMember | null;
  onUpdate: () => void;
  sheetName: string;
}

export const ProfileViewModal = ({
  isOpen,
  onClose,
  profile,
  onUpdate,
  sheetName,
}: ProfileProps) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<Student | StaffMember | null>(profile);

  useEffect(() => {
    if (profile) {
      setEditableProfile(profile);
    }
  }, [profile]);

  if (!isOpen || !profile) return null;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editableProfile) return;
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleSave = () => {
    const updatedProfile = { ...editableProfile };
    const requestData = {
      data: updatedProfile,
      sheetName,
    };
    fetcher.submit(
      { requestData: JSON.stringify(requestData) },
      {
        method: "post",
        action: "/update-profile",
        encType: "application/json"
      }
    );
    onUpdate();
    onClose();
  };

  const handleDeleteClick = () => {
    navigate('/profile/delete', { state: { profile, sheetName } });
  };

  const getModalContent = () => {
    const email = `Email: ${profile.email}`;
    const phone = `Phone: ${sheetName === "Students" ? (profile as Student).phoneOne : (profile as StaffMember).phone}`;
    const school = `School: ${profile.school}`;
    const availability = sheetName === "Staff" ? `Availability: ${(profile as StaffMember).availability}` : "";
    const weeklySchedule = sheetName === "Students" ? `Weekly Schedule: ${(profile as Student).weeklySchedule}` : "";
    const notes = sheetName === "Students" ? `Notes: ${(profile as Student).notes}` : "";
    const parentOne = sheetName === "Students" ? `Parent 1: ${(profile as Student).parentOne}` : "";
    const parentTwo = sheetName === "Students" ? `Parent 2: ${(profile as Student).parentTwo}` : "";

    return [
      email,
      phone,
      school,
      availability,
      weeklySchedule,
      notes,
      parentOne,
      parentTwo,
    ]
      .filter(Boolean)
      .join("\n");
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>
            {sheetName === "Students"
              ? (profile as Student).studentName
              : `${(profile as StaffMember).firstName} ${(profile as StaffMember).lastName}`}
          </CardTitle>
          <CardDescription>{profile.school}</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <>
              <input
                type="text"
                name="email"
                value={editableProfile?.email || ""}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                name={sheetName === "Students" ? "phoneOne" : "phone"}
                value={sheetName === "Students" ? (editableProfile as Student)?.phoneOne || "" : (editableProfile as StaffMember)?.phone || ""}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              {sheetName === "Staff" && (
                <input
                  type="text"
                  name="availability"
                  value={(editableProfile as StaffMember)?.availability || ""}
                  onChange={handleInputChange}
                  placeholder="Availability"
                />
              )}
              {sheetName === "Students" && (
                <>
                  <input
                    type="text"
                    name="weeklySchedule"
                    value={(editableProfile as Student)?.weeklySchedule || ""}
                    onChange={handleInputChange}
                    placeholder="Weekly Schedule"
                  />
                  <input
                    type="text"
                    name="notes"
                    value={(editableProfile as Student)?.notes || ""}
                    onChange={handleInputChange}
                    placeholder="Notes"
                  />
                  <input
                    type="text"
                    name="parentOne"
                    value={(editableProfile as Student)?.parentOne || ""}
                    onChange={handleInputChange}
                    placeholder="Parent 1"
                  />
                  <input
                    type="text"
                    name="parentTwo"
                    value={(editableProfile as Student)?.parentTwo || ""}
                    onChange={handleInputChange}
                    placeholder="Parent 2"
                  />
                </>
              )}
            </>
          ) : (
            <>
              <p>Email: {profile.email}</p>
              <p>Phone: {sheetName === "Students" ? (profile as Student).phoneOne : (profile as StaffMember).phone}</p>
              {sheetName === "Staff" && <p>Availability: {(profile as StaffMember).availability}</p>}
              {sheetName === "Students" && (
                <>
                  <p>Weekly Schedule: {(profile as Student).weeklySchedule}</p>
                  <p>Notes: {(profile as Student).notes}</p>
                  <p>Parent 1: {(profile as Student).parentOne}</p>
                  <p>Parent 2: {(profile as Student).parentTwo}</p>
                </>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <CopyButton text={getModalContent()} />
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleEditClick}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDeleteClick}>
                  Delete
                </Button>
              </>
            )}
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
