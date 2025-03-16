import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import RoomManagement from './RoomManagement';
import BookingsManagement from './BookingsManagement';
import PricingManagement from './PricingManagement';
import ContentManagement from './ContentManagement';
import GalleryManagement from './GalleryManagement';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const session = await supabase.auth.getSession();
      if (session.data?.session?.user?.email) {
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.data.session.user.email)
          .single();

        if (error) {
          console.error('Error fetching admin data:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!adminData);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign-in error:', error);
        alert(language === 'vi' ? 'Đăng nhập thất bại' : 'Sign-in failed');
      } else {
        console.log('Sign-in successful:', data);
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single();

        if (adminError) {
          console.error('Error fetching admin data:', adminError);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!adminData);
        }
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign-out error:', error);
      alert(language === 'vi' ? 'Đăng xuất thất bại' : 'Sign-out failed');
    } else {
      console.log('Sign-out successful');
      setIsAdmin(false);
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {isAdmin ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">
              {language === 'vi' ? 'Chào mừng đến trang quản trị' : 'Welcome to Admin Dashboard'}
            </h1>
            <Button onClick={handleSignOut} disabled={loading}>
              {language === 'vi' ? 'Đăng xuất' : 'Sign Out'}
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
        </>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {language === 'vi' ? 'Đăng nhập Quản trị' : 'Admin Login'}
            </CardTitle>
            <CardDescription className="text-center">
              {language === 'vi' ? 'Nhập thông tin đăng nhập' : 'Enter your credentials'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">{language === 'vi' ? 'Email' : 'Email'}</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">{language === 'vi' ? 'Mật khẩu' : 'Password'}</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? language === 'vi'
                    ? 'Đang đăng nhập...'
                    : 'Signing in...'
                  : language === 'vi'
                    ? 'Đăng nhập'
                    : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
