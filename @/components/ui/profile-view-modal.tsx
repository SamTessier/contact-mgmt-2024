import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./button";
import { Badge } from "./badge";
import { Edit2, Mail, Phone, MapPin, Calendar, Users, Trash2 } from "lucide-react";
import { InfoCard } from "./info-card";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ProfileViewModal({ isOpen, onClose, profile, onUpdate, sheetName }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!profile) return null;

  const displayName = sheetName === "Staff" 
    ? `${profile.firstName} ${profile.lastName}`
    : profile.studentName;

  const handleDelete = async () => {
    try {
      const response = await fetch(`/${sheetName.toLowerCase()}/delete?email=${profile.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${profile.email}`,
      });

      if (response.ok) {
        onClose();
        window.location.href = `/${sheetName.toLowerCase()}`;
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white border shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {displayName}
              </span>
              <Badge variant="outline" className="bg-primary-50 text-primary-700">
                {sheetName}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard icon={<Mail className="h-5 w-5" />} title="Contact" items={[
                { label: "Email", value: profile.email },
                { label: "Phone One", value: profile.phoneOne },
                { label: "Phone Two", value: profile.phoneTwo || 'N/A' }
              ]} />
              
              <InfoCard icon={<MapPin className="h-5 w-5" />} title="Location" items={[
                { label: "School", value: profile.school }
              ]} />
              
              <InfoCard icon={<Calendar className="h-5 w-5" />} title="Schedule" items={[
                { label: "Weekly Schedule", value: profile.weeklySchedule }
              ]} />

              {/* Additional info for students */}
              {sheetName === "Students" && (
                <InfoCard icon={<Users className="h-5 w-5" />} title="Family" items={[
                  { label: "Parent One", value: profile.parentOne || 'N/A' },
                  { label: "Parent Two", value: profile.parentTwo || 'N/A' }
                ]} />
              )}
            </div>
            
            <div className="border-t pt-6 flex justify-between space-x-4">
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Profile
              </Button>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button 
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={() => {
                    onClose();
                    window.location.href = `/${sheetName.toLowerCase()}/edit?email=${profile.email}`;
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {displayName}'s profile
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}