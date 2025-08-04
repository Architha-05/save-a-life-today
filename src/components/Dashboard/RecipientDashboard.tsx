import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Search, 
  MapPin, 
  Phone, 
  Clock,
  AlertTriangle,
  Users,
  Plus,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FindDonorsModal } from '@/components/Modals/FindDonorsModal';
import { RequestDetailsModal } from '@/components/Modals/RequestDetailsModal';
import { useDataManager } from '@/hooks/useDataManager';
import { useNotifications } from '@/hooks/useNotifications';

export const RecipientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showFindDonors, setShowFindDonors] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requestForm, setRequestForm] = useState({
    bloodType: '',
    unitsNeeded: '',
    urgency: '',
    hospitalName: '',
    description: ''
  });

  const { bloodRequests, createBloodRequest } = useDataManager();
  const { notifications, getUnreadCount } = useNotifications();
  const { toast } = useToast();

  // Get user's active requests
  const userRequests = bloodRequests.filter(request => 
    request.requesterId === user?.id && request.status === 'Active'
  );

  const [nearbyDonors] = useState([
    { 
      id: 1, 
      name: 'John D.', 
      bloodType: 'O-', 
      distance: '2.1 km',
      lastDonation: '3 months ago',
      totalDonations: 5,
      availability: 'Available',
      phone: '+1234567890'
    },
    { 
      id: 2, 
      name: 'Sarah M.', 
      bloodType: 'O-', 
      distance: '4.8 km',
      lastDonation: '2 months ago',
      totalDonations: 8,
      availability: 'Available'
    },
    { 
      id: 3, 
      name: 'Mike R.', 
      bloodType: 'O+', 
      distance: '6.2 km',
      lastDonation: '1 month ago',
      totalDonations: 12,
      availability: 'Available'
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestForm.bloodType || !requestForm.unitsNeeded || !requestForm.urgency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createBloodRequest({
      requesterId: user.id,
      requesterName: user.name,
      requesterType: 'recipient',
      bloodType: requestForm.bloodType,
      unitsNeeded: parseInt(requestForm.unitsNeeded),
      urgency: requestForm.urgency as 'Critical' | 'Urgent' | 'Normal',
      hospitalName: requestForm.hospitalName,
      description: requestForm.description,
      location: requestForm.hospitalName
    });

    toast({
      title: "Request Submitted",
      description: "Your blood request has been sent to nearby donors, hospitals, and blood banks",
    });
    
    setShowRequestForm(false);
    setRequestForm({
      bloodType: '',
      unitsNeeded: '',
      urgency: '',
      hospitalName: '',
      description: ''
    });
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleContact = (phone: string, name: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleGetDirections = (location: string) => {
    const query = encodeURIComponent(location);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'destructive';
      case 'Urgent': return 'emergency';
      default: return 'secondary';
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout title={`Welcome, ${user.name}`} userType="recipient">
      <div className="space-y-6">
        {getUnreadCount() > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <span className="font-medium">You have {getUnreadCount()} new notifications</span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowRequestForm(true)}>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-emergency/10 rounded-lg flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-emergency" />
              </div>
              <h3 className="font-semibold mb-2">Request Blood</h3>
              <p className="text-sm text-muted-foreground">Create an emergency blood request</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowFindDonors(true)}>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Find Donors</h3>
              <p className="text-sm text-muted-foreground">Search for compatible donors nearby</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowFindDonors(true)}>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Blood Banks</h3>
              <p className="text-sm text-muted-foreground">Locate nearby blood banks</p>
            </CardContent>
          </Card>
        </div>

        {/* Request Form Modal */}
        {showRequestForm && (
          <Card className="border-2 border-emergency">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emergency">
                <AlertTriangle className="h-5 w-5" />
                Emergency Blood Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodType">Blood Type *</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={requestForm.bloodType}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, bloodType: e.target.value }))}
                    >
                      <option value="">Select blood type</option>
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

                  <div>
                    <Label htmlFor="unitsNeeded">Units Needed *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={requestForm.unitsNeeded}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, unitsNeeded: e.target.value }))}
                      placeholder="Number of units"
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={requestForm.urgency}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, urgency: e.target.value }))}
                    >
                      <option value="">Select urgency</option>
                      <option value="Critical">Critical (0-2 hours)</option>
                      <option value="Urgent">Urgent (2-12 hours)</option>
                      <option value="Normal">Normal (12-24 hours)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input
                      value={requestForm.hospitalName}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, hospitalName: e.target.value }))}
                      placeholder="Hospital or medical facility"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Additional Information</Label>
                  <Textarea
                    value={requestForm.description}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Any additional details about the request"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" variant="emergency" className="flex-1">
                    Submit Request
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-emergency" />
                Active Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active requests</p>
              ) : (
                <div className="space-y-4">
                  {userRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getUrgencyColor(request.urgency)}>
                            {request.urgency}
                          </Badge>
                          <span className="font-semibold text-lg">{request.bloodType}</span>
                        </div>
                        <Badge variant="outline">{request.unitsNeeded} units</Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {request.hospitalName || 'Hospital'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(request.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewDetails(request)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nearby Donors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Compatible Donors Nearby
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nearbyDonors.map((donor) => (
                  <div key={donor.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{donor.name}</p>
                        <p className="text-sm text-muted-foreground">{donor.bloodType} • {donor.distance}</p>
                      </div>
                      <Badge variant="success">{donor.availability}</Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Last donation: {donor.lastDonation}</p>
                      <p>Total donations: {donor.totalDonations}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="medical" 
                        className="flex-1"
                        onClick={() => handleContact(donor.phone, donor.name)}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGetDirections(donor.distance)}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Location
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FindDonorsModal
        isOpen={showFindDonors}
        onClose={() => setShowFindDonors(false)}
        requiredBloodType={user.bloodType}
      />

      <RequestDetailsModal
        isOpen={showRequestDetails}
        onClose={() => setShowRequestDetails(false)}
        request={selectedRequest}
      />
    </DashboardLayout>
  );
};
