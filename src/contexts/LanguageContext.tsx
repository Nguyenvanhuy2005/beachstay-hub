
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '@/translations';

// Define the context type
type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  toggleLanguage: () => {},
  t: () => '',
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language from localStorage or default to 'vi'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' ? 'en' : 'vi') as Language;
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Toggle between 'vi' and 'en'
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'vi' ? 'en' : 'vi'));
  };

  // Translation function
  const t = (key: string): string => {
    // Split key by dots to navigate nested objects
    const keys = key.split('.');
    let result = translations[language];
    
    // Handle simple keys that don't use dot notation
    if (keys.length === 1) {
      // Try to find in common section first
      if (result.common && result.common[key]) {
        return result.common[key];
      }
      
      // Try to find in other top-level sections
      for (const section in result) {
        if (typeof result[section] === 'object' && result[section][key]) {
          return result[section][key];
        }
      }
      
      // Return the key if not found
      return key;
    }
    
    // Handle nested keys (e.g., 'home.hero.title')
    try {
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return key; // Return the key if path is invalid
        }
      }
      
      // Return string value or the original key if not a string
      return typeof result === 'string' ? result : key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  // Provide the context value
  const contextValue = {
    language,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
