
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Search } from 'lucide-react';

interface FindDonorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredBloodType?: string;
}

const mockDonors = [
  { id: 1, name: 'John Smith', bloodType: 'O-', phone: '+1234567890', location: 'Downtown, 2.1 km', availability: 'Available' },
  { id: 2, name: 'Sarah Johnson', bloodType: 'O-', phone: '+1234567891', location: 'Midtown, 4.8 km', availability: 'Available' },
  { id: 3, name: 'Mike Davis', bloodType: 'A+', phone: '+1234567892', location: 'Uptown, 6.2 km', availability: 'Available' },
  { id: 4, name: 'Emily Wilson', bloodType: 'B+', phone: '+1234567893', location: 'East Side, 3.5 km', availability: 'Available' },
  { id: 5, name: 'David Brown', bloodType: 'AB+', phone: '+1234567894', location: 'West Side, 5.1 km', availability: 'Available' }
];

const mockBloodBanks = [
  { id: 1, name: 'City Blood Bank', location: 'Main Street, 1.2 km', phone: '+1234560000', inventory: { 'O-': 15, 'A+': 20, 'B+': 18 } },
  { id: 2, name: 'Regional Blood Center', location: 'Health District, 2.8 km', phone: '+1234560001', inventory: { 'O-': 8, 'A+': 25, 'B+': 12 } },
  { id: 3, name: 'Community Blood Bank', location: 'Community Center, 4.1 km', phone: '+1234560002', inventory: { 'O-': 12, 'A+': 15, 'B+': 22 } }
];

export const FindDonorsModal = ({ isOpen, onClose, requiredBloodType }: FindDonorsModalProps) => {
  const [searchBloodType, setSearchBloodType] = useState(requiredBloodType || '');
  const [activeTab, setActiveTab] = useState<'donors' | 'bloodbanks'>('donors');

  const filteredDonors = mockDonors.filter(donor => 
    !searchBloodType || donor.bloodType === searchBloodType
  );

  const handleContact = (phone: string, name: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleGetDirections = (location: string) => {
    const query = encodeURIComponent(location);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Blood Donors & Banks</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <select 
              className="flex-1 p-2 border rounded-md"
              value={searchBloodType}
              onChange={(e) => setSearchBloodType(e.target.value)}
            >
              <option value="">All Blood Types</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'donors' ? 'default' : 'outline'}
              onClick={() => setActiveTab('donors')}
              className="flex-1"
            >
              Donors ({filteredDonors.length})
            </Button>
            <Button 
              variant={activeTab === 'bloodbanks' ? 'default' : 'outline'}
              onClick={() => setActiveTab('bloodbanks')}
              className="flex-1"
            >
              Blood Banks ({mockBloodBanks.length})
            </Button>
          </div>

          {activeTab === 'donors' && (
            <div className="space-y-3">
              {filteredDonors.map((donor) => (
                <div key={donor.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-sm text-muted-foreground">{donor.bloodType}</p>
                    </div>
                    <Badge variant="success">{donor.availability}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {donor.location}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="medical" 
                      className="flex-1"
                      onClick={() => handleContact(donor.phone, donor.name)}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call {donor.phone}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGetDirections(donor.location)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bloodbanks' && (
            <div className="space-y-3">
              {mockBloodBanks.map((bank) => (
                <div key={bank.id} className="border rounded-lg p-4 space-y-3">
                  <div>
                    <p className="font-medium">{bank.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {bank.location}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(bank.inventory).map(([type, units]) => (
                      <Badge key={type} variant="outline">
                        {type}: {units} units
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="medical" 
                      className="flex-1"
                      onClick={() => handleContact(bank.phone, bank.name)}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call {bank.phone}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGetDirections(bank.location)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
