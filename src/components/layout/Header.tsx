
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, AtSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    t
  } = useLanguage();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <header className="bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img alt="AnNam Village Logo" className="h-12 md:h-16" src="/lovable-uploads/1421d474-c744-4bd5-b508-7ecc1b135ee4.png" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks isScrolled={isScrolled} />
          </nav>

          {/* Contact Information and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+84933669154" className={`flex items-center space-x-1 text-sm ${isScrolled ? 'text-primary' : 'text-white'}`}>
              
              <span className="text-[gree-900] text-green-900 font-bold">0933 669 154</span>
            </a>
            <LanguageSwitcher className={isScrolled ? "text-primary" : "text-white"} />
            <Button size="sm" className="bg-primary hover:bg-green-800 text-white" onClick={() => window.location.href = '/dat-phong'}>
              {t('book_now')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher className={isScrolled ? "text-primary" : "text-white"} />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="bg-slate-50" /> : <Menu className={isScrolled ? "text-primary" : "text-white"} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="md:hidden bg-neutral mt-2 py-4 px-6 shadow-md">
          <nav className="flex flex-col space-y-4">
            <NavLinks isScrolled={true} />
          </nav>
          <div className="mt-4 flex flex-col space-y-2">
            <a href="tel:+84933669154" className="flex items-center space-x-1 text-primary">
              <Phone size={16} className="text-primary" />
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
            <Button size="sm" className="bg-primary hover:bg-green-800 mt-2 text-white" onClick={() => window.location.href = '/dat-phong'}>
              {t('book_now')}
            </Button>
          </div>
        </div>}
    </header>;
};
const NavLinks = ({
  isScrolled
}: {
  isScrolled: boolean;
}) => {
  const textColor = isScrolled ? "text-primary" : "text-white";
  const hoverColor = isScrolled ? "hover:text-secondary" : "hover:text-accent";
  const {
    t
  } = useLanguage();
  return <>
      <Link to="/" className="">
        {t('home')}
      </Link>
      <Link to="/ve-chung-toi" className="">
        {t('about')}
      </Link>
      <Link to="/loai-phong" className="">
        {t('rooms')}
      </Link>
      <Link to="/dich-vu" className="">
        {t('services')}
      </Link>
      <Link to="/blog" className="">
        {t('blog')}
      </Link>
      <Link to="/lien-he" className="">
        {t('contact')}
      </Link>
    </>;
};
export default Header;
