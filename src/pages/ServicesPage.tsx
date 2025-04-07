
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Car, Calendar, Plane, Heart, Music, Gift, Ship, Bath, Utensils, Wifi, Bike } from 'lucide-react';
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
  
  // Amenities list based on the new content provided
  const amenities = [
    {
      icon: <Bath className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Hồ bơi' : 'Swimming Pool',
      description: language === 'vi' 
        ? 'Thả mình thư giãn trong làn nước mát lành, phóng tầm mắt ra khung cảnh xanh mát - nơi hồ bơi ngoài trời chan hoà nắng gió từ biển xanh.'
        : 'Relax in the cool water, looking out at the lush green surroundings - where the outdoor pool is bathed in sunshine and sea breezes.'
    },
    {
      icon: <Utensils className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Góc bếp tiện nghi' : 'Fully-Equipped Kitchen',
      description: language === 'vi'
        ? 'Một gian bếp đủ đầy để bạn tự tay nấu nướng, pha cà phê hay bày biện bữa cơm ấm áp cùng người thân — bởi đôi khi, cảm giác "được về nhà" lại đến từ những điều thật giản dị.'
        : 'A complete kitchen where you can cook your own meals, brew coffee, or prepare a warm family dinner — because sometimes, the feeling of "coming home" comes from the simplest things.'
    },
    {
      icon: <Wifi className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Wifi' : 'Wifi',
      description: language === 'vi'
        ? 'Luôn kết nối dễ dàng với wifi tốc độ cao phủ khắp khu vực nghỉ ngơi - dù làm việc hay giải trí cũng đều trọn vẹn.'
        : 'Stay easily connected with high-speed wifi throughout the accommodation area - perfect for both work and entertainment.'
    },
    {
      icon: <Map className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Gợi ý ẩm thực địa phương' : 'Local Cuisine Recommendations',
      description: language === 'vi'
        ? 'AnNam luôn sẵn lòng gửi bạn các Travel Maps về những địa điểm ẩm thực & du ngoạn nội địa - từ hải sản tươi ngon đến những hàng quán lâu năm chỉ người bản xứ mới rành.'
        : 'AnNam is always happy to provide you with Travel Maps of local dining & sightseeing spots - from fresh seafood to long-established eateries only locals know about.'
    },
    {
      icon: <Bike className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Cho thuê xe đạp' : 'Bicycle Rental',
      description: language === 'vi'
        ? 'Nhẹ nhàng đạp xe qua những con phố đầy nắng, nghe gió biển lùa qua vai áo — là cách chậm rãi nhất để cảm nhận Vũng Tàu.'
        : 'Gently cycling through sunny streets, feeling the sea breeze on your shoulders — the slowest way to experience Vung Tau.'
    },
    {
      icon: <Map className="h-10 w-10 text-beach-600" />,
      title: language === 'vi' ? 'Không gian mở' : 'Open Space',
      description: language === 'vi'
        ? 'Một khoảng xanh đủ yên để bạn ngồi lại với chính mình. Cũng đủ thoáng để cùng bạn bè hay gia đình tụ họp, kể cho nhau nghe vài câu chuyện vội quên giữa cuộc sống thường ngày.'
        : 'A green space peaceful enough for self-reflection. Also spacious enough for friends and family to gather, sharing stories that are often forgotten in everyday life.'
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
          <h2 className="text-3xl font-bold text-center mb-12 text-beach-900">
            {language === 'vi' ? 'Dịch Vụ Của Chúng Tôi' : 'Our Services'}
          </h2>
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow border-green-100">
                  <CardContent className="pt-6">
                    <div className="mb-4 text-green-700">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-green-800">{service.title}</h3>
                    <p className="text-green-700 mb-4">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Amenities Section */}
      <section className="py-16 md:py-24 bg-beach-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-beach-900">
            {language === 'vi' ? 'Tiện Ích Tại AnNam Village' : 'Amenities at AnNam Village'}
          </h2>
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {amenities.map((amenity, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow border-green-100">
                  <CardContent className="pt-6">
                    <div className="mb-4 text-green-700">
                      {amenity.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-green-800">{amenity.title}</h3>
                    <p className="text-green-700 mb-4">{amenity.description}</p>
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
              <Button asChild className="bg-green-700 hover:bg-green-800">
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
                src="/lovable-uploads/631e39ca-04c2-4fe6-b9f7-fee9122fb530.png" 
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
