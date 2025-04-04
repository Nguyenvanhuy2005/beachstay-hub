import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, Calendar, Users, Check, MapPin, ExternalLink, X, Maximize2, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
const RoomDetailPage = () => {
  const {
    id
  } = useParams();
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    language
  } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
        const {
          data,
          error
        } = await supabase.from('room_types').select('*').eq('id', id).maybeSingle();
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
  const getName = () => {
    return language === 'vi' ? roomType?.name : roomType?.name_en;
  };
  const getDescription = () => {
    return language === 'vi' ? roomType?.description : roomType?.description_en;
  };
  const getCapacity = () => {
    return language === 'vi' ? roomType?.capacity : roomType?.capacity_en;
  };
  const getAddress = () => {
    return language === 'vi' ? roomType?.address : roomType?.address_en;
  };
  const getGoogleMapsUrl = () => {
    const address = encodeURIComponent(getAddress() || '');
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };
  const formatPrice = price => {
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: language === 'vi' ? 'VND' : 'USD',
      maximumFractionDigits: 0
    }).format(language === 'vi' ? price : Math.round(price / 23000));
  };
  const getAllImages = () => {
    if (!roomType) return [];
    const allImages = [];
    if (roomType.image_url) {
      allImages.push(roomType.image_url);
    }
    if (roomType.gallery_images && Array.isArray(roomType.gallery_images) && roomType.gallery_images.length > 0) {
      allImages.push(...roomType.gallery_images);
    }
    return [...new Set(allImages)];
  };
  const images = getAllImages();
  const openLightbox = index => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  const goToNextImage = e => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };
  const goToPrevImage = e => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };
  const handleKeyDown = e => {
    if (e.key === 'ArrowRight') goToNextImage(e);
    if (e.key === 'ArrowLeft') goToPrevImage(e);
    if (e.key === 'Escape') closeLightbox();
  };
  if (loading) {
    return <MainLayout>
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
        </div>
      </MainLayout>;
  }
  if (!roomType) {
    return <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4 text-gray-900">
            {language === 'vi' ? 'Không Tìm Thấy Loại Phòng' : 'Room Type Not Found'}
          </h1>
          <p className="text-gray-700 mb-8">
            {language === 'vi' ? 'Loại phòng bạn đang tìm kiếm không tồn tại hoặc đã được gỡ bỏ.' : 'The room type you are looking for does not exist or has been removed.'}
          </p>
          <Button asChild className="rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors">
            <Link to="/loai-phong">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Xem Tất Cả Loại Phòng' : 'View All Room Types'}
            </Link>
          </Button>
        </div>
      </MainLayout>;
  }
  return <MainLayout>
      <div className="relative h-80 md:h-96 bg-beach-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/70 to-beach-900/90 z-10"></div>
          <img src={roomType.image_url} alt={getName()} className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="font-display text-4xl md:text-5xl font-bold mb-4">
              {getName()}
            </motion.h1>
            <motion.div className="flex flex-wrap items-center gap-2 mb-2" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>
              <Badge className="bg-beach-600">{formatPrice(roomType.price)}/{language === 'vi' ? 'đêm' : 'night'}</Badge>
              <Badge variant="outline" className="border-beach-300 text-beach-50">
                <Users className="h-3 w-3 mr-1" />
                {getCapacity()}
              </Badge>
            </motion.div>
            
            {getAddress() && <motion.a href={getGoogleMapsUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center text-beach-100 hover:text-beach-50 group transition-colors" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }}>
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{getAddress()}</span>
                <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="">
          <Button asChild className="rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors">
            <Link to="/loai-phong">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Tất Cả Loại Phòng' : 'All Room Types'}
            </Link>
          </Button>
          <Button asChild className="bg-beach-600 hover:bg-beach-700 text-white">
            
          </Button>
        </div>
        
        <motion.div className="mb-12" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
          <h2 className="font-display text-2xl font-bold mb-6 text-beach-900 py-[10px]">
            {language === 'vi' ? 'Hình Ảnh Phòng' : 'Room Gallery'}
          </h2>
          
          <div className="hidden md:block">
            {images.length > 0 ? <div className="grid grid-cols-2 gap-2 h-[450px]">
                <div className="h-full" onClick={() => openLightbox(0)}>
                  <div className="h-full w-full relative group cursor-pointer overflow-hidden rounded-lg border border-beach-100">
                    <img src={images[0]} alt={`${getName()} - 1`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 p-3 rounded-full">
                        <Maximize2 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-rows-2 grid-cols-2 gap-2 h-full">
                  {images.slice(1, 4).map((image, index) => <div key={index + 1} className="relative group cursor-pointer h-full w-full overflow-hidden rounded-lg border border-beach-100" onClick={() => openLightbox(index + 1)}>
                      <img src={image} alt={`${getName()} - ${index + 2}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 p-2 rounded-full">
                          <Maximize2 className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>)}

                  {images.length > 4 && <div className="relative group cursor-pointer h-full w-full overflow-hidden rounded-lg border border-beach-100" onClick={() => openLightbox(4)}>
                      <img src={images[4]} alt={`${getName()} - 5`} className="h-full w-full object-cover brightness-50" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <Maximize2 className="h-5 w-5 mb-1" />
                        <span className="font-medium text-sm">
                          {language === 'vi' ? `Xem tất cả ${images.length} ảnh` : `View all ${images.length} photos`}
                        </span>
                      </div>
                    </div>}
                  
                  {images.length <= 4 && images.length > 3 && <div className="relative group cursor-pointer h-full w-full overflow-hidden rounded-lg border border-beach-100" onClick={() => openLightbox(3)}>
                      <img src={images[3]} alt={`${getName()} - 4`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 p-2 rounded-full">
                          <Maximize2 className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>}
                </div>
              </div> : <div className="aspect-[2/1] flex items-center justify-center bg-gray-100 rounded-lg border border-beach-100">
                <p className="text-gray-500 italic">
                  {language === 'vi' ? 'Không có hình ảnh' : 'No images available'}
                </p>
              </div>}
          </div>
          
          <div className="md:hidden w-full">
            <Carousel className="w-full">
              <CarouselContent>
                {images.length > 0 ? images.slice(0, 4).map((image, index) => <CarouselItem key={index} className="basis-full">
                      <div className="p-1">
                        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border border-beach-100 relative" onClick={() => openLightbox(index)}>
                          <img src={image} alt={`${getName()} - ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center">
                            <Maximize2 className="h-4 w-4" />
                          </div>
                        </AspectRatio>
                      </div>
                    </CarouselItem>) : <CarouselItem className="basis-full">
                    <div className="p-1">
                      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border border-beach-100 flex items-center justify-center bg-gray-100">
                        <p className="text-gray-500 italic">
                          {language === 'vi' ? 'Không có hình ảnh' : 'No images available'}
                        </p>
                      </AspectRatio>
                    </div>
                  </CarouselItem>}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-4 bg-white" />
                <CarouselNext className="-right-4 bg-white" />
              </div>
            </Carousel>
            
            {images.length > 1 && <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => openLightbox(0)} className="border border-beach-300 hover:bg-beach-50 text-beach-800">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  {language === 'vi' ? `Xem tất cả ${images.length} ảnh` : `View all ${images.length} photos`}
                </Button>
              </div>}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div className="lg:col-span-2" initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="font-display text-2xl font-bold mb-6 text-beach-900">{language === 'vi' ? 'Mô Tả' : 'Description'}</h2>
            <p className="text-beach-800 leading-relaxed mb-8">{getDescription()}</p>
            
            {getAddress() && <div className="mb-8">
                <h3 className="font-display text-xl font-bold mb-4 text-beach-900">{language === 'vi' ? 'Địa Chỉ' : 'Address'}</h3>
                <a href={getGoogleMapsUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center text-beach-800 hover:text-beach-600 group transition-colors">
                  <MapPin className="h-5 w-5 mr-2 text-beach-600" />
                  <span>{getAddress()}</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>}
            
            <div>
              <h3 className="font-display text-xl font-bold mb-4 text-beach-900">{language === 'vi' ? 'Tiện Nghi Phòng' : 'Room Amenities'}</h3>
              
              {roomType.amenities && Array.isArray(roomType.amenities) ? <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roomType.amenities.map((amenity, index) => <li key={index} className="flex items-center gap-2 text-beach-700">
                      <Check className="h-4 w-4 text-beach-600" />
                      <span>{typeof amenity === 'object' ? language === 'vi' ? amenity.vi : amenity.en : amenity}</span>
                    </li>)}
                </ul> : <p className="text-beach-700">
                  {language === 'vi' ? 'Không có thông tin về tiện nghi' : 'No amenities information available'}
                </p>}
            </div>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6
        }}>
            <div className="bg-beach-50 p-6 border border-beach-100 sticky top-24 rounded-lg">
              <h3 className="font-display text-xl font-bold mb-4 text-beach-900">{language === 'vi' ? 'Tóm Tắt' : 'Summary'}</h3>
              
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
      
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none" onKeyDown={handleKeyDown}>
          <div className="relative h-full w-full flex items-center justify-center">
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <X className="h-6 w-6" />
            </button>
            
            <button onClick={goToPrevImage} className="absolute left-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button onClick={goToNextImage} className="absolute right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <ChevronRight className="h-6 w-6" />
            </button>
            
            <div className="relative h-full w-full flex items-center justify-center">
              {images[currentImageIndex] && <img src={images[currentImageIndex]} alt={`${getName()} - Full size ${currentImageIndex + 1}`} className="max-h-[85vh] max-w-[85vw] object-contain" />}
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>;
};
export default RoomDetailPage;