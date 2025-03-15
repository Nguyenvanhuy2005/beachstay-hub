
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase, createAdminAccount, isAdmin } from '@/lib/supabase';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@annamvillage.vn');
  const [password, setPassword] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize admin account when component mounts
    const init = async () => {
      try {
        console.log('Initializing AdminLoginPage component...');
        setIsCreatingAdmin(true);
        await createAdminAccount();
        setIsCreatingAdmin(false);
        
        // Check if already authenticated
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          const adminCheck = await isAdmin(data.session.user.email);
          if (adminCheck) {
            // Already authenticated as admin, redirect to admin dashboard
            navigate('/admin/dashboard');
          }
        }
      } catch (error) {
        console.error('Error during AdminLoginPage initialization:', error);
        setIsCreatingAdmin(false);
        toast.error('Lỗi khởi tạo trang đăng nhập quản trị');
      }
    };
    
    init();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log(`Attempting to log in with: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      if (data.user) {
        console.log('Login successful:', data.user);
        
        // Check if user is in admin_users table
        const adminCheck = await isAdmin(data.user.email || '');
        
        if (adminCheck) {
          toast.success('Đăng nhập thành công');
          navigate('/admin/dashboard');
        } else {
          // User authenticated but not authorized
          await supabase.auth.signOut();
          toast.error('Tài khoản không có quyền quản trị');
        }
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error('Đăng nhập thất bại: ' + (error.message || 'Vui lòng kiểm tra email và mật khẩu'));
      
      // If login fails, try creating the admin account again
      toast.info('Đang thử tạo lại tài khoản admin...');
      const created = await createAdminAccount();
      if (created) {
        toast.info('Tài khoản admin đã được tạo, vui lòng thử đăng nhập lại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminReset = async () => {
    setIsLoading(true);
    toast.info('Đang khởi tạo lại tài khoản admin...');
    
    try {
      // First ensure the admin exists in the admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert([{ email: 'admin@annamvillage.vn', is_active: true }]);
      
      if (adminError) {
        throw adminError;
      }
      
      // Then try to create/reset the auth account
      await supabase.auth.signOut();
      
      // Create a new admin account
      const success = await createAdminAccount();
      
      if (success) {
        toast.success('Tài khoản admin đã được khởi tạo lại');
      } else {
        toast.error('Không thể khởi tạo lại tài khoản admin');
      }
    } catch (error: any) {
      console.error('Error resetting admin:', error);
      toast.error('Lỗi khi khởi tạo lại tài khoản admin: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-beach-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-beach-900">Đăng Nhập Quản Trị</h1>
          
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Đăng nhập quản trị</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {isCreatingAdmin ? (
                  <div className="text-center py-4">
                    <p className="mb-2">Đang tạo tài khoản admin...</p>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@annamvillage.vn"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      Tài khoản mặc định: admin@annamvillage.vn / admin
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full mt-4" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full mt-2" 
                      onClick={handleAdminReset}
                      disabled={isLoading}
                    >
                      Khởi tạo lại tài khoản admin
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLoginPage;
