import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Wifi, Coffee, Bath, Tv, Loader2, Car, Umbrella, Ban, Plane, LifeBuoy, UtensilsCrossed, ShowerHead, Bed, FlameKindling, Refrigerator, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import AnimationWrapper from "@/components/utils/AnimationWrapper";
import { useToast } from "@/hooks/use-toast";

const fallbackRooms = [{
  id: "fallback-1",
  name: "Deluxe Pool Villa",
  name_en: "Deluxe Pool Villa",
  description: "Villa sang trọng với hồ bơi riêng, phòng khách rộng rãi và tầm nhìn ra biển tuyệt đẹp.",
  description_en: "Luxurious villa with private pool, spacious living room and beautiful sea views.",
  capacity: "4 người lớn, 2 trẻ em",
  capacity_en: "4 adults, 2 children",
  price: 15000000,
  weekend_price: 20000000,
  image_url: "/lovable-uploads/447ed5f1-0675-492c-8437-bb1fdf09ab86.png",
  amenities: [{
    id: "wifi",
    vi: "WiFi miễn phí",
    en: "Free WiFi"
  }, {
    id: "pool",
    vi: "Hồ bơi riêng",
    en: "Private pool"
  }, {
    id: "air_con",
    vi: "Điều hòa",
    en: "Air conditioning"
  }, {
    id: "tv",
    vi: "TV màn hình phẳng",
    en: "Flat-screen TV"
  }, {
    id: "bath",
    vi: "Bồn tắm",
    en: "Bathtub"
  }],
  is_popular: true
}, {
  id: "fallback-2",
  name: "Garden View Suite",
  name_en: "Garden View Suite",
  description: "Phòng suite rộng rãi hướng vườn với ban công riêng và khu vực tiếp khách sang trọng.",
  description_en: "Spacious garden view suite with private balcony and elegant living area.",
  capacity: "2 người lớn, 1 trẻ em",
  capacity_en: "2 adults, 1 child",
  price: 8000000,
  weekend_price: 12000000,
  image_url: "/lovable-uploads/3de4ca25-b7f7-4567-8e8a-de3b9ef3e8ab.png",
  amenities: [{
    id: "wifi",
    vi: "WiFi miễn phí",
    en: "Free WiFi"
  }, {
    id: "tv",
    vi: "TV màn hình phẳng",
    en: "Flat-screen TV"
  }, {
    id: "coffee",
    vi: "Máy pha cà phê",
    en: "Coffee maker"
  }, {
    id: "minibar",
    vi: "Minibar",
    en: "Minibar"
  }, {
    id: "bath",
    vi: "Bồn tắm",
    en: "Bathtub"
  }],
  is_popular: true
}, {
  id: "fallback-3",
  name: "Ocean View Bungalow",
  name_en: "Ocean View Bungalow",
  description: "Bungalow sang trọng với tầm nhìn ra biển, sân hiên riêng và lối đi trực tiếp ra bãi biển.",
  description_en: "Luxurious bungalow with ocean views, private terrace and direct beach access.",
  capacity: "2 người lớn",
  capacity_en: "2 adults",
  price: 12000000,
  weekend_price: 18000000,
  image_url: "/lovable-uploads/842f894d-4d09-4b7b-9de4-e68c7d1e2e30.png",
  amenities: [{
    id: "wifi",
    vi: "WiFi miễn phí",
    en: "Free WiFi"
  }, {
    id: "tv",
    vi: "TV màn hình phẳng",
    en: "Flat-screen TV"
  }, {
    id: "bath",
    vi: "Bồn tắm",
    en: "Bathtub"
  }, {
    id: "coffee",
    vi: "Máy pha cà phê",
    en: "Coffee maker"
  }, {
    id: "private_beach",
    vi: "Lối ra biển riêng",
    en: "Private beach access"
  }],
  is_popular: true
}];

