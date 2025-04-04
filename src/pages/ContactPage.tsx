
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, MapPin, Phone, AtSign, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-10 w-10 text-terra-600" />,
      title: isEnglish ? "Address" : "Địa chỉ",
      content: "234 Phan Chu Trinh, Phường 2, Vũng Tàu, Vietnam",
      link: "https://maps.app.goo.gl/12345",
      action: isEnglish ? "View on Maps" : "Xem trên bản đồ"
    },
    {
      icon: <Phone className="h-10 w-10 text-terra-600" />,
      title: "WhatsApp",
      content: "+84 93 366 91 54",
      link: "https://wa.me/84933669154",
      action: isEnglish ? "Chat on WhatsApp" : "Chat qua WhatsApp"
    },
    {
      icon: <AtSign className="h-10 w-10 text-terra-600" />,
      title: "Email",
      content: "annamvillage.vn@gmail.com",
      link: "mailto:annamvillage.vn@gmail.com",
      action: isEnglish ? "Send Email" : "Gửi Email"
    }
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      link: "https://www.facebook.com/907345029447516",
    },
    {
      name: "TikTok",
      icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>,
      link: "https://www.tiktok.com/@annamvillage",
    },
    {
      name: "Instagram",
      icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.06-.976.044-1.504.207-1.857.344-.463.182-.8.398-1.15.748-.35.35-.566.687-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.054-.06 1.37-.06 4.04 0 2.67.01 2.986.06 4.04.044.976.207 1.504.344 1.857.182.463.398.8.748 1.15.35.35.687.566 1.15.748.353.137.882.3 1.857.344 1.054.047 1.37.06 4.04.06 2.67 0 2.986-.01 4.04-.06.976-.044 1.504-.207 1.857-.344.463-.182.8-.398 1.15-.748.35-.35.566-.687.748-1.15.137-.353.3-.882.344-1.857.047-1.054.06-1.37.06-4.04 0-2.67-.01-2.986-.06-4.04-.044-.976-.207-1.504-.344-1.857-.182-.463-.398-.8-.748-1.15-.35-.35-.687-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.054-.047-1.37-.06-4.04-.06zm0 3.063A5.135 5.135 0 1 1 12 17.135 5.135 5.135 0 0 1 12 6.865zm0 8.468A3.333 3.333 0 1 0 12 8.667a3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
      </svg>,
      link: "https://www.instagram.com/a.nvillage_official/",
    }
  ];

  return (
    <MainLayout>
      <div className="bg-beach-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                {isEnglish ? "Contact Us" : "Liên Hệ Với Chúng Tôi"}
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {isEnglish
                  ? "We'd love to hear from you! Get in touch with our team through any of the channels below."
                  : "Chúng tôi rất mong nhận được phản hồi từ bạn! Liên hệ với đội ngũ của chúng tôi qua các kênh dưới đây."}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md text-center flex flex-col items-center"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  custom={index}
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-terra-500 text-terra-600 hover:bg-terra-50"
                  >
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.action}
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                {isEnglish ? "Follow Us" : "Theo Dõi Chúng Tôi"}
              </h2>
              
              <div className="flex flex-wrap justify-center gap-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-terra-600">{social.icon}</span>
                    <span className="font-medium">{social.name}</span>
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  asChild
                  className="bg-terra-600 hover:bg-terra-700"
                >
                  <Link to="/dat-phong">
                    {isEnglish ? "Book Your Stay Now" : "Đặt Phòng Ngay"}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
