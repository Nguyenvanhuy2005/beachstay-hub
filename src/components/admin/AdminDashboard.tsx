
import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import RoomManagement from './RoomManagement';
import BookingsManagement from './BookingsManagement';
import ContentManagement from './ContentManagement';
import GalleryManagement from './GalleryManagement';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        if (!sessionData?.session?.user) {
          console.log('No session found');
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        const userEmail = sessionData.session.user.email;
        console.log('User email:', userEmail);
        
        if (userEmail) {
          if (userEmail === 'admin@annamvillage.vn') {
            console.log('Default admin email detected');
            setIsAdmin(true);
            setLoading(false);
            return;
          }
          
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle();

          if (error) {
            console.error('Error fetching admin data:', error);
            setIsAdmin(false);
          } else if (adminData) {
            console.log('Admin data found:', adminData);
            setIsAdmin(true);
          } else {
            console.log('User is not an admin');
            toast.error('Tài khoản không có quyền quản trị');
            await supabase.auth.signOut();
            setIsAdmin(false);
          }
        } else {
          console.log('No user email found');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setIsAdmin(false);
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
        navigate('/admin');
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Chào mừng đến trang quản trị
        </h1>
        <Button onClick={handleSignOut} variant="outline" className="gap-2">
          <span>Đăng xuất</span>
        </Button>
      </div>
      
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="rooms">
            Quản lý phòng
          </TabsTrigger>
          <TabsTrigger value="bookings">
            Đặt phòng
          </TabsTrigger>
          <TabsTrigger value="content">
            Nội dung
          </TabsTrigger>
          <TabsTrigger value="gallery">
            Thư viện ảnh
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms" className="mt-6">
          <RoomManagement />
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <BookingsManagement />
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <ContentManagement />
        </TabsContent>
        
        <TabsContent value="gallery" className="mt-6">
          <GalleryManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
