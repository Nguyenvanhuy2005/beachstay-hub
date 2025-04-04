
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, AtSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-md py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/a7992fa3-09c9-4cba-9b30-ef420f9cf194.png" 
              alt="Annam Village Logo" 
              className="h-12 md:h-16"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks isScrolled={isScrolled} />
          </nav>

          {/* Contact Information and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="tel:+84933669154" 
              className={`flex items-center space-x-1 text-sm ${isScrolled ? 'text-primary' : 'text-white'}`}
            >
              <Phone size={16} />
              <span>0933 669 154</span>
            </a>
            <LanguageSwitcher className={isScrolled ? "text-primary" : "text-white"} />
            <Button 
              size="sm" 
              className="bg-primary hover:bg-green-800 text-white" 
              onClick={() => window.location.href = '/dat-phong'}
            >
              {t('book_now')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher className={isScrolled ? "text-primary" : "text-white"} />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={isScrolled ? "text-primary" : "text-white"} />
              ) : (
                <Menu className={isScrolled ? "text-primary" : "text-white"} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral mt-2 py-4 px-6 shadow-md">
          <nav className="flex flex-col space-y-4">
            <NavLinks isScrolled={true} />
          </nav>
          <div className="mt-4 flex flex-col space-y-2">
            <a href="tel:+84933669154" className="flex items-center space-x-1 text-primary">
              <Phone size={16} />
              <span>0933 669 154</span>
            </a>
            <a href="mailto:annamvillage.vn@gmail.com" className="flex items-center space-x-1 text-primary">
              <AtSign size={16} />
              <span>annamvillage.vn@gmail.com</span>
            </a>
            <a href="https://maps.app.goo.gl/12345" className="flex items-center space-x-1 text-primary">
              <MapPin size={16} />
              <span>234 Phan Chu Trinh, Phường 2, Vũng Tàu</span>
            </a>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-green-800 mt-2 text-white"
              onClick={() => window.location.href = '/dat-phong'}
            >
              {t('book_now')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ isScrolled }: { isScrolled: boolean }) => {
  const textColor = isScrolled ? "text-primary" : "text-white";
  const hoverColor = isScrolled ? "hover:text-secondary" : "hover:text-accent";
  const { t } = useLanguage();
  
  return (
    <>
      <Link to="/" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        {t('home')}
      </Link>
      <Link to="/ve-chung-toi" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        {t('about')}
      </Link>
      <Link to="/loai-phong" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        {t('rooms')}
      </Link>
      <Link to="/dich-vu" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        {t('services')}
      </Link>
      <Link to="/blog" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        {t('blog')}
      </Link>
      <Link to="/lien-he" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        {t('contact')}
      </Link>
    </>
  );
};

export default Header;
