import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust path as necessary
import { Button } from "@/components/ui/button"; // Adjust path as necessary
import { StaffMember, Student } from "app/routes/_index";
import { useFetcher } from "@remix-run/react";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Student | StaffMember;
  onUpdate: () => void;
}

export const ProfileViewModal = ({
  isOpen,
  onClose,
  profile,
  onUpdate,
}: ProfileProps) => {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<Student | StaffMember | null>(profile);

  useEffect(() => {
    if (profile) {
      setEditableProfile(profile);
    }
  }, [profile]);

  if (!isOpen || !profile) return null;

  const isStudent = (profile: Student | StaffMember): profile is Student => {
    return (profile as Student).studentName !== undefined;
  };

  const handleDelete = () => {
    const requestData = {
      data: profile,
      sheetName: isStudent(profile) ? "Students" : "Staff",
    };
    console.log("Request data:", requestData); 
    fetcher.submit(
      { 
        ...requestData
      },
      {
        method: "post",
        action: `/profile/${profile.email}`, 
        encType: "application/json",
      }
    );
    onUpdate();
    onClose();
  };
  
  
  

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
      sheetName: isStudent(profile) ? "Students" : "Staff",
    };
    fetcher.submit(
      { body: JSON.stringify(requestData) },
      {
        method: "post",
        action: "/update-profile",
        encType: "application/json",
      }
    );
    onUpdate();
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>
            {isStudent(profile)
              ? profile.studentName
              : `${profile.firstName} ${profile.lastName}`}
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
                name={isStudent(profile) ? "phoneOne" : "phone"}
                value={isStudent(profile) ? editableProfile?.phoneOne || "" : editableProfile?.phone || ""}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              {!isStudent(profile) && (
                <input
                  type="text"
                  name="availability"
                  value={editableProfile?.availability || ""}
                  onChange={handleInputChange}
                  placeholder="Availability"
                />
              )}
              {isStudent(profile) && (
                <>
                  <input
                    type="text"
                    name="weeklySchedule"
                    value={editableProfile?.weeklySchedule || ""}
                    onChange={handleInputChange}
                    placeholder="Weekly Schedule"
                  />
                  <input
                    type="text"
                    name="notes"
                    value={editableProfile?.notes || ""}
                    onChange={handleInputChange}
                    placeholder="Notes"
                  />
                  <input
                    type="text"
                    name="parentOne"
                    value={editableProfile?.parentOne || ""}
                    onChange={handleInputChange}
                    placeholder="Parent 1"
                  />
                  <input
                    type="text"
                    name="parentTwo"
                    value={editableProfile?.parentTwo || ""}
                    onChange={handleInputChange}
                    placeholder="Parent 2"
                  />
                </>
              )}
            </>
          ) : (
            <>
              <p>Email: {profile.email}</p>
              <p>Phone: {isStudent(profile) ? profile.phoneOne : profile.phone}</p>
              {!isStudent(profile) && <p>Availability: {profile.availability}</p>}
              {isStudent(profile) && (
                <>
                  <p>Weekly Schedule: {profile.weeklySchedule}</p>
                  <p>Notes: {profile.notes}</p>
                  <p>Parent 1: {profile.parentOne}</p>
                  <p>Parent 2: {profile.parentTwo}</p>
                </>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSave}>
            Save
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileViewModal;
