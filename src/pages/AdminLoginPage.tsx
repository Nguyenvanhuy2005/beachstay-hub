
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminLoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetAdmin, setIsResetAdmin] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('AdminLoginPage: Checking for existing session');
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('AdminLoginPage: User already authenticated, redirecting to admin dashboard');
          navigate('/admin');
        }
      } catch (error) {
        console.error('AdminLoginPage: Error checking session:', error);
      }
    };
    
    checkSession();
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
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage(t('login_error'));
        } else {
          setErrorMessage(`Lỗi đăng nhập: ${error.message}`);
        }
        toast.error('Đăng nhập thất bại');
        setIsLoading(false);
        return;
      }

      // After successful login, check if the user is an admin
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();
          
        if (adminError) {
          console.error('Admin check error:', adminError);
          throw adminError;
        }
        
        if (!adminData) {
          console.error('Not an admin user:', 'No admin record found');
          // Sign out the user since they're not an admin
          await supabase.auth.signOut();
          setErrorMessage('Email này không có quyền quản trị');
          toast.error('Email không có quyền quản trị');
          setIsLoading(false);
          return;
        }

        // If we reached here, the login was successful and user is an admin
        console.log('Login successful:', data);
        toast.success('Đăng nhập thành công');
        navigate('/admin');
      } catch (adminCheckError) {
        console.error('Error checking admin status:', adminCheckError);
        await supabase.auth.signOut();
        setErrorMessage('Lỗi kiểm tra quyền quản trị. Vui lòng thử lại sau.');
        toast.error('Lỗi kiểm tra quyền quản trị');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      toast.error('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setResetMessage('');

    try {
      // Reset password for admin@annamvillage.vn to Admin@123456
      const adminEmail = 'admin@annamvillage.vn';
      
      // First check if the user exists
      const { data: userData, error: userError } = await supabase.auth
        .signInWithPassword({
          email: adminEmail,
          password: 'any-password-to-check-existence' // Just to check if user exists
        });
      
      if (userError && !userError.message.includes('Invalid login credentials')) {
        console.error('Error checking admin user:', userError);
        setErrorMessage('Lỗi kiểm tra tài khoản quản trị');
        setIsLoading(false);
        return;
      }
      
      // Use admin API to reset password (requires service role key)
      const { error: resetError } = await supabase.auth.admin.updateUserById(
        'admin-user-id', // The user ID will not actually be used due to our custom implementation
        { password: 'Admin@123456' }
      );
      
      if (resetError) {
        console.error('Error resetting admin password:', resetError);
        // Fallback to password reset email
        await handleForgotPassword(e, adminEmail);
        return;
      }
      
      setResetMessage('Đã đặt lại mật khẩu quản trị thành công!');
      toast.success('Đặt lại mật khẩu quản trị thành công');
      // Pre-fill the form for admin login
      setEmail(adminEmail);
      setPassword('Admin@123456');
      setIsResetAdmin(false);
      
    } catch (error: any) {
      console.error('Error in reset admin password:', error);
      // Fallback to password reset email
      await handleForgotPassword(e, 'admin@annamvillage.vn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent, presetEmail?: string) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setResetMessage('');
    
    try {
      const cleanEmail = presetEmail || forgotEmail.trim().toLowerCase();
      
      if (!cleanEmail) {
        setErrorMessage('Vui lòng nhập email');
        setIsLoading(false);
        return;
      }

      console.log(`Sending password reset email to: ${cleanEmail}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });
      
      if (error) {
        console.error('Reset password error:', error);
        setErrorMessage(error.message);
        toast.error('Không thể gửi email đặt lại mật khẩu');
        return;
      }
      
      setResetMessage(t('reset_password_sent'));
      toast.success('Email đặt lại mật khẩu đã được gửi');
    } catch (error: any) {
      console.error('Error in forgot password:', error);
      setErrorMessage('Lỗi gửi email đặt lại mật khẩu');
      toast.error('Lỗi gửi email đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResetAdminForm = () => {
    return (
      <form onSubmit={handleResetAdminPassword} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Hệ thống sẽ đặt lại mật khẩu cho tài khoản admin@annamvillage.vn thành Admin@123456.
          </p>
        </div>
        
        {errorMessage && <Alert variant="destructive" className="text-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>}
        
        {resetMessage && <Alert className="bg-green-50 text-green-600 border-green-200 text-sm">
            <AlertDescription>{resetMessage}</AlertDescription>
          </Alert>}
        
        <div className="flex flex-col space-y-2">
          <Button type="submit" className="w-full bg-beach-600 hover:bg-beach-700" disabled={isLoading}>
            {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu quản trị'}
          </Button>
          
          <Button type="button" variant="outline" className="w-full border-beach-300 text-beach-700" onClick={() => setIsResetAdmin(false)} disabled={isLoading}>
            {t('back_to_login')}
          </Button>
        </div>
      </form>
    );
  };

  const renderForgotPasswordForm = () => {
    return <form onSubmit={(e) => handleForgotPassword(e)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">{t('email')}</Label>
          <Input id="forgot-email" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Nhập email quản trị của bạn" className="bg-white" required />
        </div>
        
        {errorMessage && <Alert variant="destructive" className="text-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>}
        
        {resetMessage && <Alert className="bg-green-50 text-green-600 border-green-200 text-sm">
            <AlertDescription>{resetMessage}</AlertDescription>
          </Alert>}
        
        <div className="flex flex-col space-y-2">
          <Button type="submit" className="w-full bg-beach-600 hover:bg-beach-700" disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : t('send_reset')}
          </Button>
          
          <Button type="button" variant="outline" className="w-full border-beach-300 text-beach-700" onClick={() => setIsForgotPassword(false)} disabled={isLoading}>
            {t('back_to_login')}
          </Button>
        </div>
      </form>;
  };

  const renderLoginForm = () => {
    return <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@annamvillage.vn" className="bg-white" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t('password')}</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white" required />
        </div>
        
        {errorMessage && <Alert variant="destructive" className="text-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>}
        
        {resetMessage && <Alert className="bg-green-50 text-green-600 border-green-200 text-sm">
            <AlertDescription>{resetMessage}</AlertDescription>
          </Alert>}
        
        <div className="text-sm bg-yellow-50 text-yellow-700 p-3 rounded border border-yellow-200">
          <p className="mt-1">Nếu bạn chưa có tài khoản hoặc quên mật khẩu, hãy sử dụng chức năng quên mật khẩu để thiết lập tài khoản.</p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button type="submit" disabled={isLoading} className="w-full bg-beach-600 hover:bg-beach-700 text-slate-50">
            {isLoading ? t('signing_in') : t('login')}
          </Button>
          
          <div className="flex justify-between">
            <Button type="button" variant="link" className="text-beach-700" onClick={() => setIsForgotPassword(true)} disabled={isLoading}>
              {t('forgot_password')}
            </Button>
            
            <Button type="button" variant="link" className="text-beach-700" onClick={() => setIsResetAdmin(true)} disabled={isLoading}>
              Đặt lại mật khẩu quản trị
            </Button>
          </div>
        </div>
      </form>;
  };

  return <MainLayout>
      <div className="bg-beach-50 min-h-[80vh] py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="shadow-lg border-t-4 border-t-beach-600">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {isResetAdmin ? 'Đặt lại mật khẩu quản trị' : 
                 isForgotPassword ? t('reset_password') : t('admin_login')}
              </CardTitle>
              <CardDescription>
                {isResetAdmin ? 'Đặt lại mật khẩu cho tài khoản admin@annamvillage.vn' : 
                 isForgotPassword ? 'Nhập email của bạn để đặt lại mật khẩu' : 'Nhập thông tin đăng nhập'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isResetAdmin ? renderResetAdminForm() : 
               isForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>;
};

export default AdminLoginPage;
