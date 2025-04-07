
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, FileText, Users, BellRing } from 'lucide-react';

const PrivacyPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const iconProps = {
    className: "h-8 w-8 text-beach-600 mb-4",
  };

  return (
    <MainLayout>
      <div className="relative bg-beach-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/90 to-beach-800/80 z-10"></div>
          <img 
            src="/lovable-uploads/c18e6a42-2847-481c-bd63-68861f4e2423.png" 
            alt="Privacy Policy" 
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
            {language === 'vi' ? 'Chính Sách Bảo Mật' : 'Privacy Policy'}
          </motion.h1>
        </div>
      </div>
      
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div 
                className="bg-beach-50 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Shield {...iconProps} />
                <h3 className="font-display text-xl text-beach-800 mb-2">
                  {language === 'vi' ? 'Bảo Vệ Dữ Liệu' : 'Data Protection'}
                </h3>
                <p className="text-gray-700">
                  {language === 'vi' 
                    ? 'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và tuân thủ các quy định bảo vệ dữ liệu.' 
                    : 'We are committed to protecting your personal information and complying with data protection regulations.'}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-beach-50 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Lock {...iconProps} />
                <h3 className="font-display text-xl text-beach-800 mb-2">
                  {language === 'vi' ? 'Bảo Mật Thông Tin' : 'Information Security'}
                </h3>
                <p className="text-gray-700">
                  {language === 'vi' 
                    ? 'Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn khỏi truy cập trái phép.' 
                    : 'We use advanced security measures to protect your information from unauthorized access.'}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-beach-50 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Eye {...iconProps} />
                <h3 className="font-display text-xl text-beach-800 mb-2">
                  {language === 'vi' ? 'Minh Bạch' : 'Transparency'}
                </h3>
                <p className="text-gray-700">
                  {language === 'vi' 
                    ? 'Chúng tôi minh bạch về cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.' 
                    : 'We are transparent about how we collect, use, and protect your data.'}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-beach-50 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Server {...iconProps} />
                <h3 className="font-display text-xl text-beach-800 mb-2">
                  {language === 'vi' ? 'Lưu Trữ An Toàn' : 'Secure Storage'}
                </h3>
                <p className="text-gray-700">
                  {language === 'vi' 
                    ? 'Dữ liệu của bạn được lưu trữ an toàn trên các máy chủ bảo mật với các biện pháp mã hóa hiện đại.' 
                    : 'Your data is stored securely on protected servers with modern encryption measures.'}
                </p>
              </motion.div>
            </div>
            
            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {language === 'vi' ? (
                <>
                  <h2 className="font-display text-2xl text-beach-800 mb-6">1. Thu thập thông tin</h2>
                  <p className="mb-6">
                    An Nam Village thu thập thông tin cá nhân như tên, địa chỉ email, số điện thoại và thông tin thanh toán khi bạn đặt phòng hoặc đăng ký nhận thông tin từ chúng tôi. Chúng tôi cũng có thể thu thập thông tin về cách bạn sử dụng trang web của chúng tôi thông qua cookie và công nghệ tương tự.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">2. Sử dụng thông tin</h2>
                  <p className="mb-6">
                    Chúng tôi sử dụng thông tin của bạn để:
                  </p>
                  <ul className="list-disc pl-6 mb-6">
                    <li>Xử lý và xác nhận đặt phòng của bạn</li>
                    <li>Cung cấp dịch vụ khách hàng và hỗ trợ</li>
                    <li>Gửi thông tin về các ưu đãi và sự kiện đặc biệt (nếu bạn đồng ý)</li>
                    <li>Cải thiện trải nghiệm trang web và dịch vụ của chúng tôi</li>
                    <li>Tuân thủ các nghĩa vụ pháp lý</li>
                  </ul>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">3. Chia sẻ thông tin</h2>
                  <p className="mb-6">
                    Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. Tuy nhiên, chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:
                  </p>
                  <ul className="list-disc pl-6 mb-6">
                    <li>Với các nhà cung cấp dịch vụ hỗ trợ hoạt động của chúng tôi (như xử lý thanh toán)</li>
                    <li>Khi cần thiết để tuân thủ pháp luật hoặc bảo vệ quyền lợi của chúng tôi</li>
                    <li>Trong trường hợp sáp nhập, mua lại hoặc bán tài sản (với sự bảo vệ thích hợp)</li>
                  </ul>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">4. Quyền của bạn</h2>
                  <p className="mb-6">
                    Bạn có quyền:
                  </p>
                  <ul className="list-disc pl-6 mb-6">
                    <li>Truy cập thông tin cá nhân của bạn mà chúng tôi lưu giữ</li>
                    <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
                    <li>Yêu cầu xóa thông tin của bạn (trong một số trường hợp nhất định)</li>
                    <li>Từ chối nhận thông tin tiếp thị từ chúng tôi</li>
                    <li>Gửi khiếu nại đến cơ quan bảo vệ dữ liệu nếu bạn không hài lòng với cách chúng tôi xử lý thông tin của bạn</li>
                  </ul>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">5. Thay đổi chính sách</h2>
                  <p className="mb-6">
                    Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Bất kỳ thay đổi nào sẽ được đăng trên trang này và, nếu thay đổi đáng kể, chúng tôi sẽ thông báo cho bạn qua email hoặc thông báo trên trang web của chúng tôi.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">6. Liên hệ</h2>
                  <p className="mb-6">
                    Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật của chúng tôi hoặc cách chúng tôi xử lý thông tin của bạn, vui lòng liên hệ với chúng tôi qua email tại privacy@An Namvillage.vn hoặc qua số điện thoại +84 909 123 456.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl text-beach-800 mb-6">1. Information Collection</h2>
                  <p className="mb-6">
                    An Nam Village collects personal information such as your name, email address, phone number, and payment information when you make a reservation or sign up to receive information from us. We may also collect information about how you use our website through cookies and similar technologies.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">2. Use of Information</h2>
                  <p className="mb-6">
                    We use your information to:
                  </p>
                  <ul className="list-disc pl-6 mb-6">
                    <li>Process and confirm your reservations</li>
                    <li>Provide customer service and support</li>
                    <li>Send you information about special offers and events (if you consent)</li>
                    <li>Improve our website experience and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">3. Information Sharing</h2>
                  <p className="mb-6">
                    We do not sell or rent your personal information to third parties. However, we may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 mb-6">
                    <li>With service providers who support our operations (such as payment processors)</li>
                    <li>When necessary to comply with the law or protect our rights</li>
                    <li>In the event of a merger, acquisition, or sale of assets (with appropriate safeguards)</li>
                  </ul>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">4. Your Rights</h2>
                  <p className="mb-6">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 mb-6">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your information (in certain circumstances)</li>
                    <li>Opt-out of marketing communications from us</li>
                    <li>Lodge a complaint with a data protection authority if you're dissatisfied with how we handle your information</li>
                  </ul>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">5. Policy Changes</h2>
                  <p className="mb-6">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page and, if the changes are significant, we will notify you via email or by a notice on our website.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">6. Contact Us</h2>
                  <p className="mb-6">
                    If you have any questions about our Privacy Policy or how we handle your information, please contact us via email at privacy@An Namvillage.vn or by phone at +84 909 123 456.
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

export default PrivacyPage;
