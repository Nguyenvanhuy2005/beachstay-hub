
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, Calendar, Users, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
        
        if (!id) {
          toast.error(language === 'vi' ? 'Không tìm thấy ID phòng' : 'Room ID not found');
          setLoading(false);
          return;
        }
        
        console.log("Fetching room with ID:", id);
        
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('room_types')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching room type:', error);
          toast.error(language === 'vi' ? 'Không thể tải dữ liệu phòng' : 'Error loading room data');
          setLoading(false);
          return;
        }
        
        if (!data) {
          console.log("No room data found for ID:", id);
          toast.error(language === 'vi' ? 'Không tìm thấy loại phòng' : 'Room type not found');
          setLoading(false);
          return;
        }
        
        console.log("Room data retrieved successfully:", data);
        setRoomType(data);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error(language === 'vi' ? 'Đã xảy ra lỗi khi tải dữ liệu' : 'Error loading room data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomType();
  }, [id, language]);
  
  // Helper functions
  const getName = () => {
    return language === 'vi' ? roomType?.name : roomType?.name_en;
  };
  
  const getDescription = () => {
    return language === 'vi' ? roomType?.description : roomType?.description_en;
  };
  
  const getCapacity = () => {
    return language === 'vi' ? roomType?.capacity : roomType?.capacity_en;
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
        
        {/* Image Gallery Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-2xl font-bold mb-6 text-beach-900">
            {language === 'vi' ? 'Hình Ảnh Phòng' : 'Room Gallery'}
          </h2>
          
          <Carousel className="w-full">
            <CarouselContent>
              {roomType.gallery_images && Array.isArray(roomType.gallery_images) && roomType.gallery_images.length > 0 ? (
                roomType.gallery_images.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div className="aspect-video overflow-hidden rounded-lg border border-beach-100">
                        <img 
                          src={image} 
                          alt={`${getName()} - ${index + 1}`} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="aspect-video overflow-hidden rounded-lg border border-beach-100">
                      <img 
                        src={roomType.image_url} 
                        alt={getName()} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 bg-white" />
              <CarouselNext className="-right-4 bg-white" />
            </div>
          </Carousel>
        </motion.div>
        
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
              
              {roomType.amenities && Array.isArray(roomType.amenities) ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roomType.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2 text-beach-700">
                      <Check className="h-4 w-4 text-beach-600" />
                      <span>{typeof amenity === 'object' ? (language === 'vi' ? amenity.vi : amenity.en) : amenity}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-beach-700">
                  {language === 'vi' ? 'Không có thông tin về tiện nghi' : 'No amenities information available'}
                </p>
              )}
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
                  <p className="text-sm text-beach-600">{language === 'vi' ? 'Giá ngày thường' : 'Regular price'}</p>
                  <p className="text-lg font-bold text-beach-900">{formatPrice(roomType.price)}/{language === 'vi' ? 'đêm' : 'night'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-beach-600">{language === 'vi' ? 'Giá cuối tuần/lễ' : 'Weekend/holiday price'}</p>
                  <p className="text-lg font-bold text-beach-900">{formatPrice(roomType.weekend_price || roomType.price)}/{language === 'vi' ? 'đêm' : 'night'}</p>
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
