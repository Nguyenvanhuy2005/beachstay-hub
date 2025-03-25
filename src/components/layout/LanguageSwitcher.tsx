
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';
import { useLocation } from 'react-router-dom';

type LanguageSwitcherProps = {
  className?: string;
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin');

  // Don't show language switcher in admin routes
  if (isAdminRoute) {
    return null;
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="relative text-sm font-medium p-0 flex items-center gap-1"
        onClick={toggleLanguage}
        aria-label="Change language"
      >
        <Globe size={16} className="mr-1" />
        <span className={`transition-opacity duration-200 ${language === 'vi' ? 'opacity-100 font-bold' : 'opacity-50'}`}>
          VI
        </span>
        <span className="mx-1">/</span>
        <span className={`transition-opacity duration-200 ${language === 'en' ? 'opacity-100 font-bold' : 'opacity-50'}`}>
          EN
        </span>
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