const iconMap: Record<string, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  tv: <Tv size={14} />,
  bath: <Bath size={14} />,
  coffee: <Coffee size={14} />,
  air_con: <Umbrella size={14} />,
  minibar: <Refrigerator size={14} />,
  safe: <Refrigerator size={14} />,
  desk: <Refrigerator size={14} />,
  room_service: <UtensilsCrossed size={14} />,
  toiletries: <ShowerHead size={14} />,
  pool: <LifeBuoy size={14} />,
  parking: <Car size={14} />,
  family_room: <Bed size={14} />,
  airport_shuttle: <Plane size={14} />,
  non_smoking: <Ban size={14} />,
  bbq: <FlameKindling size={14} />,
  private_beach: <Umbrella size={14} />
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
  hidden: {
    opacity: 0,
    y: 30
  },
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
  const [error, setError] = useState(false);
  const { language } = useLanguage();
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const isSaturday = today.getDay() === 6; // 6 is Saturday
  const { toast: uiToast } = useToast();

  const retryFetch = async () => {
    setLoading(true);
    setError(false);
    fetchRoomTypes();
  };

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      console.log('Fetching room types for homepage...');

      const {
        data: popularRooms,
        error: popularError
      } = await supabase.from('room_types').select('*').eq('is_popular', true).order('price', {
        ascending: false
      });
      if (popularError) {
        console.error('Error fetching popular room types:', popularError);
        toast.error(language === 'vi' ? 'Không thể tải dữ liệu phòng nổi bật' : 'Error loading popular rooms');

        if (popularError.message.includes('fetch') || popularError.code === 'NETWORK_ERROR') {
          console.log('Using fallback data due to network error');
          setRoomTypes(fallbackRooms);
          setError(true);
          return;
        }
        setRoomTypes([]);
        setError(true);
        return;
      }
      let featuredRooms = popularRooms || [];
      console.log('Fetched popular rooms:', featuredRooms.length);

      if (featuredRooms.length < 3) {
        const {
          data: otherRooms,
          error: otherError
        } = await supabase.from('room_types').select('*').eq('is_popular', false).order('price', {
          ascending: false
        }).limit(3 - featuredRooms.length);
        if (!otherError && otherRooms) {
          console.log('Fetched additional rooms:', otherRooms.length);
          featuredRooms = [...featuredRooms, ...otherRooms];
        }
      }

      if (featuredRooms.length === 0) {
        console.log('No rooms found, using fallback data');
        setRoomTypes(fallbackRooms);
        setError(true);
        return;
      }

      featuredRooms = featuredRooms.slice(0, 3);
      console.log('Total rooms for homepage:', featuredRooms.length);
      setRoomTypes(featuredRooms);
      setError(false);

      if (featuredRooms.length > 0) {
        const roomIds = featuredRooms.map(room => room.id);
        const {
          data: todayPrices,
          error: pricesError
        } = await supabase.from('room_date_prices').select('room_type_id, price').eq('date', todayStr).in('room_type_id', roomIds);
        if (!pricesError && todayPrices) {
          const pricesMap: Record<string, number> = {};
          todayPrices.forEach(item => {
            pricesMap[item.room_type_id] = item.price;
          });
          setCustomPrices(pricesMap);
        }
      }
    } catch (error) {
      console.error('Error in fetchRoomTypes:', error);
      toast.error(language === 'vi' ? 'Đã xảy ra lỗi khi tải dữ liệu' : 'Error loading data');

      setRoomTypes(fallbackRooms);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, [language, todayStr]);

  const getRoomPrice = (room) => {
    if (customPrices[room.id]) {
      return customPrices[room.id];
    }
    return isSaturday ? room.weekend_price || room.price : room.price;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getRoomName = (room) => {
    return language === 'vi' ? room.name : room.name_en;
  };

  const getRoomDescription = (room) => {
    if (room.short_description && language === 'vi') {
      return room.short_description;
    }
    
    if (room.short_description_en && language === 'en') {
      return room.short_description_en;
    }
    
    const fullDescription = language === 'vi' ? room.description : room.description_en;
    if (fullDescription && fullDescription.length > 120) {
      return fullDescription.substring(0, 120) + '...';
    }
    
    return fullDescription;
  };

  const getRoomCapacity = (room) => {
    return language === 'vi' ? room.capacity : room.capacity_en;
  };

  const getAmenityName = (amenity) => {
    if (typeof amenity === 'string') {
      return amenity;
    }
    return language === 'vi' ? amenity.vi : amenity.en;
  };

  const getAmenityIcon = (amenity) => {
    if (typeof amenity === 'string') {
      return iconMap[amenity] || <Coffee size={14} />;
    }
    const amenityText = language === 'vi' ? amenity.vi : amenity.en;
    const knownAmenity = Object.keys(iconMap).find(key => amenityText.toLowerCase().includes(key.toLowerCase()));
    return knownAmenity ? iconMap[knownAmenity] : <Coffee size={14} />;
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-beach-50/50 to-transparent z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 h-40 ocean-wave z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <AnimationWrapper direction="up" duration={0.8} once={true}>
          <div className="text-center mb-12">
            <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
              {language === 'vi' ? 'Loại Phòng' : 'Room Types'}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'vi' ? 'Hãy Chọn Một Nơi Nghỉ… Vừa Đủ Để Bạn An Yên' : 'Choose A Place To Stay… Just Enough For Your Peace Of Mind'}
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              {language === 'vi' ? 'AnNam có “trọn” các lựa chọn cho bạn và những người thân yêu để chuyến đi thêm “vẹn” tròn hơn' : 'AnNam has the perfect choices for you and your loved ones to make your trip even more complete: A peaceful bedroom by the sound of ocean waves… A villa that holds its own mini forest ecosystem… A space where children can run and play on the grass… Or a quiet corner to share heartfelt conversations together…  In the end, the choice of room matters less than this: Which moments do you want to keep for your holiday?'}
            </p>
          </div>
        </AnimationWrapper>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="text-red-600 mb-4">
              {language === 'vi' ? 'Không thể tải dữ liệu phòng từ máy chủ.' : 'Unable to load room data from server.'}
            </p>
            <Button variant="outline" onClick={retryFetch} className="mb-4 bg-beach-50 border-beach-200 text-beach-700 hover:bg-beach-100">
              {language === 'vi' ? 'Thử lại' : 'Try Again'}
            </Button>
            
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8" variants={containerVariants} initial="hidden" animate="visible">
              {roomTypes.map(room => (
                <motion.div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow" variants={itemVariants}>
                  <div className="relative">
                    <img src={room.image_url} alt={getRoomName(room)} className="w-full h-60 object-cover" onError={e => {
                      e.currentTarget.src = "/placeholder.svg";
                    }} />
                    {room.is_popular && (
                      <Badge className="absolute top-4 right-4 bg-coral-500 bg-[#24490f]">
                        {language === 'vi' ? 'Phổ biến' : 'Popular'}
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
                      {getRoomName(room)}
                    </h3>
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {getRoomDescription(room)}
                    </p>
                    <div className="flex items-center mb-4">
                      <Users size={18} className="text-beach-600 mr-2" />
                      <span className="text-gray-600 text-sm">{getRoomCapacity(room)}</span>
                    </div>
                    {room.amenities && Array.isArray(room.amenities) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.amenities.slice(0, 5).map((amenity, index) => {
                          const amenityName = getAmenityName(amenity);
                          const amenityIcon = getAmenityIcon(amenity);
                          return (
                            <span key={index} className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {amenityIcon && <span className="mr-1">{amenityIcon}</span>}
                              {amenityName}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-6">
                      <div>
                        <span className="text-beach-700 font-bold text-xl">
                          {formatPrice(getRoomPrice(room))}đ
                        </span>
                        <span className="text-gray-500 text-sm"> / {language === 'vi' ? 'đêm' : 'night'}</span>
                        {isSaturday && !customPrices[room.id] && (
                          <span className="text-orange-500 text-xs block mt-1">
                            {language === 'vi' ? 'Giá cuối tuần (Thứ 7)' : 'Weekend price (Saturday)'}
                          </span>
                        )}
                        {customPrices[room.id] && (
                          <span className="text-blue-500 text-xs block mt-1">
                            {language === 'vi' ? 'Giá đặc biệt' : 'Special price'}
                          </span>
                        )}
                      </div>
                      <Link to={`/loai-phong/${room.id}`}>
                        <Button className="rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors">
                          {language === 'vi' ? 'Chi Tiết' : 'Details'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-beach-700">
              {language === 'vi' ? 'Chưa có loại phòng nào.' : 'No room types available yet.'}
            </p>
            <Button asChild className="mt-4 bg-beach-600 hover:bg-beach-700 text-white">
              <Link to="/loai-phong">
                {language === 'vi' ? 'Xem Tất Cả Loại Phòng' : 'View All Room Types'} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
            {roomTypes.map(room => (
              <motion.div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow" variants={itemVariants}>
                <div className="relative">
                  <img src={room.image_url} alt={getRoomName(room)} className="w-full h-60 object-cover" onError={e => {
                    e.currentTarget.src = "/placeholder.svg";
                  }} />
                  {room.is_popular && (
                    <Badge className="absolute top-4 right-4 bg-coral-500 bg-[#24490f]">
                      {language === 'vi' ? 'Phổ biến' : 'Popular'}
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
                    {getRoomName(room)}
                  </h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {getRoomDescription(room)}
                  </p>
                  <div className="flex items-center mb-4">
                    <Users size={18} className="text-beach-600 mr-2" />
                    <span className="text-gray-600 text-sm">{getRoomCapacity(room)}</span>
                  </div>
                  {room.amenities && Array.isArray(room.amenities) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 5).map((amenity, index) => {
                        const amenityName = getAmenityName(amenity);
                        const amenityIcon = getAmenityIcon(amenity);
                        return (
                          <span key={index} className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {amenityIcon && <span className="mr-1">{amenityIcon}</span>}
                            {amenityName}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <span className="text-beach-700 font-bold text-xl">
                        {formatPrice(getRoomPrice(room))}đ
                      </span>
                      <span className="text-gray-500 text-sm"> / {language === 'vi' ? 'đêm' : 'night'}</span>
                      {isSaturday && !customPrices[room.id] && (
                        <span className="text-orange-500 text-xs block mt-1">
                          {language === 'vi' ? 'Giá cuối tuần (Thứ 7)' : 'Weekend price (Saturday)'}
                        </span>
                      )}
                      {customPrices[room.id] && (
                        <span className="text-blue-500 text-xs block mt-1">
                          {language === 'vi' ? 'Giá đặc biệt' : 'Special price'}
                        </span>
                      )}
                    </div>
                    <Link to={`/loai-phong/${room.id}`}>
                      <Button className="rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors">
                        {language === 'vi' ? 'Chi Tiết' : 'Details'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimationWrapper direction="up" delay={0.3} once={true}>
          <div className="text-center mt-12 bg-[#275101]">
            <Button asChild className="bg-beach-600 hover:bg-beach-700 text-white px-8 py-6">
              <Link to="/loai-phong">
                {language === 'vi' ? 'Xem Tất Cả Loại Phòng' : 'View All Room Types'} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
};

export default RoomTypesSection;
