
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase, createAdminAccount } from '@/lib/supabase';
import { toast } from 'sonner';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('admin@annamvillage.vn');
  const [password, setPassword] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  useEffect(() => {
    // Initialize admin account and check auth status when component mounts
    const init = async () => {
      setIsCreatingAdmin(true);
      await createAdminAccount();
      setIsCreatingAdmin(false);
      await checkAuth();
    };
    
    init();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
  };

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
        setIsAuthenticated(true);
        toast.success('Đăng nhập thành công');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error('Đăng nhập thất bại: ' + (error.message || 'Vui lòng kiểm tra email và mật khẩu'));
      
      // If login fails, try creating the admin account again
      toast.info('Đang thử tạo tài khoản admin...');
      const created = await createAdminAccount();
      if (created) {
        toast.info('Tài khoản admin đã được tạo, vui lòng thử đăng nhập lại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast.success('Đã đăng xuất');
  };

  const handleAdminReset = async () => {
    setIsLoading(true);
    toast.info('Đang khởi tạo lại tài khoản admin...');
    const success = await createAdminAccount();
    setIsLoading(false);
    
    if (success) {
      toast.success('Tài khoản admin đã được khởi tạo lại');
    } else {
      toast.error('Không thể khởi tạo lại tài khoản admin');
    }
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

  return (
    <MainLayout>
      <div className="bg-beach-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-beach-900">Trang Quản Trị</h1>
          
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto">
              <Card>
                <CardContent className="pt-6">
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
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
              <AdminDashboard />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
