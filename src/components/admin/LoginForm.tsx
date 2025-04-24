
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginFormProps {
  onForgotPasswordClick: () => void;
}

export const LoginForm = ({ onForgotPasswordClick }: LoginFormProps) => {
  const { t } = useLanguage();
  const { login, isLoading, errorMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@annamvillage.vn"
          className="bg-white"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
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
        <p className="mt-1">
          If you don't have an account or forgot your password, please use the forgot password feature to set up your account.
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-beach-600 hover:bg-beach-700 text-slate-50 bg-slate-900 hover:bg-slate-800"
        >
          {isLoading ? t('signing_in') : t('login')}
        </Button>

        <Button
          type="button"
          variant="link"
          className="text-beach-700"
          onClick={onForgotPasswordClick}
          disabled={isLoading}
        >
          {t('forgot_password')}
        </Button>
      </div>
    </form>
  );
};
