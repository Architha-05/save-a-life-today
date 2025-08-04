
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDataManager } from '@/hooks/useDataManager';
import { useToast } from '@/hooks/use-toast';

interface ScheduleDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorName: string;
  donorBloodType: string;
}

export const ScheduleDonationModal = ({ isOpen, onClose, donorName, donorBloodType }: ScheduleDonationModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: 'hospital',
    hospitalName: '',
    bloodBankName: ''
  });
  const { scheduleAppointment } = useDataManager();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    const locationName = formData.location === 'hospital' ? formData.hospitalName : formData.bloodBankName;
    
    scheduleAppointment({
      donorId: Date.now().toString(),
      donorName,
      bloodType: donorBloodType,
      hospitalId: formData.location === 'hospital' ? '1' : undefined,
      hospitalName: formData.location === 'hospital' ? (formData.hospitalName || 'General Hospital') : undefined,
      bloodBankId: formData.location === 'bloodbank' ? '1' : undefined,
      bloodBankName: formData.location === 'bloodbank' ? (formData.bloodBankName || 'City Blood Bank') : undefined,
      scheduledDate: formData.date,
      scheduledTime: formData.time
    });

    toast({
      title: "Donation Scheduled",
      description: `Your donation has been scheduled for ${formData.date} at ${formData.time}`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Blood Donation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="location">Location Type</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            >
              <option value="hospital">Hospital</option>
              <option value="bloodbank">Blood Bank</option>
            </select>
          </div>

          {formData.location === 'hospital' && (
            <div>
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                value={formData.hospitalName}
                onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
                placeholder="Enter hospital name"
              />
            </div>
          )}

          {formData.location === 'bloodbank' && (
            <div>
              <Label htmlFor="bloodBankName">Blood Bank Name</Label>
              <Input
                id="bloodBankName"
                value={formData.bloodBankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bloodBankName: e.target.value }))}
                placeholder="Enter blood bank name"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" variant="medical" className="flex-1">
              Schedule Donation
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
