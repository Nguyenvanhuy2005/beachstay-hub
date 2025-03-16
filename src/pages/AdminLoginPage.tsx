
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        } else {
          setErrorMessage(`Lỗi đăng nhập: ${error.message}`);
        }
        toast.error('Đăng nhập thất bại');
        return;
      }
      
      // If we reached here, the login was successful
      console.log('Login successful:', data);
      toast.success('Đăng nhập thành công');
    } catch (error: any) {
      console.error('Error logging in:', error);
      setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      toast.error('Đã xảy ra lỗi khi đăng nhập');
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
      
      // Kiểm tra xem email có tồn tại trong hệ thống không
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .single();
      
      if (adminError && !adminError.message.includes('No rows found')) {
        console.error('Error checking admin email:', adminError);
      }
      
      // Nếu email là admin@annamvillage.vn hoặc có trong bảng admin_users
      if (cleanEmail === 'admin@annamvillage.vn' || adminUsers) {
        // Send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        });
        
        if (error) {
          console.error('Reset password error:', error);
          setErrorMessage(error.message);
          toast.error('Không thể gửi email đặt lại mật khẩu');
          return;
        }
        
        setResetMessage('Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
        toast.success('Email đặt lại mật khẩu đã được gửi');
      } else {
        setErrorMessage('Email không có quyền quản trị.');
        toast.error('Email không có quyền quản trị');
      }
    } catch (error: any) {
      console.error('Error in forgot password:', error);
      setErrorMessage('Lỗi gửi email đặt lại mật khẩu');
      toast.error('Lỗi gửi email đặt lại mật khẩu');
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
          <Alert variant="destructive" className="text-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {resetMessage && (
          <Alert className="bg-green-50 text-green-600 border-green-200 text-sm">
            <AlertDescription>{resetMessage}</AlertDescription>
          </Alert>
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
          <Alert variant="destructive" className="text-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-sm bg-yellow-50 text-yellow-700 p-3 rounded border border-yellow-200">
          <p>Tài khoản admin mặc định: admin@annamvillage.vn</p>
          <p className="mt-1">Nếu bạn chưa có tài khoản hoặc quên mật khẩu, hãy sử dụng chức năng quên mật khẩu để thiết lập tài khoản.</p>
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
