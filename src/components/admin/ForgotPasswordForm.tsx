
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const { t } = useLanguage();
  const { resetPassword, isLoading, errorMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await resetPassword(email);
    if (success) {
      setResetMessage(t('reset_password_sent'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="forgot-email">{t('email')}</Label>
        <Input
          id="forgot-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your admin email"
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
          {isLoading ? 'Sending...' : t('send_reset')}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full border-beach-300 text-beach-700"
          onClick={onBackToLogin}
          disabled={isLoading}
        >
          {t('back_to_login')}
        </Button>
      </div>
    </form>
  );
};
