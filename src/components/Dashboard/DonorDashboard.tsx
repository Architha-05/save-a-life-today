
import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Calendar, 
  Award, 
  MapPin, 
  Phone, 
  Clock,
  Users,
  Droplets,
  Bell
} from 'lucide-react';
import { ScheduleDonationModal } from '@/components/Modals/ScheduleDonationModal';
import { useDataManager } from '@/hooks/useDataManager';
import { useNotifications } from '@/hooks/useNotifications';

export const DonorDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const { bloodRequests } = useDataManager();
  const { notifications, getUnreadCount } = useNotifications();

  const [donationHistory] = useState([
    { id: 1, date: '2024-01-15', location: 'City Hospital', status: 'Completed' },
    { id: 2, date: '2023-11-10', location: 'Blood Bank Center', status: 'Completed' },
    { id: 3, date: '2023-08-22', location: 'Community Drive', status: 'Completed' }
  ]);

  // Filter blood requests that match donor's blood type or universal donors
  const relevantRequests = bloodRequests.filter(request => 
    request.status === 'Active' && (
      request.bloodType === user?.bloodType || 
      user?.bloodType === 'O-' || 
      (user?.bloodType === 'O+' && ['A+', 'B+', 'AB+', 'O+'].includes(request.bloodType))
    )
  ).slice(0, 3);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const calculateNextDonationDate = () => {
    const lastDonation = new Date('2024-01-15');
    const nextDonation = new Date(lastDonation);
    nextDonation.setDate(lastDonation.getDate() + 56);
    return nextDonation.toLocaleDateString();
  };

  const getDaysUntilEligible = () => {
    const lastDonation = new Date('2024-01-15');
    const today = new Date();
    const nextEligible = new Date(lastDonation);
    nextEligible.setDate(lastDonation.getDate() + 56);
    
    const diffTime = nextEligible.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'destructive';
      case 'Urgent': return 'emergency';
      default: return 'secondary';
    }
  };

  const handleContact = (phone: string) => {
    window.open(`tel:${phone || '+1234567890'}`, '_self');
  };

  const handleGetDirections = (location: string) => {
    const query = encodeURIComponent(location);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  };

  if (!user) return null;

  const daysUntilEligible = getDaysUntilEligible();
  const eligibilityProgress = Math.max(0, 100 - (daysUntilEligible / 56) * 100);

  return (
    <DashboardLayout title={`Welcome, ${user.name}`} userType="donor">
      <div className="space-y-6">
        {getUnreadCount() > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <span className="font-medium">You have {getUnreadCount()} new notifications</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Donations</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lives Saved</p>
                  <p className="text-2xl font-bold">9</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Droplets className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="text-2xl font-bold">{user.bloodType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emergency/10 rounded-lg">
                  <Award className="h-6 w-6 text-emergency" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Donor Level</p>
                  <p className="text-2xl font-bold">Silver</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donation Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Donation Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Next eligible donation date: {calculateNextDonationDate()}</span>
                <Badge variant={daysUntilEligible === 0 ? "success" : "secondary"}>
                  {daysUntilEligible === 0 ? "Eligible Now" : `${daysUntilEligible} days remaining`}
                </Badge>
              </div>
              <Progress value={eligibilityProgress} className="h-2" />
              <Button 
                variant="medical" 
                className="w-full"
                onClick={() => setShowScheduleModal(true)}
                disabled={daysUntilEligible > 0}
              >
                <Heart className="mr-2 h-4 w-4" />
                Schedule Donation
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emergency">
                <Bell className="h-5 w-5" />
                Emergency Blood Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relevantRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No emergency requests matching your blood type</p>
                ) : (
                  relevantRequests.map((request) => (
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
                          {request.hospitalName || 'Hospital Location'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(request.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="emergency" 
                          className="flex-1"
                          onClick={() => handleContact('+1234567890')}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleGetDirections(request.hospitalName || 'Hospital')}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Donation History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Donation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donationHistory.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{donation.location}</p>
                      <p className="text-sm text-muted-foreground">{donation.date}</p>
                    </div>
                    <Badge variant="success">{donation.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ScheduleDonationModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        donorName={user.name}
        donorBloodType={user.bloodType}
      />
    </DashboardLayout>
  );
};
