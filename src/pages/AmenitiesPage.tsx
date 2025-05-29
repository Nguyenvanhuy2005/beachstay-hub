
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bath, Wifi, Coffee, Utensils, LayoutGrid } from 'lucide-react';

const AmenitiesPage = () => {
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const amenities = [
    {
      id: '1',
      name: 'Hồ bơi',
      name_en: 'Swimming Pool',
      description: 'Thả mình thư giãn trong làn nước mát lành, phóng tầm mắt ra khung cảnh xanh mát - nơi hồ bơi ngoài trời chan hoà nắng gió từ biển xanh.',
      description_en: 'Relax in the cool water, looking out at the lush green surroundings - where the outdoor pool is bathed in sunshine and sea breezes.',
      icon: 'Bath'
    },
    {
      id: '2',
      name: 'Góc bếp tiện nghi',
      name_en: 'Fully-Equipped Kitchen',
      description: 'Một gian bếp đủ đầy để bạn tự tay nấu nướng, pha cà phê hay bày biện bữa cơm ấm áp cùng người thân — bởi đôi khi, cảm giác "được về nhà" lại đến từ những điều thật giản dị.',
      description_en: 'A complete kitchen where you can cook your own meals, brew coffee, or prepare a warm family dinner — because sometimes, the feeling of "coming home" comes from the simplest things.',
      icon: 'Utensils'
    },
    {
      id: '3',
      name: 'WiFi Miễn Phí',
      name_en: 'Free WiFi',
      description: 'Luôn kết nối dễ dàng với wifi tốc độ cao phủ khắp khu vực nghỉ ngơi - dù làm việc hay giải trí cũng đều trọn vẹn.',
      description_en: 'Stay easily connected with high-speed wifi throughout the accommodation area - perfect for both work and entertainment.',
      icon: 'Wifi'
    },
    {
      id: '4',
      name: 'Gợi ý ẩm thực địa phương',
      name_en: 'Local Cuisine Recommendations',
      description: 'AnNam luôn sẵn lòng gửi bạn các Travel Maps về những địa điểm ẩm thực & du ngoạn nội địa - từ hải sản tươi ngon đến những hàng quán lâu năm chỉ người bản xứ mới rành.',
      description_en: 'AnNam is always happy to provide you with Travel Maps of local dining & sightseeing spots - from fresh seafood to long-established eateries only locals know about.',
      icon: 'Coffee'
    },
    {
      id: '5',
      name: 'Không gian mở',
      name_en: 'Open Space',
      description: 'Một khoảng xanh đủ yên để bạn ngồi lại với chính mình. Cũng đủ thoáng để cùng bạn bè hay gia đình tụ họp, kể cho nhau nghe vài câu chuyện vội quên giữa cuộc sống thường ngày.',
      description_en: 'A green space peaceful enough for self-reflection. Also spacious enough for friends and family to gather, sharing stories that are often forgotten in everyday life.',
      icon: 'LayoutGrid'
    }
  ];

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Bath': return <Bath className="h-10 w-10 text-beach-600" />;
      case 'Wifi': return <Wifi className="h-10 w-10 text-beach-600" />;
      case 'Coffee': return <Coffee className="h-10 w-10 text-beach-600" />;
      case 'Utensils': return <Utensils className="h-10 w-10 text-beach-600" />;
      case 'LayoutGrid': return <LayoutGrid className="h-10 w-10 text-beach-600" />;
      default: return <Bath className="h-10 w-10 text-beach-600" />;
    }
  };
  
  const getName = (amenity) => {
    return language === 'vi' ? amenity.name : amenity.name_en;
  };
  
  const getDescription = (amenity) => {
    return language === 'vi' ? amenity.description : amenity.description_en;
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img 
            src="/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png" 
            alt="Amenities" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <motion.h1 
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === 'vi' ? 'Tiện Ích' : 'Amenities'}
          </motion.h1>
          <motion.p 
            className="text-beach-100 max-w-3xl text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {language === 'vi' 
              ? 'Luôn chăm chút từng trải nghiệm nhỏ nhặt, để mỗi khoảnh khắc tại AnNam đều trở nên dễ chịu và trọn vẹn nhất với du khách.'
              : 'Always attentive to every small experience, making each moment at AnNam pleasant and complete for our guests.'}
          </motion.p>
        </div>
      </div>
      
      {/* Amenities Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {amenities.map((amenity) => (
              <motion.div
                key={amenity.id}
                variants={itemVariants}
                className="bg-white p-8 rounded-lg shadow-md border border-beach-100 hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  {getIconComponent(amenity.icon)}
                </div>
                <h3 className="text-xl font-bold mb-3 text-beach-900">{getName(amenity)}</h3>
                <p className="text-beach-700">{getDescription(amenity)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Additional Information */}
      <section className="py-16 md:py-24 bg-beach-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="font-serif text-3xl font-bold mb-6 text-beach-900"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {language === 'vi' ? 'Giờ Phục Vụ' : 'Service Hours'}
            </motion.h2>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-6 rounded-lg shadow-md border border-beach-100">
                <h3 className="font-bold text-lg mb-3 text-beach-900">
                  {language === 'vi' ? 'Hồ Bơi' : 'Pool'}
                </h3>
                <p className="text-beach-700 mb-1">
                  {language === 'vi' ? 'Hàng ngày: 6:00 - 22:00' : 'Daily: 6:00 AM - 10:00 PM'}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-beach-100">
                <h3 className="font-bold text-lg mb-3 text-beach-900">
                  {language === 'vi' ? 'Gợi ý ẩm thực' : 'Food Recommendations'}
                </h3>
                <p className="text-beach-700 mb-1">
                  {language === 'vi' ? 'Có sẵn Travel Maps' : 'Travel Maps Available'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AmenitiesPage;
