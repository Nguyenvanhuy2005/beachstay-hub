
import React from 'react';
import { useNavigate, Navigate, Routes, Route } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminDashboardPage from './AdminDashboardPage';
import AdminLoginPage from './AdminLoginPage';
import { toast } from 'sonner';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
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
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        console.log('Session data:', data);
        const isLoggedIn = !!data.session?.user;
        setIsAuthenticated(isLoggedIn);
        
        if (isLoggedIn) {
          // Check if user is an admin
          const userEmail = data.session?.user.email;
          console.log('User email:', userEmail);
          
          if (userEmail) {
            try {
              if (userEmail === 'admin@annamvillage.vn') {
                console.log('Default admin email detected');
                setIsAdmin(true);
                setIsLoading(false);
                return;
              }
              
              const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', userEmail)
                .maybeSingle();
                
              if (adminError) {
                console.error('Admin check error:', adminError);
                setIsAdmin(false);
                toast.error('Lỗi kiểm tra quyền quản trị');
              } else if (adminData) {
                console.log('Admin verified:', adminData);
                setIsAdmin(true);
              } else {
                console.log('User is not an admin');
                setIsAdmin(false);
                toast.error('Tài khoản không có quyền quản trị');
                await supabase.auth.signOut();
                navigate('/admin/login');
              }
            } catch (error) {
              console.error('Error checking admin status:', error);
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      const isLoggedIn = !!session?.user;
      setIsAuthenticated(isLoggedIn);
      
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        navigate('/admin/login');
      } else if (event === 'SIGNED_IN' && isLoggedIn) {
        // Check if user is an admin when they sign in
        const userEmail = session?.user.email;
        if (userEmail) {
          if (userEmail === 'admin@annamvillage.vn') {
            setIsAdmin(true);
            return;
          }
          
          supabase
            .from('admin_users')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle()
            .then(({ data, error }) => {
              if (error) {
                console.error('Admin check error after sign in:', error);
                setIsAdmin(false);
                toast.error('Lỗi kiểm tra quyền quản trị');
                supabase.auth.signOut();
                navigate('/admin/login');
              } else if (data) {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
                toast.error('Tài khoản không có quyền quản trị');
                supabase.auth.signOut();
                navigate('/admin/login');
              }
            });
        } else {
          setIsAdmin(false);
          supabase.auth.signOut();
          navigate('/admin/login');
        }
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beach-700"></div>
      </div>
    );
  }

  // Updated routing to handle auth and admin status properly
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route 
        path="/*" 
        element={
          isAuthenticated && isAdmin ? (
            <AdminDashboardPage />
          ) : (
            <Navigate to="/admin/login" />
          )
        } 
      />
    </Routes>
  );
};

export default AdminPage;
