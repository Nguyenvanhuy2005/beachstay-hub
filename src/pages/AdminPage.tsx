
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboardPage from './AdminDashboardPage';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setIsAuthenticated(false);
          return;
        }
        
        console.log('Session data:', data);
        setIsAuthenticated(!!data.session?.user);
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setIsAuthenticated(!!session?.user);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beach-700"></div>
      </div>
    );
  }

  // If authenticated, show dashboard, otherwise show login
  return isAuthenticated ? <AdminDashboardPage /> : <AdminLoginPage />;
};

export default AdminPage;
