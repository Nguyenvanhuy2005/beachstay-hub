
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Phone, AtSign, MapPin, LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/supabase";
import { toast } from "sonner";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        setIsAuthenticated(hasSession);

        if (hasSession) {
          const adminStatus = await isAdmin();
          setIsAdminUser(adminStatus);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const hasSession = !!session;
      setIsAuthenticated(hasSession);
      if (hasSession) {
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
      } else {
        setIsAdminUser(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAdminAction = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Đăng xuất thành công");
      setIsAuthenticated(false);
      setIsAdminUser(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Lỗi khi đăng xuất");
    }
  };

  return (
    <header className="bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              alt="AnNam Village Logo" 
              className="h-12 md:h-16" 
              src="/lovable-uploads/92600fbe-d6bd-43bb-a23f-9a3f0589e9e5.png" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks isScrolled={true} />
          </nav>

          {/* Contact Information and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+84933669154" className="flex items-center space-x-1 text-sm">
              <Phone size={16} className="text-green-900" />
              <span className="text-green-900 font-bold">0933 669 154</span>
            </a>
            <LanguageSwitcher className="text-primary" />
            <Button 
              size="sm" 
              className="bg-primary hover:bg-green-800 text-white" 
              onClick={() => window.location.href = '/dat-phong'}
            >
              {t('book_now')}
            </Button>
            
            {!isLoading && (
              <>
                {isAuthenticated && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="flex items-center gap-1" 
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher className="text-primary" />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="text-primary" />
              ) : (
                <Menu className="text-primary" />
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
              <Phone size={16} className="text-green-900" />
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
            
            {!isLoading && (
              <div className="flex flex-col space-y-2 mt-2 pt-2 border-t border-gray-200">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1 justify-center" 
                  onClick={handleAdminAction}
                >
                  {isAuthenticated ? <Shield size={16} /> : <LogIn size={16} />}
                  <span>{isAuthenticated ? "Quản trị" : "Admin"}</span>
                </Button>
                
                {isAuthenticated && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="flex items-center gap-1 justify-center" 
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ isScrolled }: { isScrolled: boolean }) => {
  const textColor = "text-primary";
  const hoverColor = "hover:text-secondary";
  const { t } = useLanguage();

  return (
    <>
      <Link to="/" className={`${textColor} ${hoverColor}`}>
        {t('home')}
      </Link>
      <Link to="/ve-chung-toi" className={`${textColor} ${hoverColor}`}>
        {t('about')}
      </Link>
      <Link to="/loai-phong" className={`${textColor} ${hoverColor}`}>
        {t('rooms')}
      </Link>
      <Link to="/dich-vu" className={`${textColor} ${hoverColor}`}>
        {t('services')}
      </Link>
      <Link to="/blog" className={`${textColor} ${hoverColor}`}>
        {t('blog')}
      </Link>
      <Link to="/lien-he" className={`${textColor} ${hoverColor}`}>
        {t('contact')}
      </Link>
    </>
  );
};

export default Header;
