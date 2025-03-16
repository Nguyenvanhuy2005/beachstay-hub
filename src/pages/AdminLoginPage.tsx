
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
import { Textarea } from '@/components/ui/textarea';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setResetMessage('');
    
    try {
      const cleanEmail = forgotEmail.trim().toLowerCase();
      
      if (!cleanEmail) {
        setErrorMessage('Vui lòng nhập email');
        return;
      }
      
      // Check if email is in admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
        setErrorMessage('Lỗi kiểm tra email');
        return;
      }
      
      if (!adminData) {
        setErrorMessage('Email không tồn tại trong hệ thống quản trị');
        return;
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      
      if (error) {
        console.error('Reset password error:', error);
        setErrorMessage(error.message);
        throw error;
      }
      
      setResetMessage('Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
      toast.success('Email đặt lại mật khẩu đã được gửi');
    } catch (error: any) {
      console.error('Error in forgot password:', error);
      setErrorMessage('Lỗi gửi email đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForgotPasswordForm = () => {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email" 
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Nhập email quản trị của bạn"
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
        
        {resetMessage && (
          <div className="p-3 rounded bg-green-50 text-green-600 text-sm">
            {resetMessage}
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full bg-beach-600 hover:bg-beach-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu đặt lại mật khẩu'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full border-beach-300 text-beach-700" 
            onClick={() => setIsForgotPassword(false)}
            disabled={isLoading}
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </form>
    );
  };

  const renderLoginForm = () => {
    return (
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
        
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
          Tài khoản mặc định: admin@annamvillage.vn / admin
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full bg-beach-600 hover:bg-beach-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
          
          <Button 
            type="button" 
            variant="link"
            className="text-beach-700" 
            onClick={() => setIsForgotPassword(true)}
            disabled={isLoading}
          >
            Quên mật khẩu?
          </Button>
        </div>
      </form>
    );
  };

  return (
    <MainLayout>
      <div className="bg-beach-50 min-h-[80vh] py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="shadow-lg border-t-4 border-t-beach-600">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {isForgotPassword ? 'Quên mật khẩu' : 'Đăng nhập Quản trị'}
              </CardTitle>
              <CardDescription>
                {isForgotPassword 
                  ? 'Nhập email của bạn để đặt lại mật khẩu' 
                  : 'Nhập thông tin đăng nhập'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLoginPage;
