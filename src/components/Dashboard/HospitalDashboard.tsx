import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  Droplets, 
  TrendingUp,
  AlertTriangle,
  Calendar,
  Phone,
  MapPin,
  Plus,
  Bell
} from 'lucide-react';
import { useDataManager } from '@/hooks/useDataManager';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

export const HospitalDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    bloodType: '',
    unitsNeeded: '',
    urgency: '',
    department: '',
    patientId: ''
  });
  
  const { bloodRequests, appointments, createBloodRequest, updateRequestStatus } = useDataManager();
  const { notifications, getUnreadCount } = useNotifications();
  const { toast } = useToast();

  // Filter requests relevant to this hospital
  const hospitalRequests = bloodRequests.filter(request => 
    request.hospitalName?.toLowerCase().includes('hospital') || request.requesterType === 'hospital'
  );

  // Filter appointments for this hospital
  const hospitalAppointments = appointments.filter(apt => 
    apt.hospitalName || apt.hospitalId
  );

  const [bloodInventory] = useState([
    { bloodType: 'A+', current: 15, minimum: 10, status: 'adequate' },
    { bloodType: 'A-', current: 4, minimum: 8, status: 'low' },
    { bloodType: 'B+', current: 12, minimum: 10, status: 'adequate' },
    { bloodType: 'B-', current: 2, minimum: 6, status: 'critical' },
    { bloodType: 'AB+', current: 8, minimum: 5, status: 'adequate' },
    { bloodType: 'AB-', current: 3, minimum: 4, status: 'low' },
    { bloodType: 'O+', current: 18, minimum: 15, status: 'adequate' },
    { bloodType: 'O-', current: 6, minimum: 12, status: 'low' }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleRequestBlood = (bloodType: string) => {
    setRequestForm(prev => ({ ...prev, bloodType }));
    setShowRequestForm(true);
  };

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
      requesterType: 'hospital',
      bloodType: requestForm.bloodType,
      unitsNeeded: parseInt(requestForm.unitsNeeded),
      urgency: requestForm.urgency as 'Critical' | 'Urgent' | 'Normal',
      hospitalName: user.name,
      description: `Patient: ${requestForm.patientId}, Department: ${requestForm.department}`,
      location: user.name
    });

    toast({
      title: "Blood Request Submitted",
      description: "Request sent to donors and blood banks",
    });
    
    setShowRequestForm(false);
    setRequestForm({
      bloodType: '',
      unitsNeeded: '',
      urgency: '',
      department: '',
      patientId: ''
    });
  };

  const handleProcessRequest = (request: any) => {
    updateRequestStatus(request.id, 'Fulfilled');
    toast({
      title: "Request Processed",
      description: "Blood request has been processed",
    });
  };

  const handleCallDonor = (phone: string, name: string) => {
    window.open(`tel:${phone || '+1234567890'}`, '_self');
  };

  const getInventoryStatus = (item: any) => {
    const percentage = (item.current / item.minimum) * 100;
    if (percentage <= 50) return 'critical';
    if (percentage <= 80) return 'low';
    return 'adequate';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'low': return 'emergency';
      case 'adequate': return 'success';
      default: return 'secondary';
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'destructive';
      case 'Urgent': return 'emergency';
      case 'Pending': return 'secondary';
      case 'Approved': return 'success';
      default: return 'outline';
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout title={`Welcome, ${user.name}`} userType="hospital">
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
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Blood Units</p>
                  <p className="text-2xl font-bold">68</p>
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
                  <p className="text-sm text-muted-foreground">Critical Requests</p>
                  <p className="text-2xl font-bold">2</p>
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
                  <p className="text-sm text-muted-foreground">Today's Donations</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patients Served</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blood Request Form */}
        {showRequestForm && (
          <Card className="border-2 border-emergency">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emergency">
                <AlertTriangle className="h-5 w-5" />
                Request Blood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Type *</label>
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
                    <label className="block text-sm font-medium mb-1">Units Needed *</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full p-2 border rounded-md"
                      value={requestForm.unitsNeeded}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, unitsNeeded: e.target.value }))}
                      placeholder="Number of units"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Urgency Level *</label>
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
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      value={requestForm.department}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="Department name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Patient ID</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      value={requestForm.patientId}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, patientId: e.target.value }))}
                      placeholder="Patient identification"
                    />
                  </div>
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

        {/* Blood Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Blood Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bloodInventory.map((item) => (
                <div key={item.bloodType} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{item.bloodType}</span>
                    <Badge variant={getStatusColor(getInventoryStatus(item))}>
                      {getInventoryStatus(item)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {item.current} units</span>
                      <span>Min: {item.minimum} units</span>
                    </div>
                    <Progress 
                      value={(item.current / item.minimum) * 100} 
                      className={`h-2 ${getInventoryStatus(item) === 'critical' ? 'bg-destructive/20' : ''}`} 
                    />
                  </div>
                  {getInventoryStatus(item) !== 'adequate' && (
                    <Button 
                      size="sm" 
                      variant="emergency" 
                      className="w-full"
                      onClick={() => handleRequestBlood(item.bloodType)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Request Blood
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Blood Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Blood Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hospitalRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{request.requesterName}</p>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                      </div>
                      <Badge variant={getRequestStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium text-lg">{request.bloodType}</span>
                      <span>{request.unitsNeeded} units</span>
                      <Badge variant={getRequestStatusColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
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
                        onClick={() => handleCallDonor('+1234567890', request.requesterName)}
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Donation Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hospitalAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{appointment.donorName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.bloodType}</p>
                      </div>
                      <Badge variant={appointment.status === 'Scheduled' ? 'success' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{appointment.scheduledDate}</span>
                      <span>{appointment.scheduledTime}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleCallDonor('+1234567890', appointment.donorName)}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call Donor
                      </Button>
                      <Button size="sm" variant="outline">
                        Reschedule
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
