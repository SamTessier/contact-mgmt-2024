import { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<Student | StaffMember | null>(profile);

  if (!isOpen || !profile) return null;

  const isStudent = "studentName" in profile;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editableProfile) return;
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleSave = async () => {
    const updatedProfile = { ...editableProfile };
    const requestData = {
      data: JSON.stringify(updatedProfile),
      isStudent: isStudent.toString(),
    };
    fetcher.submit(
      requestData,
      { method: "post", action: "/api/update", encType: "application/json" }
    );
    onUpdate();
    onClose();
  };

  const handleDelete = async () => {
    const requestData = { data: JSON.stringify(profile), isStudent: isStudent.toString() };
    fetcher.submit(
      requestData,
      { method: "post", action: "/delete", encType: "application/json" }
    );
    onUpdate();
    onClose();
  };

  const getModalContent = () => {
    const email = `Email: ${profile.email}`;
    const phone = `Phone: ${isStudent ? profile.phoneOne : profile.phone}`;
    const school = `School: ${profile.school}`;
    const availability = !isStudent ? `Availability: ${profile.availability}` : "";
    const weeklySchedule = isStudent ? `Weekly Schedule: ${profile.weeklySchedule}` : "";
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
                name={isStudent ? "phoneOne" : "phone"}
                value={isStudent ? editableProfile?.phoneOne || "" : editableProfile?.phone || ""}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              {!isStudent && (
                <input
                  type="text"
                  name="availability"
                  value={editableProfile?.availability || ""}
                  onChange={handleInputChange}
                  placeholder="Availability"
                />
              )}
              {isStudent && (
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
                <Button variant="destructive" onClick={handleDelete}>
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

export default ProfileViewModal;
