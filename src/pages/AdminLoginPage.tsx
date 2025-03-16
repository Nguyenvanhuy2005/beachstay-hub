
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@annamvillage.vn');
  const [password, setPassword] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated as admin
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email) {
        try {
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', data.session.user.email)
            .maybeSingle();
          
          if (adminData && !error) {
            // Already authenticated as admin, redirect to dashboard
            navigate('/admin/dashboard');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log(`Attempting to log in with: ${email}`);
      
      // Clean up the email input
      const cleanEmail = email.trim().toLowerCase();
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        setErrorMessage(error.message);
        throw error;
      }
      
      if (data.user) {
        console.log('Login successful for:', data.user.email);
        
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();
        
        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setErrorMessage('Lỗi kiểm tra quyền quản trị');
          throw adminError;
        }
        
        if (adminData) {
          toast.success('Đăng nhập thành công');
          navigate('/admin/dashboard');
        } else {
          // User authenticated but not authorized
          console.log('User is not authorized as admin');
          await supabase.auth.signOut();
          setErrorMessage('Tài khoản không có quyền quản trị');
        }
      }
    } catch (error: any) {
      toast.error('Đăng nhập thất bại');
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminReset = async () => {
    setIsLoading(true);
    setIsCreatingAdmin(true);
    setErrorMessage('');
    toast.info('Đang khởi tạo lại tài khoản admin...');
    
    try {
      // Try to sign up with admin credentials (this will create a new user if it doesn't exist)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@annamvillage.vn',
        password: 'admin',
      });

      // If user exists or was created successfully
      if (signUpError && !signUpError.message.includes('already registered')) {
        throw signUpError;
      }

      // Ensure the admin record exists in the admin_users table
      const { error: upsertError } = await supabase
        .from('admin_users')
        .upsert([
          { 
            email: 'admin@annamvillage.vn', 
            is_active: true 
          }
        ], 
        { onConflict: 'email' });
      
      if (upsertError) {
        throw upsertError;
      }
      
      toast.success('Tài khoản admin đã được khởi tạo lại, vui lòng đăng nhập');
      
      // Set default credentials for easier login
      setEmail('admin@annamvillage.vn');
      setPassword('admin');
    } catch (error: any) {
      console.error('Error resetting admin account:', error);
      setErrorMessage('Lỗi khởi tạo tài khoản: ' + error.message);
      toast.error('Lỗi khởi tạo tài khoản admin');
    } finally {
      setIsLoading(false);
      setIsCreatingAdmin(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-beach-50 min-h-[80vh] py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="shadow-lg border-t-4 border-t-beach-600">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Đăng nhập Quản trị</CardTitle>
              <CardDescription>Nhập thông tin đăng nhập</CardDescription>
            </CardHeader>
            <CardContent>
              {isCreatingAdmin ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beach-700 mx-auto mb-4"></div>
                  <p>Đang khởi tạo tài khoản admin...</p>
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
                      className="bg-white"
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
                      className="bg-white"
                      required
                    />
                  </div>
                  
                  {errorMessage && (
                    <div className="p-3 rounded bg-red-50 text-red-600 text-sm flex items-start gap-2">
                      <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                    Tài khoản mặc định: admin@annamvillage.vn / admin
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-beach-600 hover:bg-beach-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full mt-2 border-beach-300 text-beach-700" 
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
    </MainLayout>
  );
};

export default AdminLoginPage;
