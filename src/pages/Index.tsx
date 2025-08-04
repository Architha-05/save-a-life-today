import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Shield, Building2 } from 'lucide-react';
import heroImage from '@/assets/blood-donation-hero.jpg';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const dashboardRoutes = {
        donor: '/donor-dashboard',
        recipient: '/recipient-dashboard',
        hospital: '/hospital-dashboard',
        bloodbank: '/bloodbank-dashboard'
      };
      navigate(dashboardRoutes[user.userType as keyof typeof dashboardRoutes] || '/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Blood Donation Heroes" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="h-12 w-12 text-white" />
            <h1 className="text-5xl md:text-7xl font-bold">Save A Life Today</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Easy Blood Donations, Lasting Impact
          </p>
          <p className="text-lg mb-12 opacity-75">
            Connecting donors, recipients, hospitals, and blood banks through technology
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/register')}
              className="text-lg px-8 py-6"
            >
              Join Our Community
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Who Can Join?</h2>
            <p className="text-xl text-muted-foreground">
              Our platform serves all stakeholders in the blood donation ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/register')}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Blood Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Register as a donor, find nearby donation centers, and respond to emergency requests
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/register')}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emergency/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-emergency" />
                </div>
                <CardTitle>Blood Recipients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Request blood, find compatible donors, and get connected with nearby blood banks
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/register')}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Hospitals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage blood inventory, request donations, and coordinate with blood banks
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/register')}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-success" />
                </div>
                <CardTitle>Blood Banks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor inventory, track temperature, manage donor appointments and hospital requests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Making a Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1 Unit</div>
              <p className="text-muted-foreground">Can save up to 3 lives</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-emergency mb-2">Every 2 Seconds</div>
              <p className="text-muted-foreground">Someone needs blood</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">38%</div>
              <p className="text-muted-foreground">Of population can donate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
