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
import { useNavigate } from "@remix-run/react";

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
  const navigate = useNavigate();
  const [editableProfile, setEditableProfile] = useState<Student | StaffMember | null>(profile);

  useEffect(() => {
    if (profile) {
      setEditableProfile(profile);
    }
  }, [profile]);

  if (!isOpen || !profile) return null;

  const handleEditClick = () => {
    navigate('/profile/edit', { state: { profile, sheetName } });
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
          <>
            <p>Email: {profile.email}</p>
            <p>Phone: {sheetName === "Students" ? (profile as Student).phoneOne : (profile as StaffMember).phone}</p>
            <p>School: {profile.school}</p>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <CopyButton text={getModalContent()} />
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleEditClick}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => navigate('/profile/delete', { state: { profile, sheetName } })}>
              Delete
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
