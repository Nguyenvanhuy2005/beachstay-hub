
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      console.log(`Attempting to log in with: ${email}`);
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Invalid login credentials. If you are a new admin, please use the forgot password feature to set your password first.');
        } else {
          setErrorMessage(`Login error: ${error.message}`);
        }
        toast.error('Login failed');
        return;
      }

      console.log('Login successful:', data);
      toast.success('Login successful');
      navigate('/admin');
    } catch (error: any) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred. Please try again later.');
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        setErrorMessage('Please enter an email');
        return;
      }

      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (adminError && !adminError.message.includes('No rows found')) {
        console.error('Error checking admin email:', adminError);
      }

      if (cleanEmail === 'admin@annamvillage.vn' || adminUsers) {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/admin/reset-password`
        });

        if (error) {
          console.error('Reset password error:', error);
          setErrorMessage(error.message);
          toast.error('Could not send password reset email');
          return;
        }

        toast.success('Password reset email has been sent');
        return true;
      } else {
        setErrorMessage('Email does not have admin privileges. If you believe this is an error, please contact the system administrator.');
        toast.error('Email does not have admin privileges');
      }
    } catch (error: any) {
      console.error('Error in forgot password:', error);
      setErrorMessage('Error sending password reset email');
      toast.error('Error sending password reset email');
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return {
    isLoading,
    errorMessage,
    login,
    resetPassword,
  };
};
