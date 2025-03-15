
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, Calendar, Users, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const RoomDetailPage = () => {
  const { id } = useParams();
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchRoomType = async () => {
      try {
        setLoading(true);
        
        if (id) {
          // First try to fetch from the local list if not a UUID
          if (!isValidUUID(id)) {
            // Get the hardcoded room data
            const hardcodedRoom = getHardcodedRoomData(id);
            if (hardcodedRoom) {
              setRoomType(hardcodedRoom);
              setLoading(false);
              return;
            }
          }
          
          // Try to fetch from Supabase if it might be a UUID
          try {
            const { data, error } = await supabase
              .from('room_types')
              .select('*')
              .eq('id', id)
              .single();
            
            if (error) {
              console.error('Error fetching room type:', error);
              // Fall back to hardcoded data
              setRoomType(getFallbackRoom(id));
              return;
            }
            
            if (data) {
              setRoomType(data);
              return;
            }
          } catch (error) {
            console.error('Supabase query error:', error);
          }
          
          // If we got here, we need to use fallback data
          setRoomType(getFallbackRoom(id));
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error(language === 'vi' ? 'Đã xảy ra lỗi khi tải dữ liệu' : 'Error loading room data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomType();
  }, [id, language]);
  
  // Helper function to check if a string is a valid UUID
  const isValidUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };
  
  // Get hardcoded room data by numeric ID
  const getHardcodedRoomData = (roomId) => {
    const rooms = [
      {
        id: '1',
        name: 'Phòng Deluxe Hướng Biển',
        name_en: 'Deluxe Ocean View Room',
        description: 'Phòng Deluxe Hướng Biển rộng rãi với tầm nhìn tuyệt đẹp ra đại dương. Phòng được thiết kế hiện đại, thoáng mát với ban công riêng, nơi bạn có thể thưởng thức ánh bình minh và hoàng hôn tuyệt đẹp trên biển. Phòng được trang bị đầy đủ tiện nghi cao cấp, từ TV màn hình phẳng, minibar đến phòng tắm sang trọng với bồn tắm và vòi sen riêng biệt.',
        description_en: 'Spacious Deluxe Ocean View Room with a breathtaking view of the ocean. The room is designed in a modern, airy style with a private balcony where you can enjoy beautiful sunrises and sunsets over the sea. The room is fully equipped with premium amenities, from a flat-screen TV, minibar to a luxurious bathroom with separate bathtub and shower.',
        capacity: '2 người lớn, 1 trẻ em',
        capacity_en: '2 adults, 1 child',
        price: 2500000,
        image_url: '/lovable-uploads/3de4ca25-b7f7-4567-8e8a-de3b9ef3e8ab.png',
        amenities: [
          'Wifi miễn phí',
          'Điều hòa',
          'TV màn hình phẳng',
          'Minibar',
          'Két an toàn',
          'Bồn tắm',
          'Ban công riêng',
          'Đồ vệ sinh cá nhân cao cấp',
          'Dịch vụ phòng 24/7',
        ],
        is_popular: true
      },
      {
        id: '2',
        name: 'Căn Hộ Hướng Biển',
        name_en: 'Sea View Apartment',
        description: 'Căn hộ sang trọng với view biển tuyệt đẹp, thiết kế hiện đại và không gian thoáng đãng. Căn hộ được trang bị đầy đủ tiện nghi cao cấp bao gồm bếp đầy đủ, khu vực ăn uống và phòng khách riêng biệt, lý tưởng cho kỳ nghỉ dài ngày hay cho gia đình.',
        description_en: 'Luxurious apartment with stunning sea views, modern design and spacious atmosphere. The apartment is fully equipped with premium amenities including a full kitchen, dining area and separate living room, ideal for long stays or families.',
        capacity: '2 người lớn, 2 trẻ em',
        capacity_en: '2 adults, 2 children',
        price: 3800000,
        image_url: '/lovable-uploads/dd828878-82ae-4104-959b-b8793c180d89.png',
        amenities: [
          'Wifi miễn phí',
          'Điều hòa',
          'Bếp đầy đủ',
          'TV màn hình phẳng',
          'Ban công riêng',
          'Két an toàn',
          'Máy giặt',
          'Khu vực ăn uống',
          'Phòng khách riêng',
          'Dịch vụ phòng 24/7',
        ],
        is_popular: true
      },
      {
        id: '3',
        name: 'Villa Hồ Bơi Riêng',
        name_en: 'Private Pool Villa',
        description: 'Villa sang trọng với hồ bơi riêng, không gian rộng rãi và đầy đủ tiện nghi cao cấp. Villa có 2 phòng ngủ riêng biệt, phòng khách và khu vực ăn uống rộng rãi, bếp đầy đủ và sân vườn riêng, lý tưởng cho gia đình hoặc nhóm bạn bè.',
        description_en: 'Luxurious villa with private pool, spacious and fully equipped with premium amenities. The villa has 2 separate bedrooms, a spacious living and dining area, full kitchen and private garden, ideal for families or groups of friends.',
        capacity: '4 người lớn, 2 trẻ em',
        capacity_en: '4 adults, 2 children',
        price: 7500000,
        image_url: '/lovable-uploads/21668da3-408e-4c55-845e-d0812b05e091.png',
        amenities: [
          'Hồ bơi riêng',
          'Wifi miễn phí',
          'Điều hòa',
          'Bếp đầy đủ',
          'TV màn hình phẳng',
          'Két an toàn',
          'Máy giặt',
          'Sân vườn riêng',
          'BBQ',
          'Dịch vụ quản gia',
          'Dịch vụ phòng 24/7',
        ],
        is_popular: true
      },
      {
        id: '4',
        name: 'Phòng Superior',
        name_en: 'Superior Room',
        description: 'Phòng Superior trang nhã với tầm nhìn ra vườn, đầy đủ tiện nghi hiện đại và không gian thoải mái. Phòng được thiết kế tinh tế kết hợp giữa phong cách hiện đại và truyền thống, tạo nên không gian nghỉ dưỡng ấm cúng.',
        description_en: 'Elegant Superior Room with garden view, modern amenities, and comfortable space. The room is designed with a subtle blend of modern and traditional styles, creating a cozy retreat.',
        capacity: '2 người lớn',
        capacity_en: '2 adults',
        price: 1800000,
        image_url: '/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png',
        amenities: [
          'Wifi miễn phí',
          'Điều hòa',
          'TV màn hình phẳng',
          'Minibar',
          'Két an toàn',
          'Phòng tắm riêng',
          'Đồ vệ sinh cá nhân cao cấp',
          'Dịch vụ phòng 24/7',
        ],
        is_popular: false
      }
    ];
    
    return rooms.find(room => room.id === roomId);
  };
  
  // Fallback room data
  const getFallbackRoom = (roomId) => {
    // Try to get from hardcoded data first
    const hardcodedRoom = getHardcodedRoomData(roomId);
    if (hardcodedRoom) {
      return hardcodedRoom;
    }
    
    // Default fallback
    return {
      id: roomId || '1',
      name: 'Phòng Deluxe Hướng Biển',
      name_en: 'Deluxe Ocean View Room',
      description: 'Phòng Deluxe Hướng Biển rộng rãi với tầm nhìn tuyệt đẹp ra đại dương. Phòng được thiết kế hiện đại, thoáng mát với ban công riêng, nơi bạn có thể thưởng thức ánh bình minh và hoàng hôn tuyệt đẹp trên biển.',
      description_en: 'Spacious Deluxe Ocean View Room with a breathtaking view of the ocean. The room is designed in a modern, airy style with a private balcony where you can enjoy beautiful sunrises and sunsets over the sea.',
      capacity: '2 người lớn, 1 trẻ em',
      capacity_en: '2 adults, 1 child',
      price: 2500000,
      image_url: '/lovable-uploads/3de4ca25-b7f7-4567-8e8a-de3b9ef3e8ab.png',
      amenities: [
        'Wifi miễn phí',
        'Điều hòa',
        'TV màn hình phẳng',
        'Minibar',
        'Két an toàn',
        'Bồn tắm',
        'Ban công riêng',
        'Đồ vệ sinh cá nhân cao cấp',
        'Dịch vụ phòng 24/7',
      ],
      is_popular: true
    };
  };
  
  // Helper functions
  const getName = () => {
    return language === 'vi' ? roomType.name : roomType.name_en;
  };
  
  const getDescription = () => {
    return language === 'vi' ? roomType.description : roomType.description_en;
  };
  
  const getCapacity = () => {
    return language === 'vi' ? roomType.capacity : roomType.capacity_en;
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: language === 'vi' ? 'VND' : 'USD',
      maximumFractionDigits: 0,
    }).format(language === 'vi' ? price : Math.round(price / 23000));
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
        </div>
      </MainLayout>
    );
  }
  
  if (!roomType) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4 text-gray-900">
            {language === 'vi' ? 'Không Tìm Thấy Loại Phòng' : 'Room Type Not Found'}
          </h1>
          <p className="text-gray-700 mb-8">
            {language === 'vi' 
              ? 'Loại phòng bạn đang tìm kiếm không tồn tại hoặc đã được gỡ bỏ.'
              : 'The room type you are looking for does not exist or has been removed.'}
          </p>
          <Button asChild className="rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors">
            <Link to="/loai-phong">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Xem Tất Cả Loại Phòng' : 'View All Room Types'}
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="relative h-80 md:h-96 bg-beach-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/70 to-beach-900/90 z-10"></div>
          <img 
            src={roomType.image_url} 
            alt={getName()} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <motion.h1 
              className="font-serif text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getName()}
            </motion.h1>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className="bg-beach-600">{formatPrice(roomType.price)}/{language === 'vi' ? 'đêm' : 'night'}</Badge>
              <Badge variant="outline" className="border-beach-300 text-beach-50">
                <Users className="h-3 w-3 mr-1" />
                {getCapacity()}
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Room Details */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <Button asChild className="rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors">
            <Link to="/loai-phong">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Tất Cả Loại Phòng' : 'All Room Types'}
            </Link>
          </Button>
          <Button asChild className="bg-beach-600 hover:bg-beach-700 text-white">
            <Link to="/dat-phong">
              <Calendar className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Đặt Phòng Ngay' : 'Book Now'}
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-2xl font-bold mb-6 text-beach-900">{language === 'vi' ? 'Mô Tả' : 'Description'}</h2>
            <p className="text-beach-800 leading-relaxed mb-8">{getDescription()}</p>
            
            <div>
              <h3 className="font-serif text-xl font-bold mb-4 text-beach-900">{language === 'vi' ? 'Tiện Nghi Phòng' : 'Room Amenities'}</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roomType.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center gap-2 text-beach-700">
                    <Check className="h-4 w-4 text-beach-600" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-beach-50 p-6 rounded-lg border border-beach-100 sticky top-24">
              <h3 className="font-serif text-xl font-bold mb-4 text-beach-900">{language === 'vi' ? 'Tóm Tắt' : 'Summary'}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-beach-600">{language === 'vi' ? 'Giá' : 'Price'}</p>
                  <p className="text-lg font-bold text-beach-900">{formatPrice(roomType.price)}/{language === 'vi' ? 'đêm' : 'night'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-beach-600">{language === 'vi' ? 'Sức Chứa' : 'Capacity'}</p>
                  <p className="text-lg text-beach-900">{getCapacity()}</p>
                </div>
                
                <Separator className="bg-beach-200" />
                
                <div>
                  <p className="text-sm text-beach-600 mb-2">{language === 'vi' ? 'Bao Gồm' : 'Includes'}</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-beach-700">
                      <Check className="h-4 w-4 text-beach-600" />
                      <span>{language === 'vi' ? 'Bữa sáng miễn phí' : 'Free breakfast'}</span>
                    </li>
                    <li className="flex gap-2 text-beach-700">
                      <Check className="h-4 w-4 text-beach-600" />
                      <span>{language === 'vi' ? 'Wifi miễn phí' : 'Free Wifi'}</span>
                    </li>
                    <li className="flex gap-2 text-beach-700">
                      <Check className="h-4 w-4 text-beach-600" />
                      <span>{language === 'vi' ? 'Hủy phòng miễn phí trước 3 ngày' : 'Free cancellation before 3 days'}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <Button asChild className="w-full bg-beach-600 hover:bg-beach-700 text-white">
                <Link to="/dat-phong">
                  {language === 'vi' ? 'Đặt Phòng Ngay' : 'Book Now'}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RoomDetailPage;
