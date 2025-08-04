
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, AlertTriangle } from 'lucide-react';

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
}

export const RequestDetailsModal = ({ isOpen, onClose, request }: RequestDetailsModalProps) => {
  if (!request) return null;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'destructive';
      case 'Urgent': return 'emergency';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Blood Request Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Blood Type</p>
              <p className="text-2xl font-bold text-primary">{request.bloodType}</p>
            </div>
            <div>
              <p className="font-semibold">Units Needed</p>
              <p className="text-2xl font-bold">{request.unitsNeeded}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold mb-2">Urgency Level</p>
            <Badge variant={getUrgencyColor(request.urgency)} className="text-sm">
              <AlertTriangle className="mr-1 h-4 w-4" />
              {request.urgency}
            </Badge>
          </div>

          {request.hospital && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{request.hospital}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Posted: {request.timePosted}</span>
          </div>

          {request.matchedDonors && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{request.matchedDonors} potential donors found</span>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="font-semibold mb-2">Status</p>
            <Badge variant="outline">{request.status}</Badge>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="medical" className="flex-1">
              Contact Requester
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
