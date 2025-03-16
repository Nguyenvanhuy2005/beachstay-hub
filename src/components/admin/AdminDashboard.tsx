
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import RoomManagement from './RoomManagement';
import BookingsManagement from './BookingsManagement';
import PricingManagement from './PricingManagement';
import ContentManagement from './ContentManagement';
import GalleryManagement from './GalleryManagement';
import { toast } from 'sonner';
import { Settings, Lock, Users, Database, Globe, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
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
          // Chấp nhận email mặc định (admin@annamvillage.vn) làm quản trị viên
          if (userEmail === 'admin@annamvillage.vn') {
            console.log('Default admin email detected');
            setIsAdmin(true);
            setLoading(false);
            return;
          }
          
          // Kiểm tra nếu email tồn tại trong bảng admin_users
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
            toast.error(language === 'vi' ? 'Tài khoản không có quyền quản trị' : 'Account does not have admin privileges');
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
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
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {language === 'vi' ? 'Email thông báo' : 'Notification Email'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'vi' 
                          ? 'Email nhận thông báo đặt phòng và liên hệ' 
                          : 'Email to receive booking and contact notifications'}
                      </p>
                    </div>
                    <div className="w-[280px]">
                      <Input 
                        type="email" 
                        placeholder="admin@annamvillage.vn" 
                        value="admin@annamvillage.vn" 
                        className="w-full"
                      />
                    </div>
                  </div>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {language === 'vi' ? 'Ngôn ngữ mặc định' : 'Default Language'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'vi' 
                          ? 'Ngôn ngữ mặc định khi khách truy cập website' 
                          : 'Default language when visitors access the website'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="vietnamese" className="cursor-pointer">Tiếng Việt</Label>
                      <Switch id="vietnamese" checked={true} />
                      <Label htmlFor="english" className="cursor-pointer ml-4">English</Label>
                      <Switch id="english" checked={false} />
                    </div>
                  </div>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {language === 'vi' ? 'Chế độ bảo trì' : 'Maintenance Mode'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'vi' 
                          ? 'Bật/tắt chế độ bảo trì cho website' 
                          : 'Enable/disable maintenance mode for the website'}
                      </p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>
                </div>
                
                <Button className="w-full sm:w-auto mt-6">
                  <Save className="mr-2 h-4 w-4" />
                  {language === 'vi' ? 'Lưu cài đặt' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    {language === 'vi' ? 'Bảo mật' : 'Security'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {language === 'vi' ? 'Quản trị viên' : 'Administrators'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {language === 'vi' ? 'Quản lý quản trị viên' : 'Manage Administrators'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    {language === 'vi' ? 'Dữ liệu' : 'Data'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    {language === 'vi' ? 'Sao lưu dữ liệu' : 'Backup Data'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {language === 'vi' ? 'Khôi phục dữ liệu' : 'Restore Data'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
