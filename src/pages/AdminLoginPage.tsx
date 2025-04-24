
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { LoginForm } from '@/components/admin/LoginForm';
import { ForgotPasswordForm } from '@/components/admin/ForgotPasswordForm';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminLoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <MainLayout>
      <div className="bg-beach-50 min-h-[80vh] py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="shadow-lg border-t-4 border-t-beach-600">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {isForgotPassword ? t('reset_password') : t('admin_login')}
              </CardTitle>
              <CardDescription>
                {isForgotPassword 
                  ? 'Enter your email to reset your password'
                  : 'Enter your login credentials'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isForgotPassword ? (
                <ForgotPasswordForm onBackToLogin={() => setIsForgotPassword(false)} />
              ) : (
                <LoginForm onForgotPasswordClick={() => setIsForgotPassword(true)} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLoginPage;
