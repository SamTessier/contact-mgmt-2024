import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StaffMember, Student } from "app/routes/_index";
import { CopyButton } from "@/components/ui/copybutton";
import { useFetcher } from "@remix-run/react";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Student | StaffMember | null;
  onUpdate: () => void;
}

export const ProfileViewModal = ({
  isOpen,
  onClose,
  profile,
  onUpdate,
}: ProfileProps) => {
  const fetcher = useFetcher();

  if (!isOpen || !profile) return null;

  const isStudent = "studentName" in profile;

  const handleEdit = async () => {
    const updatedProfile = { ...profile, email: "updated@example.com" }; // Replace with actual update logic
    const range = isStudent ? `Students!A2:I2` : `Staff!A2:F2`; // Update with the correct range
    fetcher.submit(
      { data: JSON.stringify(updatedProfile), range },
      { method: "post", action: "/api/update" }
    );
    onUpdate();
    onClose();
  };

  const handleDelete = async () => {
    const range = isStudent ? `Students!A1:I101` : `Staff!A2:F101`;
    fetcher.submit(
      { data: JSON.stringify(profile), range },
      { method: "post", action: "/api/delete" }
    );
    onUpdate();
    onClose();
  };
  

  const getModalContent = () => {
    const email = `Email: ${profile.email}`;
    const phone = `Phone: ${isStudent ? profile.phoneOne : profile.phone}`;
    const school = `School: ${profile.school}`;
    const availability = !isStudent
      ? `Availability: ${profile.availability}`
      : "";
    const weeklySchedule = isStudent
      ? `Weekly Schedule: ${profile.weeklySchedule}`
      : "";
    const notes = isStudent ? `Notes: ${profile.notes}` : "";
    const parentOne = isStudent ? `Parent 1: ${profile.parentOne}` : "";
    const parentTwo = isStudent ? `Parent 2: ${profile.parentTwo}` : "";

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
            {isStudent
              ? profile.studentName
              : `${profile.firstName} ${profile.lastName}`}
          </CardTitle>
          <CardDescription>{profile.school}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Email: {profile.email}</p>
          <p>Phone: {isStudent ? profile.phoneOne : profile.phone}</p>
          {!isStudent && <p>Availability: {profile.availability}</p>}
          {isStudent && (
            <>
              <p>Weekly Schedule: {profile.weeklySchedule}</p>
              <p>Notes: {profile.notes}</p>
              <p>Parent 1: {profile.parentOne}</p>
              <p>Parent 2: {profile.parentTwo}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <CopyButton text={getModalContent()} />
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileViewModal;
