
import { useEffect, useState } from "react";
import { Bath, Utensils, Wifi, Smile, Bike, Coffee, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

// Icon mapping
const iconMap = {
  "Bath": Bath,
  "Utensils": Utensils,
  "Wifi": Wifi,
  "Smile": Smile,
  "Bike": Bike,
  "Coffee": Coffee
};

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
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
    transition: {
      duration: 0.5
    }
  }
};

const AmenitiesSection = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('amenities')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching amenities:', error);
          return;
        }

        if (data && data.length > 0) {
          setAmenities(data);
        } else {
          // Fallback to hardcoded data if no data in the database
          setAmenities([
            {
              id: 1,
              name: "Hồ Bơi",
              name_en: "Swimming Pool",
              description: "Thư giãn và tận hưởng làn nước mát tại hồ bơi ngoài trời với view đẹp",
              description_en: "Relax and enjoy the cool water at the outdoor swimming pool with a beautiful view",
              icon: "Bath",
            },
            {
              id: 2,
              name: "Nhà Hàng",
              name_en: "Restaurant",
              description: "Thưởng thức ẩm thực đa dạng từ các món Việt truyền thống đến quốc tế",
              description_en: "Enjoy diverse cuisine from traditional Vietnamese to international dishes",
              icon: "Utensils",
            },
            {
              id: 3,
              name: "Wifi Miễn Phí",
              name_en: "Free Wifi",
              description: "Kết nối internet tốc độ cao miễn phí trong toàn bộ khu nghỉ dưỡng",
              description_en: "Free high-speed internet throughout the resort",
              icon: "Wifi",
            },
            {
              id: 4,
              name: "Dịch Vụ Concierge",
              name_en: "Concierge Service",
              description: "Đội ngũ nhân viên chuyên nghiệp sẵn sàng hỗ trợ mọi yêu cầu của bạn",
              description_en: "Professional staff ready to assist with all your requests",
              icon: "Smile",
            },
            {
              id: 5,
              name: "Cho Thuê Xe Đạp",
              name_en: "Bicycle Rental",
              description: "Khám phá vẻ đẹp của Vũng Tàu bằng xe đạp với dịch vụ cho thuê tại chỗ",
              description_en: "Explore the beauty of Vung Tau by bicycle with on-site rental service",
              icon: "Bike",
            },
            {
              id: 6,
              name: "Quầy Bar",
              name_en: "Bar",
              description: "Thưởng thức đồ uống đa dạng tại quầy bar với không gian thoáng đãng",
              description_en: "Enjoy a variety of drinks at the bar with a spacious atmosphere",
              icon: "Coffee",
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

  const getAmenityName = (amenity) => {
    return language === 'vi' ? amenity.name : amenity.name_en;
  };

  const getAmenityDescription = (amenity) => {
    return language === 'vi' ? amenity.description : amenity.description_en;
  };

  return (
    <section className="py-20 bg-beach-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-beach-200/30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-beach-200/20 translate-x-1/3 translate-y-1/3"></div>
      
      {/* Wavy decoration */}
      <div className="absolute left-0 right-0 bottom-0 h-16 bg-beach-100/10 
                    wave-pattern z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
            {language === 'vi' ? 'Tiện Ích' : 'Amenities'}
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Dịch Vụ & Tiện Ích Đẳng Cấp' : 'Premium Services & Amenities'}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            {language === 'vi' 
              ? 'Chúng tôi cung cấp đầy đủ tiện ích và dịch vụ chất lượng cao, đảm bảo kỳ nghỉ của bạn luôn thoải mái và thư giãn.' 
              : 'We provide comprehensive amenities and high-quality services, ensuring your vacation is always comfortable and relaxing.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {amenities.map((amenity) => {
              const IconComponent = iconMap[amenity.icon] || Bath;
              
              return (
                <motion.div 
                  key={amenity.id} 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="bg-beach-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="text-beach-600 h-6 w-6" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
                    {getAmenityName(amenity)}
                  </h3>
                  <p className="text-gray-700">
                    {getAmenityDescription(amenity)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AmenitiesSection;
