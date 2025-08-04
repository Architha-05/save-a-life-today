
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string;
}

export const ProtectedRoute = ({ children, requiredUserType }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      toast({
        title: "Access Denied",
        description: "Please login to access this page",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (requiredUserType) {
      const user = JSON.parse(userData);
      if (user.userType !== requiredUserType) {
        toast({
          title: "Access Denied",
          description: `This page is only accessible to ${requiredUserType}s`,
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
    }
  }, [navigate, toast, requiredUserType]);

  return <>{children}</>;
};
