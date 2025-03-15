
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, AtSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <span className={`font-serif text-2xl font-bold ${isScrolled ? 'text-beach-700' : 'text-white'}`}>
              Annam<span className="text-beach-500">Village</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks isScrolled={isScrolled} />
          </nav>

          {/* Contact Information */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="tel:+84909123456" 
              className={`flex items-center space-x-1 text-sm ${isScrolled ? 'text-beach-700' : 'text-white'}`}
            >
              <Phone size={16} />
              <span>+84 909 123 456</span>
            </a>
            <Button size="sm" className="bg-beach-500 hover:bg-beach-600">
              Đặt Phòng
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-beach-700" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-beach-700" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white mt-2 py-4 px-6 shadow-md">
          <nav className="flex flex-col space-y-4">
            <NavLinks isScrolled={true} />
          </nav>
          <div className="mt-4 flex flex-col space-y-2">
            <a href="tel:+84909123456" className="flex items-center space-x-1 text-beach-700">
              <Phone size={16} />
              <span>+84 909 123 456</span>
            </a>
            <a href="mailto:info@annamvillage.vn" className="flex items-center space-x-1 text-beach-700">
              <AtSign size={16} />
              <span>info@annamvillage.vn</span>
            </a>
            <a href="https://maps.app.goo.gl/12345" className="flex items-center space-x-1 text-beach-700">
              <MapPin size={16} />
              <span>Vũng Tàu, Việt Nam</span>
            </a>
            <Button size="sm" className="bg-beach-500 hover:bg-beach-600 mt-2">
              Đặt Phòng
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ isScrolled }: { isScrolled: boolean }) => {
  const textColor = isScrolled ? "text-beach-700" : "text-white";
  const hoverColor = isScrolled ? "hover:text-beach-500" : "hover:text-beach-200";
  
  return (
    <>
      <Link to="/" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        Trang Chủ
      </Link>
      <Link to="/ve-chung-toi" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        Về Chúng Tôi
      </Link>
      <Link to="/loai-phong" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        Loại Phòng
      </Link>
      <Link to="/tien-ich" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        Tiện Ích
      </Link>
      <Link to="/dich-vu" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        Dịch Vụ
      </Link>
      <Link to="/lien-he" className={`${textColor} ${hoverColor} transition-colors duration-200`}>
        Liên Hệ
      </Link>
    </>
  );
};

export default Header;
