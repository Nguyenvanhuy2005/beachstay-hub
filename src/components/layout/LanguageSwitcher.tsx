
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
  
  // Kiểm tra nếu là trang admin thì không hiển thị
  if (location.pathname.includes('/admin')) {
    return null;
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="relative text-sm font-medium p-0 flex items-center gap-1 hover:bg-transparent"
        onClick={toggleLanguage}
        aria-label="Chuyển ngôn ngữ"
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
