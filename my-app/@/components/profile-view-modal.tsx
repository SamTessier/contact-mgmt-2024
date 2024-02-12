import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StaffMember, Student } from "app/routes/_index"; // Adjust the import path as necessary

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Student | StaffMember | null; 
}

export const ProfileViewModal = ({ isOpen, onClose, profile }: ProfileProps) => {
  if (!isOpen || !profile) return null;

  // Determine if the profile is a Student or StaffMember
  const isStudent = 'studentName' in profile;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>
            {isStudent ? profile.studentName : `${profile.firstName} ${profile.lastName}`}
          </CardTitle>
          <CardDescription>{profile.school}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Common fields */}
          <p>Email: {profile.email}</p>
          <p>Phone: {isStudent ? profile.phoneOne : profile.phone}</p>

          {/* Staff-specific field */}
          {!isStudent && <p>Availability: {profile.availability}</p>}

          {/* Student-specific fields */}
          {isStudent && (
            <>
              <p>Weekly Schedule: {profile.weeklySchedule}</p>
              <p>Notes: {profile.notes}</p>
              <p>Parent 1: {profile.parentOne}</p>
              <p>Parent 2: {profile.parentTwo}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileViewModal;
