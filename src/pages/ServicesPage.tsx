
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Utensils, Car, Plane, Heart, Music, Gift, Ship, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const services = [
    {
      icon: <Map className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Travel Maps & Gợi Ý Địa Phương' : 'Travel Maps & Local Tips',
      description: language === 'vi' ? 'Khám phá Vũng Tàu qua những địa điểm ẩm thực và du lịch độc đáo với bản đồ Travel Maps đặc biệt từ AnNam Village.' : 'Explore Vung Tau through unique dining and tourism spots with special Travel Maps from AnNam Village.'
    },
    {
      icon: <Car className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Dịch Vụ Đưa Đón' : 'Transfer Services',
      description: language === 'vi' ? 'Dịch vụ đưa đón sân bay và di chuyển trong thành phố bằng xe sang trọng, thoải mái.' : 'Airport pickup and city transportation services with luxurious, comfortable vehicles.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Tổ Chức Sự Kiện' : 'Event Organization',
      description: language === 'vi' ? 'Tổ chức các sự kiện đặc biệt như hội nghị, tiệc cưới và sinh nhật với không gian linh hoạt và dịch vụ chuyên nghiệp.' : 'Organize special events such as conferences, weddings and birthdays with flexible spaces and professional services.'
    },
    {
      icon: <Plane className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Dịch Vụ Tour Du Lịch' : 'Tour Services',
      description: language === 'vi' ? 'Khám phá Vũng Tàu và vùng lân cận với các tour được thiết kế riêng, có hướng dẫn viên chuyên nghiệp.' : 'Explore Vung Tau and surrounding areas with custom-designed tours, with professional guides.'
    },
    {
      icon: <Heart className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Dịch Vụ Spa & Làm Đẹp' : 'Spa & Beauty Services',
      description: language === 'vi' ? 'Thư giãn và làm mới bản thân với các liệu pháp spa và dịch vụ làm đẹp cao cấp.' : 'Relax and rejuvenate with premium spa therapies and beauty services.'
    },
    {
      icon: <Music className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Giải Trí' : 'Entertainment',
      description: language === 'vi' ? 'Tận hưởng các buổi biểu diễn âm nhạc sống, đêm nhạc Jazz và các hoạt động giải trí hàng đêm.' : 'Enjoy live music performances, Jazz nights and nightly entertainment activities.'
    },
    {
      icon: <Gift className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Dịch Vụ Đặc Biệt' : 'Special Services',
      description: language === 'vi' ? 'Tạo kỷ niệm đáng nhớ với các dịch vụ đặc biệt như tiệc riêng trên bãi biển, giỏ quà và trang trí phòng.' : 'Create memorable memories with special services such as private beach parties, gift baskets and room decorations.'
    },
    {
      icon: <Ship className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Thể Thao Biển' : 'Water Sports',
      description: language === 'vi' ? 'Cung cấp dịch vụ cho thuê thiết bị và hướng dẫn các hoạt động thể thao biển như lướt ván, chèo thuyền kayak.' : 'Provide equipment rental services and guide water sports activities such as surfing, kayaking.'
    }
  ];
  
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img src="/lovable-uploads/cdfb47b1-e949-44cc-85b1-de98fba2961e.png" alt="Services" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            {language === 'vi' ? 'Dịch Vụ' : 'Services'}
          </motion.h1>
          <motion.p 
            className="text-beach-100 max-w-3xl text-lg mb-8" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {language === 'vi' ? 'Khám phá các dịch vụ cao cấp tại An Nam Village, được thiết kế để nâng tầm trải nghiệm kỳ nghỉ của bạn.' : 'Explore premium services at An Nam Village, designed to elevate your vacation experience.'}
          </motion.p>
        </div>
      </div>
      
      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-beach-900">{service.title}</h3>
                    <p className="text-beach-700 mb-4">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Travel Maps Highlight Section */}
      <section className="py-16 md:py-24 bg-beach-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.7 }} 
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold mb-6 text-beach-900">
                {language === 'vi' ? 'Travel Maps Ăn Uống & Khám Phá Địa Phương' : 'Local Food & Exploration Travel Maps'}
              </h2>
              <p className="text-beach-800 mb-4">
                {language === 'vi' ? 'Tại AnNam Village, chúng tôi luôn sẵn lòng gửi tặng bạn những phiên bản Travel Maps đặc biệt: gợi ý các địa điểm ẩm thực và khám phá nội địa, từ quán hải sản tươi ngon ven biển đến những hàng quán lâu đời chỉ người bản xứ mới biết.' : 'At AnNam Village, we are always happy to provide you with special Travel Maps: recommendations for local cuisine and exploration spots, from fresh seafood restaurants by the beach to long-established eateries that only locals know about.'}
              </p>
              <p className="text-beach-800 mb-6">
                {language === 'vi' ? 'Một hành trình trọn vẹn không chỉ dừng lại ở nơi lưu trú, mà còn là những trải nghiệm địa phương khó quên trên từng bước chân khám phá.' : 'A complete journey doesn\'t just stop at your accommodation, but includes unforgettable local experiences with every step of exploration.'}
              </p>
              <Button asChild>
                <Link to="/lien-he">
                  {language === 'vi' ? 'Nhận Travel Maps Ngay' : 'Get Travel Maps Now'}
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.7 }} 
              viewport={{ once: true }}
            >
              <img 
                src="/lovable-uploads/cdfb47b1-e949-44cc-85b1-de98fba2961e.png" 
                alt={language === 'vi' ? 'Travel Maps' : 'Travel Maps'} 
                className="rounded-lg shadow-xl w-full h-auto object-cover" 
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-beach-700 text-white bg-[#012801]">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className="font-display text-3xl md:text-4xl font-bold mb-6"
          >
            {language === 'vi' ? 'Cần Hỗ Trợ Thêm?' : 'Need More Assistance?'}
          </motion.h2>
          <motion.p 
            className="text-beach-100 max-w-2xl mx-auto mb-8 text-lg" 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.2 }}
          >
            {language === 'vi' ? 'Hãy liên hệ với đội ngũ dịch vụ khách hàng của chúng tôi để được hỗ trợ đặt dịch vụ hoặc giải đáp thắc mắc.' : 'Please contact our customer service team for assistance with booking services or answering questions.'}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.4 }}
          >
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-beach-700"
            >
              <Link to="/lien-he">
                {language === 'vi' ? 'Liên Hệ Ngay' : 'Contact Now'}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ServicesPage;
