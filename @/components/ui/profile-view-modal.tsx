import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Trash2, Edit2 } from 'lucide-react';

export function ProfileViewModal({ isOpen, onClose, profile, onUpdate, sheetName }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!profile) return null;

  const displayName = sheetName === "Staff" 
    ? `${profile.firstName} ${profile.lastName}`
    : profile.studentName;

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append('email', profile.email);

      const response = await fetch(`/${sheetName.toLowerCase()}/delete`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowDeleteDialog(false);
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
          
          {/* ... InfoCard section remains the same ... */}
          
          <div className="border-t pt-6 flex justify-between space-x-4">
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
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
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 