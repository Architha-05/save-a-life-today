import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  TrendingUp, 
  Users, 
  Truck,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Plus,
  Thermometer,
  Bell
} from 'lucide-react';
import { useDataManager } from '@/hooks/useDataManager';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

export const BloodBankDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const { bloodRequests, appointments, updateRequestStatus, updateAppointmentStatus } = useDataManager();
  const { notifications, getUnreadCount } = useNotifications();
  const { toast } = useToast();
  
  // Filter requests and appointments relevant to blood bank
  const bloodBankRequests = bloodRequests.filter(request => request.status === 'Active');
  const bloodBankAppointments = appointments.filter(apt => 
    apt.bloodBankName || apt.bloodBankId
  );

  const [inventory] = useState([
    { bloodType: 'A+', units: 45, expiring: 5, temperature: 4.2, lastUpdated: '2 min ago' },
    { bloodType: 'A-', units: 23, expiring: 2, temperature: 4.1, lastUpdated: '2 min ago' },
    { bloodType: 'B+', units: 38, expiring: 8, temperature: 4.3, lastUpdated: '2 min ago' },
    { bloodType: 'B-', units: 15, expiring: 1, temperature: 4.0, lastUpdated: '2 min ago' },
    { bloodType: 'AB+', units: 28, expiring: 3, temperature: 4.2, lastUpdated: '2 min ago' },
    { bloodType: 'AB-', units: 12, expiring: 1, temperature: 4.1, lastUpdated: '2 min ago' },
    { bloodType: 'O+', units: 52, expiring: 6, temperature: 4.2, lastUpdated: '2 min ago' },
    { bloodType: 'O-', units: 31, expiring: 4, temperature: 4.0, lastUpdated: '2 min ago' }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleProcessRequest = (request: any) => {
    updateRequestStatus(request.id, 'Fulfilled');
    toast({
      title: "Request Processed",
      description: `Blood request for ${request.bloodType} has been processed and dispatched`,
    });
  };

  const handleStartCollection = (appointment: any) => {
    updateAppointmentStatus(appointment.id, 'Completed');
    toast({
      title: "Collection Started",
      description: `Blood collection from ${appointment.donorName} has been initiated`,
    });
  };

  const handleCall = (phone: string, name: string) => {
    window.open(`tel:${phone || '+1234567890'}`, '_self');
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 2 || temp > 6) return 'critical';
    if (temp < 3 || temp > 5) return 'warning';
    return 'normal';
  };

  const getTemperatureColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'emergency';
      default: return 'success';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'destructive';
      case 'Urgent': return 'emergency';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'secondary';
      case 'Ready for Pickup': return 'success';
      case 'Active': return 'emergency';
      case 'Scheduled': return 'success';
      default: return 'outline';
    }
  };

  if (!user) return null;

  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
  const totalExpiring = inventory.reduce((sum, item) => sum + item.expiring, 0);

  return (
    <DashboardLayout title={`Welcome, ${user.name}`} userType="bloodbank">
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
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Inventory</p>
                  <p className="text-2xl font-bold">{totalUnits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emergency/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-emergency" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold">{totalExpiring}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Truck className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Deliveries</p>
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
                  <p className="text-sm text-muted-foreground">Today's Donors</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blood Inventory with Temperature Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Blood Inventory & Temperature Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventory.map((item) => (
                <div key={item.bloodType} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{item.bloodType}</span>
                    <Badge variant={getTemperatureColor(getTemperatureStatus(item.temperature))}>
                      <Thermometer className="h-3 w-3 mr-1" />
                      {item.temperature}°C
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Available: {item.units} units</span>
                      <span className="text-emergency">Expiring: {item.expiring}</span>
                    </div>
                    <Progress value={(item.units / 60) * 100} className="h-2" />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last updated: {item.lastUpdated}
                  </div>

                  {item.expiring > 0 && (
                    <Button size="sm" variant="emergency" className="w-full">
                      <AlertTriangle className="mr-2 h-3 w-3" />
                      {item.expiring} Expiring Soon
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hospital Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Blood Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bloodBankRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{request.requesterName}</p>
                        <p className="text-sm text-muted-foreground">{request.hospitalName || 'Hospital'}</p>
                      </div>
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-lg">{request.bloodType}</span>
                      <span>{request.unitsNeeded} units</span>
                      <Badge variant={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Requested: {new Date(request.createdAt).toLocaleString()}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="medical" 
                        className="flex-1"
                        onClick={() => handleProcessRequest(request)}
                      >
                        Process Request
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCall('+1234567890', request.requesterName)}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donor Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Today's Donor Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bloodBankAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{appointment.donorName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.bloodType}</p>
                      </div>
                      <Badge variant={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>{appointment.scheduledDate} at {appointment.scheduledTime}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="medical" 
                        className="flex-1"
                        onClick={() => handleStartCollection(appointment)}
                        disabled={appointment.status === 'Completed'}
                      >
                        {appointment.status === 'Completed' ? 'Completed' : 'Start Collection'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCall('+1234567890', appointment.donorName)}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
