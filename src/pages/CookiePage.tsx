
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Cookie, Clock, Settings2, ShieldCheck, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const CookiePage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cookieTypes = [
    {
      name: language === 'vi' ? 'Cookie cần thiết' : 'Essential Cookies',
      description: language === 'vi' 
        ? 'Cần thiết để trang web hoạt động và không thể tắt.' 
        : 'Essential for the website to function and cannot be switched off.',
      icon: <Cookie className="h-7 w-7" />,
      delay: 0.1
    },
    {
      name: language === 'vi' ? 'Cookie phiên' : 'Session Cookies',
      description: language === 'vi' 
        ? 'Được sử dụng để theo dõi phiên duyệt web của bạn và sẽ hết hạn khi bạn đóng trình duyệt.' 
        : 'Used to track your browsing session and expire when you close your browser.',
      icon: <Clock className="h-7 w-7" />,
      delay: 0.2
    },
    {
      name: language === 'vi' ? 'Cookie tùy chọn' : 'Preference Cookies',
      description: language === 'vi' 
        ? 'Cho phép trang web ghi nhớ các lựa chọn của bạn để cung cấp trải nghiệm cá nhân hóa.' 
        : 'Allow the website to remember your choices to provide personalized features.',
      icon: <Settings2 className="h-7 w-7" />,
      delay: 0.3
    },
    {
      name: language === 'vi' ? 'Cookie phân tích' : 'Analytics Cookies',
      description: language === 'vi' 
        ? 'Giúp chúng tôi hiểu cách khách truy cập tương tác với trang web để cải thiện hiệu suất.' 
        : 'Help us understand how visitors interact with the site to improve performance.',
      icon: <ShieldCheck className="h-7 w-7" />,
      delay: 0.4
    }
  ];

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.5
      }
    })
  };

  return (
    <MainLayout>
      <div className="relative bg-beach-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/90 to-beach-800/80 z-10"></div>
          <img 
            src="/lovable-uploads/c18e6a42-2847-481c-bd63-68861f4e2423.png" 
            alt="Cookie Policy" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-16 md:py-24">
          <motion.h1 
            className="font-display text-4xl md:text-5xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === 'vi' ? 'Chính Sách Cookie' : 'Cookie Policy'}
          </motion.h1>
        </div>
      </div>
      
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              className="bg-beach-50 rounded-2xl p-8 mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cookieTypes.map((type, index) => (
                  <motion.div
                    key={index}
                    custom={type.delay}
                    variants={fadeInUpVariant}
                    className="bg-white p-6 rounded-xl shadow-sm border border-beach-100 flex"
                  >
                    <div className="bg-beach-100 p-3 rounded-lg mr-4 text-beach-600">
                      {type.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-beach-800 mb-1">
                        {type.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {type.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {language === 'vi' ? (
                <>
                  <h2 className="font-display text-2xl text-beach-800 mb-6">Cookie là gì?</h2>
                  <p className="mb-6">
                    Cookie là những tệp nhỏ được lưu trữ trên thiết bị của bạn (máy tính, máy tính bảng, điện thoại) khi bạn truy cập trang web. Chúng cho phép trang web ghi nhớ các hành động và tùy chọn của bạn (như đăng nhập, ngôn ngữ, kích thước phông chữ và các tùy chọn hiển thị khác) trong một khoảng thời gian, để bạn không cần phải nhập lại thông tin mỗi khi quay lại trang web hoặc duyệt từ trang này sang trang khác.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">Chúng tôi sử dụng cookie như thế nào?</h2>
                  <p className="mb-6">
                    Trang web của chúng tôi sử dụng cookie để phân biệt bạn với những người dùng khác. Điều này giúp chúng tôi cung cấp cho bạn trải nghiệm tốt khi bạn duyệt trang web và cũng cho phép chúng tôi cải thiện trang web. Cookie chúng tôi có thể sử dụng có thể được phân loại như sau:
                  </p>
                  
                  <Separator className="my-8" />
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">Quản lý cookie</h2>
                  <p className="mb-6">
                    Hầu hết các trình duyệt web cho phép bạn kiểm soát cookie thông qua cài đặt trình duyệt của bạn. Tuy nhiên, nếu bạn giới hạn khả năng các trang web đặt cookie, bạn có thể làm giảm trải nghiệm tổng thể của mình vì nó sẽ ảnh hưởng đến các chức năng nhất định.
                  </p>
                  
                  <p className="mb-6">
                    Để tìm hiểu thêm về cookie và cách quản lý chúng trong trình duyệt của bạn, vui lòng truy cập:
                  </p>
                  
                  <ul className="list-disc pl-6 mb-6">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-beach-600 hover:text-beach-800 flex items-center">
                        Google Chrome
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/vi/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-beach-600 hover:text-beach-800 flex items-center">
                        Mozilla Firefox
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/vi-vn/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-beach-600 hover:text-beach-800 flex items-center">
                        Internet Explorer
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/vi-vn/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-beach-600 hover:text-beach-800 flex items-center">
                        Safari
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">Thay đổi chính sách</h2>
                  <p className="mb-6">
                    Chúng tôi có thể cập nhật Chính sách cookie này theo thời gian. Chúng tôi khuyến khích bạn xem lại trang này định kỳ để biết thông tin mới nhất về cách chúng tôi sử dụng cookie.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">Liên hệ</h2>
                  <p className="mb-6">
                    Nếu bạn có bất kỳ câu hỏi nào về cách chúng tôi sử dụng cookie, vui lòng liên hệ với chúng tôi qua email tại annamvillage.vn@gmail.com hoặc qua số điện thoại +84 909 123 456.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl text-beach-800 mb-6">What Are Cookies?</h2>
                  <p className="mb-6">
                    Cookies are small files stored on your device (computer, tablet, phone) when you visit a website. They allow the website to remember your actions and preferences (such as login, language, font size, and other display preferences) over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">How We Use Cookies</h2>
                  <p className="mb-6">
                    Our website uses cookies to distinguish you from other users. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. The cookies we may use can be categorized as follows:
                  </p>
                  
                  <Separator className="my-8" />
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">Managing Cookies</h2>
                  <p className="mb-6">
                    Most web browsers allow you to control cookies through your browser settings. However, if you limit the ability of websites to set cookies, you may reduce your overall user experience, as it will impact certain functionality.
                  </p>
                  
                  <p className="mb-6">
                    To learn more about cookies and how to manage them in your browser, please visit:
                  </p>
                  
                  <ul className="list-disc pl-6 mb-6">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-beach-600 hover:text-beach-800 flex items-center">
                        Google Chrome
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-beach-600 hover:text-beach-800 flex items-center">
                        Mozilla Firefox
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-beach-600 hover:text-beach-800 flex items-center">
                        Internet Explorer
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-beach-600 hover:text-beach-800 flex items-center">
                        Safari
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">Policy Changes</h2>
                  <p className="mb-6">
                    We may update this Cookie Policy from time to time. We encourage you to periodically review this page for the latest information on our use of cookies.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">Contact Us</h2>
                  <p className="mb-6">
                    If you have any questions about how we use cookies, please contact us via email at privacy@annamvillage.vn or by phone at +84 909 123 456.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CookiePage;
