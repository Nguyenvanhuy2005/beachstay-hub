
import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminDashboardPage from './AdminDashboardPage';
import { toast } from 'sonner';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        console.log('Session data:', data);
        const isLoggedIn = !!data.session?.user;
        setIsAuthenticated(isLoggedIn);
        
        if (!isLoggedIn) {
          toast.error('Vui lòng đăng nhập để truy cập trang quản trị');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      const isLoggedIn = !!session?.user;
      setIsAuthenticated(isLoggedIn);
      
      if (!isLoggedIn) {
        navigate('/admin/login');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beach-700"></div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboardPage /> : null;
};

export default AdminPage;
