
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bath, Wifi, Coffee, Utensils, Map, Dumbbell, Ship, Shirt } from 'lucide-react';

const AmenitiesPage = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('amenities')
          .select('*');
        
        if (error) {
          console.error('Error fetching amenities:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setAmenities(data);
        } else {
          // Fallback to hardcoded data
          setAmenities([
            {
              id: '1',
              name: 'Hồ Bơi Vô Cực',
              name_en: 'Infinity Pool',
              description: 'Hồ bơi vô cực với tầm nhìn ra biển, nơi bạn có thể thư giãn và tận hưởng khung cảnh tuyệt đẹp của đại dương.',
              description_en: 'Infinity pool with ocean views, where you can relax and enjoy the beautiful seascape.',
              icon: 'Bath'
            },
            {
              id: '2',
              name: 'WiFi Miễn Phí',
              name_en: 'Free WiFi',
              description: 'Kết nối internet tốc độ cao miễn phí trong toàn bộ khu nghỉ dưỡng.',
              description_en: 'Free high-speed internet connection throughout the resort.',
              icon: 'Wifi'
            },
            {
              id: '3',
              name: 'Nhà Hàng',
              name_en: 'Restaurant',
              description: 'Nhà hàng phục vụ ẩm thực Việt Nam và quốc tế, sử dụng nguyên liệu tươi ngon từ địa phương.',
              description_en: 'Restaurant serving Vietnamese and international cuisine, using fresh local ingredients.',
              icon: 'Utensils'
            },
            {
              id: '4',
              name: 'Quầy Bar & Cà Phê',
              name_en: 'Bar & Cafe',
              description: 'Quầy bar ven biển và cà phê, nơi lý tưởng để thưởng thức đồ uống và ngắm hoàng hôn.',
              description_en: 'Beachside bar and cafe, the perfect place to enjoy drinks and watch the sunset.',
              icon: 'Coffee'
            },
            {
              id: '5',
              name: 'Tour & Hoạt Động',
              name_en: 'Tours & Activities',
              description: 'Các tour tham quan và hoạt động thú vị do đội ngũ chuyên nghiệp của chúng tôi tổ chức.',
              description_en: 'Exciting tours and activities organized by our professional team.',
              icon: 'Map'
            },
            {
              id: '6',
              name: 'Phòng Tập Gym',
              name_en: 'Fitness Center',
              description: 'Phòng tập gym hiện đại với đầy đủ thiết bị để duy trì lịch tập luyện của bạn trong kỳ nghỉ.',
              description_en: 'Modern fitness center with complete equipment to maintain your workout routine during your vacation.',
              icon: 'Dumbbell'
            },
            {
              id: '7',
              name: 'Thể Thao Biển',
              name_en: 'Water Sports',
              description: 'Các hoạt động thể thao biển như lướt ván, chèo thuyền kayak và lặn biển.',
              description_en: 'Water sports activities such as surfing, kayaking and snorkeling.',
              icon: 'Ship'
            },
            {
              id: '8',
              name: 'Dịch Vụ Giặt Ủi',
              name_en: 'Laundry Service',
              description: 'Dịch vụ giặt ủi chuyên nghiệp giúp quần áo của bạn luôn sạch sẽ và thơm tho.',
              description_en: 'Professional laundry service to keep your clothes clean and fresh.',
              icon: 'Shirt'
            },
          ]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAmenities();
  }, []);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Bath': return <Bath className="h-10 w-10 text-beach-600" />;
      case 'Wifi': return <Wifi className="h-10 w-10 text-beach-600" />;
      case 'Coffee': return <Coffee className="h-10 w-10 text-beach-600" />;
      case 'Utensils': return <Utensils className="h-10 w-10 text-beach-600" />;
      case 'Map': return <Map className="h-10 w-10 text-beach-600" />;
      case 'Dumbbell': return <Dumbbell className="h-10 w-10 text-beach-600" />;
      case 'Ship': return <Ship className="h-10 w-10 text-beach-600" />;
      case 'Shirt': return <Shirt className="h-10 w-10 text-beach-600" />;
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
              ? 'Khám phá những tiện ích độc đáo tại Annam Village, nơi mọi chi tiết đều được thiết kế để mang đến trải nghiệm nghỉ dưỡng tuyệt vời nhất cho bạn.'
              : 'Discover unique amenities at Annam Village, where every detail is designed to bring you the best resort experience.'}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
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
                  {language === 'vi' ? 'Hồ Bơi & Bãi Biển' : 'Pool & Beach'}
                </h3>
                <p className="text-beach-700 mb-1">
                  {language === 'vi' ? 'Hàng ngày: 6:00 - 22:00' : 'Daily: 6:00 AM - 10:00 PM'}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-beach-100">
                <h3 className="font-bold text-lg mb-3 text-beach-900">
                  {language === 'vi' ? 'Nhà Hàng' : 'Restaurant'}
                </h3>
                <p className="text-beach-700 mb-1">
                  {language === 'vi' ? 'Bữa sáng: 6:30 - 10:30' : 'Breakfast: 6:30 AM - 10:30 AM'}
                </p>
                <p className="text-beach-700 mb-1">
                  {language === 'vi' ? 'Bữa trưa: 12:00 - 14:30' : 'Lunch: 12:00 PM - 2:30 PM'}
                </p>
                <p className="text-beach-700">
                  {language === 'vi' ? 'Bữa tối: 18:00 - 22:00' : 'Dinner: 6:00 PM - 10:00 PM'}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-beach-100">
                <h3 className="font-bold text-lg mb-3 text-beach-900">
                  {language === 'vi' ? 'Quầy Bar' : 'Bar'}
                </h3>
                <p className="text-beach-700 mb-1">
                  {language === 'vi' ? 'Hàng ngày: 10:00 - 23:00' : 'Daily: 10:00 AM - 11:00 PM'}
                </p>
                <p className="text-beach-700">
                  {language === 'vi' ? 'Happy Hour: 17:00 - 19:00' : 'Happy Hour: 5:00 PM - 7:00 PM'}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-beach-100">
                <h3 className="font-bold text-lg mb-3 text-beach-900">
                  {language === 'vi' ? 'Phòng Tập Gym' : 'Fitness Center'}
                </h3>
                <p className="text-beach-700 mb-1">
                  {language === 'vi' ? 'Hàng ngày: 6:00 - 21:00' : 'Daily: 6:00 AM - 9:00 PM'}
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
