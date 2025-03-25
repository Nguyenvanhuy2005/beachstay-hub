
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

type LanguageSwitcherProps = {
  className?: string;
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="relative text-sm font-medium p-0 flex items-center gap-1"
        onClick={toggleLanguage}
      >
        <Globe size={16} />
        <span className={`transition-opacity duration-200 ${language === 'vi' ? 'opacity-100' : 'opacity-50'}`}>
          VI
        </span>
        <span className="mx-1">/</span>
        <span className={`transition-opacity duration-200 ${language === 'en' ? 'opacity-100' : 'opacity-50'}`}>
          EN
        </span>
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
