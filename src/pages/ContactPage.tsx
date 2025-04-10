import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, MapPin, Phone, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GoogleMap from '@/components/map/GoogleMap';
import LocationStructuredData from '@/components/seo/LocationStructuredData';

const ContactPage = () => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const GOOGLE_MAPS_API_KEY = "AIzaSyCWZ8Qqf4TN2PILN26A1nztzZxQEv1oB98";

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

  // Location data for both UI and structured data
  const locationData = {
    name: "AnNam Village",
    description: isEnglish 
      ? "Luxury resort villas and apartments for rent in Vung Tau."
      : "Khu nghỉ dưỡng cao cấp với villa và căn hộ cho thuê tại Vũng Tàu.",
    address: {
      street: "131 Nguyễn Thị Minh Khai",
      locality: "Phường 8",
      region: "Vũng Tàu",
      country: "Vietnam",
      province: "Bà Rịa - Vũng Tàu"
    },
    fullAddress: "131 Đường Nguyễn Thị Minh Khai, Phường 8, Vũng Tàu, Bà Rịa - Vũng Tàu",
    coordinates: {
      latitude: 10.347041,
      longitude: 107.083180
    },
    phone: "+84933669154",
    email: "annamvillage.vn@gmail.com",
    image: "/lovable-uploads/6e6d4cbd-20c4-41bc-9ecd-453019a0c8df.png",
    url: "https://annamvillage.com"
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: isEnglish ? "Address" : "Địa chỉ",
      content: locationData.fullAddress,
      link: `https://maps.google.com/maps?q=${locationData.coordinates.latitude},${locationData.coordinates.longitude}`,
      action: isEnglish ? "View on Maps" : "Xem trên bản đồ"
    },
    {
      icon: <Phone className="h-10 w-10 text-primary" />,
      title: "WhatsApp",
      content: "+84 93 366 91 54",
      link: "https://wa.me/84933669154",
      action: isEnglish ? "Chat on WhatsApp" : "Chat qua WhatsApp"
    },
    {
      icon: <AtSign className="h-10 w-10 text-primary" />,
      title: "Email",
      content: locationData.email,
      link: `mailto:${locationData.email}`,
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
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.06-.976.044-1.504.207-1.857.344-.463.182-.8.398-1.15.748-.35.35-.566.687-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.054-.06 1.37-.06 4.04 0 2.67.01 2.986.06 4.04.044.976.207 1.504.344 1.857.182.463.398.8.748 1.15.35.35.687.566 1.15.748.353.137.882.3 1.857.344 1.054.047 1.37.06 4.04.06zm0 3.063A5.135 5.135 0 1 1 12 17.135 5.135 5.135 0 0 1 12 6.865zm0 8.468A3.333 3.333 0 1 0 12 8.667a3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
      </svg>,
      link: "https://www.instagram.com/a.nvillage_official/",
    }
  ];

  return (
    <MainLayout>
      {/* SEO structured data */}
      <LocationStructuredData 
        name={locationData.name}
        description={locationData.description}
        address={{
          street: locationData.address.street,
          locality: locationData.address.locality,
          region: locationData.address.region,
          country: locationData.address.country
        }}
        coordinates={locationData.coordinates}
        phone={locationData.phone}
        email={locationData.email}
        image={locationData.image}
        url={locationData.url}
      />

      <div className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
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
                  className="bg-neutral p-6 rounded-xl shadow-md text-center flex flex-col items-center"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  custom={index}
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-primary text-primary hover:bg-secondary"
                  >
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.action}
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Google Map Component with proper HTML5 semantics for SEO */}
            <motion.section 
              className="mb-12 bg-white p-4 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              aria-labelledby="location-heading"
            >
              <h2 id="location-heading" className="text-2xl font-bold text-center mb-6 text-primary">
                {isEnglish ? "Find Us" : "Tìm Chúng Tôi"}
              </h2>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <GoogleMap 
                  apiKey={GOOGLE_MAPS_API_KEY} 
                  height="450px"
                  width="100%"
                  lat={locationData.coordinates.latitude}
                  lng={locationData.coordinates.longitude}
                  address={locationData.fullAddress}
                />
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                {isEnglish ? "Click on the pin for directions" : "Nhấp vào ghim để được chỉ đường"}
              </div>
            </motion.section>

            <motion.div 
              className="bg-neutral p-8 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-primary">
                {isEnglish ? "Follow Us" : "Theo Dõi Chúng Tôi"}
              </h2>
              
              <div className="flex flex-wrap justify-center gap-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-background hover:bg-secondary p-4 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-primary">{social.icon}</span>
                    <span className="font-medium">{social.name}</span>
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  asChild
                  className="bg-primary hover:bg-green-800"
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
