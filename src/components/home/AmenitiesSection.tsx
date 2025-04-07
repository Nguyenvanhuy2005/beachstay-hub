
import { useEffect, useState } from "react";
import { Bath, Utensils, Wifi, Coffee, Bike, LayoutGrid } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

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
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const AmenitiesSection = () => {
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();

  const amenities = [
    {
      id: 1,
      name: "Hồ bơi",
      name_en: "Swimming Pool",
      description: "Thả mình thư giãn trong làn nước mát lành, phóng tầm mắt ra khung cảnh xanh mát - nơi hồ bơi ngoài trời chan hoà nắng gió từ biển xanh.",
      description_en: "Relax in the cool water, looking out at the lush green surroundings - where the outdoor pool is bathed in sunshine and sea breezes.",
      icon: <Bath className="text-beach-600 h-6 w-6" />
    },
    {
      id: 2,
      name: "Góc bếp tiện nghi",
      name_en: "Fully-Equipped Kitchen",
      description: "Một gian bếp đủ đầy để bạn tự tay nấu nướng, pha cà phê hay bày biện bữa cơm ấm áp cùng người thân — bởi đôi khi, cảm giác \"được về nhà\" lại đến từ những điều thật giản dị.",
      description_en: "A complete kitchen where you can cook your own meals, brew coffee, or prepare a warm family dinner — because sometimes, the feeling of \"coming home\" comes from the simplest things.",
      icon: <Utensils className="text-beach-600 h-6 w-6" />
    },
    {
      id: 3,
      name: "Wifi",
      name_en: "Wifi",
      description: "Luôn kết nối dễ dàng với wifi tốc độ cao phủ khắp khu vực nghỉ ngơi - dù làm việc hay giải trí cũng đều trọn vẹn.",
      description_en: "Stay easily connected with high-speed wifi throughout the accommodation area - perfect for both work and entertainment.",
      icon: <Wifi className="text-beach-600 h-6 w-6" />
    },
    {
      id: 4,
      name: "Gợi ý ẩm thực địa phương",
      name_en: "Local Cuisine Recommendations",
      description: "AnNam luôn sẵn lòng gửi bạn các Travel Maps về những địa điểm ẩm thực & du ngoạn nội địa - từ hải sản tươi ngon đến những hàng quán lâu năm chỉ người bản xứ mới rành.",
      description_en: "AnNam is always happy to provide you with Travel Maps of local dining & sightseeing spots - from fresh seafood to long-established eateries only locals know about.",
      icon: <Coffee className="text-beach-600 h-6 w-6" />
    },
    {
      id: 5,
      name: "Cho thuê xe đạp",
      name_en: "Bicycle Rental",
      description: "Nhẹ nhàng đạp xe qua những con phố đầy nắng, nghe gió biển lùa qua vai áo — là cách chậm rãi nhất để cảm nhận Vũng Tàu.",
      description_en: "Gently cycling through sunny streets, feeling the sea breeze on your shoulders — the slowest way to experience Vung Tau.",
      icon: <Bike className="text-beach-600 h-6 w-6" />
    },
    {
      id: 6,
      name: "Không gian mở",
      name_en: "Open Space",
      description: "Một khoảng xanh đủ yên để bạn ngồi lại với chính mình. Cũng đủ thoáng để cùng bạn bè hay gia đình tụ họp, kể cho nhau nghe vài câu chuyện vội quên giữa cuộc sống thường ngày.",
      description_en: "A green space peaceful enough for self-reflection. Also spacious enough for friends and family to gather, sharing stories that are often forgotten in everyday life.",
      icon: <LayoutGrid className="text-beach-600 h-6 w-6" />
    }
  ];

  const getAmenityName = amenity => {
    return language === 'vi' ? amenity.name : amenity.name_en;
  };

  const getAmenityDescription = amenity => {
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
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('amenities_title')}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            {t('amenities_subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 animate-spin text-beach-600 border-4 border-beach-200 border-t-beach-600 rounded-full"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {amenities.map(amenity => (
              <motion.div
                key={amenity.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2
                  }
                }}
              >
                <div className="bg-beach-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  {amenity.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
                  {getAmenityName(amenity)}
                </h3>
                <p className="text-gray-700">
                  {getAmenityDescription(amenity)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AmenitiesSection;
