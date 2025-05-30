import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AlertTriangle, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
const AdminLoginPage = () => {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data,
          error
        } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        if (data.session) {
          console.log('User already logged in, redirecting to admin');
          navigate('/admin');
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
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
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });
      if (error) {
        console.error('Login error:', error);
        setErrorMessage(error.message);
        toast.error('Đăng nhập thất bại');
        return;
      }

      // If we reached here, the login was successful
      console.log('Login successful:', data);
      toast.success('Đăng nhập thành công');
      navigate('/admin');
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
        setIsLoading(false);
        return;
      }

      // Send password reset email
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
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
  const createAdminAccount = async () => {
    setIsCreatingAccount(true);
    setErrorMessage('');
    try {
      // First check if the account already exists
      const {
        data: {
          user
        },
        error: signUpError
      } = await supabase.auth.signUp({
        email: 'nvh.adser@gmail.com',
        password: 'Admin@123456'
      });
      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          toast.info('Tài khoản admin đã tồn tại');
          setEmail('nvh.adser@gmail.com');
          setPassword('Admin@123456');
        } else {
          console.error('Error creating admin account:', signUpError);
          setErrorMessage(`Lỗi: ${signUpError.message}`);
          toast.error('Không thể tạo tài khoản admin');
        }
        return;
      }
      if (user) {
        // Make sure user is in admin_access table
        const {
          error: dbError
        } = await supabase.from('admin_access').upsert({
          email: 'nvh.adser@gmail.com',
          is_active: true
        }).select();
        if (dbError) {
          console.error('Error updating admin_access:', dbError);
          setErrorMessage(`Lỗi cập nhật admin_access: ${dbError.message}`);
        } else {
          toast.success('Tài khoản admin đã được tạo');
          setEmail('nvh.adser@gmail.com');
          setPassword('Admin@123456');
        }
      }
    } catch (error: any) {
      console.error('Error in creating account:', error);
      setErrorMessage(`Lỗi: ${error.message}`);
      toast.error('Lỗi tạo tài khoản admin');
    } finally {
      setIsCreatingAccount(false);
    }
  };
  const renderForgotPasswordForm = () => {
    return <form onSubmit={handleForgotPassword} className="space-y-4">
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

      <div className="text-sm bg-yellow-50 text-yellow-700 p-3 rounded border border-yellow-200">
        <p className="mt-1">Nếu bạn chưa có tài khoản hoặc quên mật khẩu, hãy sử dụng chức năng quên mật khẩu để thiết lập tài khoản.</p>
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={isLoading} className="w-full bg-beach-600 hover:bg-beach-700 text-slate-50 bg-slate-900 hover:bg-slate-800">
          {isLoading ? t('signing_in') : t('login')}
        </Button>

        

        <Button type="button" variant="link" className="text-beach-700" onClick={() => setIsForgotPassword(true)} disabled={isLoading}>
          {t('forgot_password')}
        </Button>
      </div>
    </form>;
  };
  return <MainLayout>
    <div className="bg-beach-50 min-h-[80vh] py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-lg border-t-4 border-t-beach-600">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {isForgotPassword ? t('reset_password') : t('admin_login')}
            </CardTitle>
            <CardDescription>
              {isForgotPassword ? 'Nhập email của bạn để đặt lại mật khẩu' : 'Nhập thông tin đăng nhập'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
          </CardContent>
        </Card>
      </div>
    </div>
  </MainLayout>;
};
export default AdminLoginPage;