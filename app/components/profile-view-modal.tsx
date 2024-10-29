import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "@remix-run/react";
import { Pencil, Trash2, X } from "lucide-react"; // Import Lucide icons

interface ProfileViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: () => void;
  sheetName: string;
}

export function ProfileViewModal({
  isOpen,
  onClose,
  profile,
  onUpdate,
  sheetName,
}: ProfileViewModalProps) {
  const navigate = useNavigate();

  if (!profile) return null;

  const handleEdit = () => {
    navigate(`/${sheetName.toLowerCase()}/edit/${profile.email}`);
  };

  const handleDelete = async () => {
    // ... existing delete logic ...
  };

  // Helper function to format field names
  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            <span>
              {sheetName === "Students" 
                ? profile.studentName 
                : `${profile.firstName} ${profile.lastName}`}
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="mt-4 max-h-[50vh] pr-4">
          <div className="space-y-4">
            {Object.entries(profile).map(([key, value]) => (
              // Skip rendering if value is null/undefined/empty
              value ? (
                <div key={key} className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-muted-foreground">
                    {formatFieldName(key)}
                  </div>
                  <div className="col-span-2">
                    {typeof value === 'string' && value.includes('\n') ? (
                      <pre className="whitespace-pre-wrap font-sans">{value}</pre>
                    ) : (
                      String(value)
                    )}
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6 flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 