
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Wifi, Coffee, Bath, Tv, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const iconMap = {
  "Wifi miễn phí": <Wifi size={14} />,
  "Free Wifi": <Wifi size={14} />,
  "Bếp đầy đủ": <Coffee size={14} />,
  "Full Kitchen": <Coffee size={14} />,
  "Bồn tắm": <Bath size={14} />,
  "Bathtub": <Bath size={14} />,
  "Smart TV": <Tv size={14} />,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const RoomTypesSection = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('room_types')
          .select('*')
          .order('price', { ascending: false });

        if (error) {
          console.error('Error fetching room types:', error);
          return;
        }

        if (data && data.length > 0) {
          setRoomTypes(data);
        } else {
          // Fallback to hardcoded data if no data in the database
          setRoomTypes([
            {
              id: 1,
              name: "Villa Hồ Bơi Riêng",
              name_en: "Private Pool Villa",
              image_url: "/lovable-uploads/21668da3-408e-4c55-845e-d0812b05e091.png",
              description: "Villa 2 phòng ngủ với hồ bơi riêng, không gian rộng rãi và đầy đủ tiện nghi hiện đại.",
              description_en: "2 bedroom villa with private pool, spacious and fully equipped with modern amenities.",
              capacity: "4 người lớn, 2 trẻ em",
              capacity_en: "4 adults, 2 children",
              price: 3500000,
              amenities: [
                { vi: "Hồ bơi riêng", en: "Private pool" }, 
                { vi: "Wifi miễn phí", en: "Free Wifi" }, 
                { vi: "Bếp đầy đủ", en: "Full Kitchen" }, 
                { vi: "Dịch vụ dọn phòng", en: "Housekeeping" }, 
                { vi: "Smart TV", en: "Smart TV" }
              ],
              is_popular: true,
            },
            {
              id: 2,
              name: "Căn Hộ Hướng Biển",
              name_en: "Sea View Apartment",
              image_url: "/lovable-uploads/dd828878-82ae-4104-959b-b8793c180d89.png",
              description: "Căn hộ với view biển tuyệt đẹp, thiết kế hiện đại và không gian thoáng đãng.",
              description_en: "Apartment with beautiful sea views, modern design and spacious atmosphere.",
              capacity: "2 người lớn, 1 trẻ em",
              capacity_en: "2 adults, 1 child",
              price: 1800000,
              amenities: [
                { vi: "View biển", en: "Sea view" }, 
                { vi: "Wifi miễn phí", en: "Free Wifi" }, 
                { vi: "Bàn làm việc", en: "Work desk" }, 
                { vi: "Dịch vụ dọn phòng", en: "Housekeeping" }, 
                { vi: "Smart TV", en: "Smart TV" }
              ],
              is_popular: false,
            },
            {
              id: 3,
              name: "Phòng Deluxe",
              name_en: "Deluxe Room",
              image_url: "/lovable-uploads/ff2fe940-82b8-4f88-a56c-eeaea2c86b0c.png",
              description: "Phòng nghỉ sang trọng với nội thất cao cấp, view đẹp và tiện nghi đầy đủ.",
              description_en: "Luxurious room with premium furnishings, beautiful views and full amenities.",
              capacity: "2 người lớn",
              capacity_en: "2 adults",
              price: 1200000,
              amenities: [
                { vi: "Bồn tắm", en: "Bathtub" }, 
                { vi: "Wifi miễn phí", en: "Free Wifi" }, 
                { vi: "Minibar", en: "Minibar" }, 
                { vi: "Dịch vụ dọn phòng", en: "Housekeeping" }, 
                { vi: "Smart TV", en: "Smart TV" }
              ],
              is_popular: false,
            },
          ]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getRoomName = (room) => {
    return language === 'vi' ? room.name : room.name_en;
  };

  const getRoomDescription = (room) => {
    return language === 'vi' ? room.description : room.description_en;
  };

  const getRoomCapacity = (room) => {
    return language === 'vi' ? room.capacity : room.capacity_en;
  };

  const getAmenityName = (amenity) => {
    return language === 'vi' ? amenity.vi : amenity.en;
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Ocean wave effect background */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-beach-50/50 to-transparent z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 h-40 ocean-wave z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
            {language === 'vi' ? 'Loại Phòng' : 'Room Types'}
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Lựa Chọn Phòng Nghỉ Lý Tưởng' : 'Choose Your Ideal Accommodation'}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            {language === 'vi' 
              ? 'Annam Village cung cấp đa dạng loại phòng nghỉ sang trọng, từ Villa với hồ bơi riêng đến căn hộ hướng biển, đáp ứng mọi nhu cầu của bạn.'
              : 'Annam Village offers a variety of luxurious accommodations, from Villas with private pools to sea-view apartments, meeting all your needs.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {roomTypes.map((room) => (
              <motion.div 
                key={room.id} 
                className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                variants={itemVariants}
              >
                <div className="relative">
                  <img 
                    src={room.image_url} 
                    alt={getRoomName(room)} 
                    className="w-full h-60 object-cover"
                  />
                  {room.is_popular && (
                    <Badge className="absolute top-4 right-4 bg-coral-500">
                      {language === 'vi' ? 'Phổ biến' : 'Popular'}
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
                    {getRoomName(room)}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {getRoomDescription(room)}
                  </p>
                  <div className="flex items-center mb-4">
                    <Users size={18} className="text-beach-600 mr-2" />
                    <span className="text-gray-600 text-sm">{getRoomCapacity(room)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.map((amenity, index) => {
                      const amenityName = getAmenityName(amenity);
                      const IconComponent = iconMap[amenityName];
                      
                      return (
                        <span 
                          key={index}
                          className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {IconComponent && <span className="mr-1">{IconComponent}</span>}
                          {amenityName}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <span className="text-beach-700 font-bold text-xl">
                        {formatPrice(room.price)}đ
                      </span>
                      <span className="text-gray-500 text-sm"> / {language === 'vi' ? 'đêm' : 'night'}</span>
                    </div>
                    <Link to={`/loai-phong/${room.id}`}>
                      <Button variant="outline" className="border-beach-500 text-beach-700 hover:bg-beach-50">
                        {language === 'vi' ? 'Chi Tiết' : 'Details'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Button asChild className="bg-beach-600 hover:bg-beach-700 text-white px-8 py-6">
            <Link to="/loai-phong">
              {language === 'vi' ? 'Xem Tất Cả Loại Phòng' : 'View All Room Types'} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoomTypesSection;
