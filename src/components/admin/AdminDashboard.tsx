
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import RoomManagement from './RoomManagement';  // Fixed import name
import BookingsManagement from './BookingsManagement';
import PricingManagement from './PricingManagement';
import ContentManagement from './ContentManagement';
import GalleryManagement from './GalleryManagement';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const session = await supabase.auth.getSession();
        
        if (!session.data?.session?.user) {
          // No session, redirect to login
          navigate('/admin');
          return;
        }
        
        const userEmail = session.data.session.user.email;
        
        if (userEmail) {
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle();

          if (error) {
            console.error('Error fetching admin data:', error);
            setIsAdmin(false);
            navigate('/admin');
          } else if (adminData) {
            setIsAdmin(true);
          } else {
            // User is logged in but not an admin
            toast.error(language === 'vi' ? 'Tài khoản không có quyền quản trị' : 'Account does not have admin privileges');
            await supabase.auth.signOut();
            navigate('/admin');
          }
        } else {
          setIsAdmin(false);
          navigate('/admin');
        }
      } catch (error) {
        console.error('Session check error:', error);
        setIsAdmin(false);
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate, language]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign-out error:', error);
        toast.error(language === 'vi' ? 'Đăng xuất thất bại' : 'Sign-out failed');
      } else {
        console.log('Sign-out successful');
        toast.success(language === 'vi' ? 'Đăng xuất thành công' : 'Sign-out successful');
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Unexpected error during sign-out:', error);
      toast.error(language === 'vi' ? `Lỗi: ${error.message}` : `Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beach-700 mx-auto"></div>
        <p className="mt-4">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
      </div>
    );
  }

  if (!isAdmin) {
    navigate('/admin');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {language === 'vi' ? 'Chào mừng đến trang quản trị' : 'Welcome to Admin Dashboard'}
        </h1>
        <Button onClick={handleSignOut} variant="outline" className="gap-2">
          <span>{language === 'vi' ? 'Đăng xuất' : 'Sign Out'}</span>
        </Button>
      </div>
      
      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          <TabsTrigger value="rooms">
            {language === 'vi' ? 'Quản lý phòng' : 'Room Management'}
          </TabsTrigger>
          <TabsTrigger value="bookings">
            {language === 'vi' ? 'Đặt phòng' : 'Bookings'}
          </TabsTrigger>
          <TabsTrigger value="pricing">
            {language === 'vi' ? 'Giá phòng' : 'Pricing'}
          </TabsTrigger>
          <TabsTrigger value="content">
            {language === 'vi' ? 'Nội dung' : 'Content'}
          </TabsTrigger>
          <TabsTrigger value="gallery">
            {language === 'vi' ? 'Thư viện ảnh' : 'Gallery'}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {language === 'vi' ? 'Cài đặt' : 'Settings'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms" className="mt-6">
          <RoomManagement />
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <BookingsManagement />
        </TabsContent>
        
        <TabsContent value="pricing" className="mt-6">
          <PricingManagement />
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <ContentManagement />
        </TabsContent>
        
        <TabsContent value="gallery" className="mt-6">
          <GalleryManagement />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'vi' ? 'Cài đặt hệ thống' : 'System Settings'}
              </CardTitle>
              <CardDescription>
                {language === 'vi' 
                  ? 'Quản lý cài đặt chung của hệ thống' 
                  : 'Manage general system settings'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'vi' 
                  ? 'Tính năng này sẽ được phát triển trong tương lai.' 
                  : 'This feature will be developed in the future.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
