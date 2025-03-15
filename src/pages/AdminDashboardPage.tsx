
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { supabase, isAdmin } from '@/lib/supabase';
import { toast } from 'sonner';

const AdminDashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status when component mounts
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const { data } = await supabase.auth.getSession();
        const authenticated = !!data.session;
        console.log('Is authenticated:', authenticated);
        setIsAuthenticated(authenticated);
        
        if (authenticated && data.session?.user?.email) {
          console.log('Checking if user is admin:', data.session.user.email);
          const adminCheck = await isAdmin(data.session.user.email);
          console.log('Is admin:', adminCheck);
          
          if (adminCheck) {
            setIsAuthorized(true);
          } else {
            // User authenticated but not an admin
            toast.error('Bạn không có quyền truy cập trang quản trị');
            await supabase.auth.signOut();
            navigate('/admin');
          }
        } else {
          // Not authenticated
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setIsAuthorized(false);
        navigate('/admin');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Đã đăng xuất');
    navigate('/admin');
  };

  if (isAuthenticated === null) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 text-center">
          <p>Đang tải...</p>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated || !isAuthorized) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 text-center">
          <p>Bạn không có quyền truy cập trang này</p>
          <Button onClick={() => navigate('/admin')} className="mt-4">
            Quay lại trang đăng nhập
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-beach-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-beach-900">Trang Quản Trị</h1>
            <Button variant="outline" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
          <AdminDashboard />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
