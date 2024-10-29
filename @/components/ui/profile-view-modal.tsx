import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Mail, Phone, MapPin, Calendar } from "lucide-react";

export function ProfileViewModal({ isOpen, onClose, profile, onUpdate, sheetName }) {
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </span>
            <Badge variant="outline" className="bg-primary-50 text-primary-700">
              {sheetName}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <InfoCard icon={<Mail />} title="Contact" items={[
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone }
            ]} />
            
            <InfoCard icon={<MapPin />} title="Location" items={[
              { label: "School", value: profile.school }
            ]} />
            
            <InfoCard icon={<Calendar />} title="Schedule" items={[
              { label: "Availability", value: profile.availability }
            ]} />
          </div>
          
          <div className="border-t pt-6 flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              className="bg-primary-600 hover:bg-primary-700 text-white"
              onClick={() => {/* handle edit */}}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 