import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
const Footer = () => {
  const {
    language,
    t
  } = useLanguage();
  const [email, setEmail] = useState("");
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error(language === 'vi' ? 'Vui lòng nhập email hợp lệ' : 'Please enter a valid email');
      return;
    }
    toast.success(language === 'vi' ? 'Cảm ơn bạn đã đăng ký! Bạn sẽ nhận được thông tin mới nhất từ chúng tôi.' : 'Thank you for subscribing! You will receive our latest updates.');
    setEmail("");
  };
  const footerAnimation = {
    initial: {
      y: 50,
      opacity: 0
    },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.05 * i,
        duration: 0.5
      }
    })
  };
  return <footer className="bg-olive-800 text-white pt-16 pb-8 relative overflow-hidden bg-green-900">
      <div className="wave-pattern absolute bottom-0 left-0 right-0 h-16 opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 bg-green-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <motion.div variants={footerAnimation} initial="initial" whileInView="animate" viewport={{
          once: true
        }} custom={1}>
            <Link to="/" className="inline-block mb-4">
              <img src="/lovable-uploads/logo-trang.png" alt="Annam Village Logo" className="h-32" />
            </Link>
            <p className="text-gray-300 mb-4">
              {language === 'vi' ? 'Nơi hòa quyện giữa thiên nhiên và không gian nghỉ dưỡng sang trọng tại thành phố biển Vũng Tàu.' : 'A harmonious blend of nature and luxury retreat space in the coastal city of Vung Tau.'}
            </p>
            <div className="flex space-x-4 mt-6">
              <motion.a href="https://facebook.com/111530511968486" target="_blank" rel="noopener noreferrer" className="text-white hover:text-terra-300 transition-colors transform hover:scale-110 duration-300" whileHover={{
              y: -3
            }}>
                <Facebook size={20} />
              </motion.a>
              <motion.a href="https://www.instagram.com/a.nvillage_official/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-terra-300 transition-colors transform hover:scale-110 duration-300" whileHover={{
              y: -3
            }}>
                <Instagram size={20} />
              </motion.a>
              <motion.a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-terra-300 transition-colors transform hover:scale-110 duration-300" whileHover={{
              y: -3
            }}>
                <Youtube size={20} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={footerAnimation} initial="initial" whileInView="animate" viewport={{
          once: true
        }} custom={2}>
            <h3 className="font-display text-lg font-semibold mb-4 text-gray-50">{t('links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-terra-300 transition-colors inline-block">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/ve-chung-toi" className="text-gray-300 hover:text-terra-300 transition-colors inline-block">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/loai-phong" className="text-gray-300 hover:text-terra-300 transition-colors inline-block">
                  {t('rooms')}
                </Link>
              </li>
              <li>
                <Link to="/dich-vu" className="text-gray-300 hover:text-terra-300 transition-colors inline-block">
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-terra-300 transition-colors inline-block">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="text-gray-300 hover:text-terra-300 transition-colors inline-block">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={footerAnimation} initial="initial" whileInView="animate" viewport={{
          once: true
        }} custom={3}>
            <h3 className="font-display text-lg font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-terra-400" />
                <span className="text-gray-300">
                  234 Phan Chu Trinh, Phường 2, TP. Vũng Tàu, Việt Nam
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-terra-400" />
                <a href="tel:+84933669154" className="text-gray-300 hover:text-terra-300 transition-colors">0933 669 154</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-terra-400" />
                <a href="mailto:info@annamvillage.vn" className="text-gray-300 hover:text-terra-300 transition-colors">info@annamvillage.vn</a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={footerAnimation} initial="initial" whileInView="animate" viewport={{
          once: true
        }} custom={4}>
            <h3 className="font-display text-lg font-semibold mb-4">
              {t('subscribe')}
            </h3>
            <p className="text-gray-300 mb-4">
              {t('subscribe_desc')}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <Input type="email" placeholder={t('your_email')} className="bg-olive-700 border-olive-600 focus:border-terra-400 text-white" value={email} onChange={e => setEmail(e.target.value)} />
              <Button type="submit" className="bg-terra-600 hover:bg-terra-700 transition-all transform hover:scale-105 duration-300 text-slate-50">
                {t('subscribe_btn')}
              </Button>
            </form>
          </motion.div>
        </div>

        <div className="border-t border-olive-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Annam Village. {t('all_rights')}
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm text-gray-400">
                <li>
                  <Link to="/dieu-khoan" className="hover:text-terra-300 transition-colors">
                    {t('terms')}
                  </Link>
                </li>
                <li>
                  <Link to="/bao-mat" className="hover:text-terra-300 transition-colors">
                    {t('privacy')}
                  </Link>
                </li>
                <li>
                  <Link to="/cookie" className="hover:text-terra-300 transition-colors">
                    {t('cookies')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;