
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/supabase';
import RoomManagement from './RoomManagement';
import BookingsManagement from './BookingsManagement';
import ContentManagement from './ContentManagement';
import ConsultationManagement from './ConsultationManagement';

import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // First check if we have a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData?.session?.user) {
          console.log('No active session found');
          setIsAdminUser(false);
          setLoading(false);
          navigate('/admin/login');
          return;
        }
        
        // Then check if the user is an admin
        const adminStatus = await isAdmin();
        console.log('Admin status check result:', adminStatus);
        
        if (adminStatus) {
          setIsAdminUser(true);
        } else {
          console.log('User is not an admin');
          toast.error('Tài khoản không có quyền quản trị');
          await supabase.auth.signOut();
          setIsAdminUser(false);
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdminUser(false);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign-out error:', error);
        toast.error('Đăng xuất thất bại');
      } else {
        console.log('Sign-out successful');
        toast.success('Đăng xuất thành công');
        navigate('/admin/login');
      }
    } catch (error: any) {
      console.error('Unexpected error during sign-out:', error);
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beach-700 mx-auto"></div>
        <p className="mt-4">Đang tải...</p>
      </div>
    );
  }

  if (!isAdminUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Chào mừng đến trang quản trị
        </h1>
        <Button onClick={handleSignOut} variant="outline" className="gap-2">
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </Button>
      </div>
      
      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="rooms">
            Quản lý phòng
          </TabsTrigger>
          <TabsTrigger value="bookings">
            Đặt phòng
          </TabsTrigger>
          <TabsTrigger value="consultations">
            Tư vấn
          </TabsTrigger>
          <TabsTrigger value="content">
            Nội dung
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms" className="mt-6">
          <RoomManagement />
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <BookingsManagement />
        </TabsContent>
        
        <TabsContent value="consultations" className="mt-6">
          <ConsultationManagement />
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <ContentManagement />
        </TabsContent>
        
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
