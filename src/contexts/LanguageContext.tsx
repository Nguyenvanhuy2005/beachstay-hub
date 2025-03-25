
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Define translations
const translations = {
  vi: {
    // Navigation
    'home': 'Trang Chủ',
    'about': 'Về Chúng Tôi',
    'rooms': 'Loại Phòng',
    'services': 'Dịch Vụ',
    'blog': 'Blog',
    'contact': 'Liên Hệ',
    'book_now': 'Đặt Phòng',
    
    // CTA Section
    'book_today': 'Đặt Phòng Ngay Hôm Nay',
    'special_offers': 'Và Nhận Ưu Đãi Đặc Biệt',
    'book_direct': 'Đặt phòng trực tiếp trên website chính thức của chúng tôi để nhận được giá tốt nhất cùng nhiều ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đặt phòng online.',
    'book_now_btn': 'Đặt Phòng Ngay',
    'view_offers': 'Xem Ưu Đãi',
    
    // Benefits
    'best_price': 'Giá tốt nhất đảm bảo',
    'exclusive_offers': 'Ưu đãi độc quyền chỉ có trên website',
    'quick_booking': 'Đặt phòng nhanh chóng, dễ dàng',
    'free_cancel': 'Hủy miễn phí trước 7 ngày',
    'secure_payment': 'Thanh toán an toàn, bảo mật',
  },
  en: {
    // Navigation
    'home': 'Home',
    'about': 'About Us',
    'rooms': 'Room Types',
    'services': 'Services',
    'blog': 'Blog',
    'contact': 'Contact',
    'book_now': 'Book Now',
    
    // CTA Section
    'book_today': 'Book Your Stay Today',
    'special_offers': 'And Get Special Offers',
    'book_direct': 'Book directly on our official website to get the best price and many attractive offers exclusively for online booking customers.',
    'book_now_btn': 'Book Now',
    'view_offers': 'View Offers',
    
    // Benefits
    'best_price': 'Best price guarantee',
    'exclusive_offers': 'Exclusive offers only on our website',
    'quick_booking': 'Quick and easy booking',
    'free_cancel': 'Free cancellation before 7 days',
    'secure_payment': 'Secure payment',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('vi');

  // Function to translate text based on current language
  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  // Load preferred language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
