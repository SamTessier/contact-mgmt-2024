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

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Student | StaffMember | null;
}

export const ProfileViewModal = ({
  isOpen,
  onClose,
  profile,
}: ProfileProps) => {
  if (!isOpen || !profile) return null;

  const isStudent = "studentName" in profile;

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
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileViewModal;
