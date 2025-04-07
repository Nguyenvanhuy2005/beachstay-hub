import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase, checkRoomAvailability } from '@/lib/supabase';
import { Loader2, Users, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import RoomSearchFilter from '@/components/booking/RoomSearchFilter';
interface SearchFilters {
  checkIn: string;
  checkOut: string;
  guests: number;
}
const RoomTypesPage = () => {
  const {
    language
  } = useLanguage();
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRoomTypes();
  }, []);
  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      console.log('Fetching room types from Supabase...');
      const {
        data,
        error
      } = await supabase.from('room_types').select('*').order('price', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching room types:', error);
        toast.error(language === 'vi' ? 'Không thể tải dữ liệu phòng' : 'Error loading room data');
        setRoomTypes([]);
        setFilteredRoomTypes([]);
        return;
      }
      console.log('Room types fetched successfully:', data?.length || 0);
      setRoomTypes(data || []);
      setFilteredRoomTypes(data || []);
    } catch (error) {
      console.error('Unexpected error in fetchRoomTypes:', error);
      toast.error(language === 'vi' ? 'Đã xảy ra lỗi không mong muốn' : 'An unexpected error occurred');
      setRoomTypes([]);
      setFilteredRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };
  const searchAvailableRooms = async (filters: SearchFilters) => {
    try {
      setSearching(true);
      setSearchFilters(filters);
      if (!filters.checkIn || !filters.checkOut) {
        setFilteredRoomTypes(roomTypes);
        return;
      }
      toast.info(language === 'vi' ? `Đang tìm phòng trống từ ${filters.checkIn} đến ${filters.checkOut}...` : `Searching for available rooms from ${filters.checkIn} to ${filters.checkOut}...`);
      const availableRooms = [];
      for (const room of roomTypes) {
        const {
          available,
          remainingRooms
        } = await checkRoomAvailability(room.id, filters.checkIn, filters.checkOut);
        if (available) {
          availableRooms.push({
            ...room,
            remainingRooms
          });
        }
      }
      setFilteredRoomTypes(availableRooms);
      if (availableRooms.length === 0) {
        toast.warning(language === 'vi' ? 'Không tìm thấy phòng trống trong khoảng thời gian này' : 'No available rooms found for these dates');
      } else {
        toast.success(language === 'vi' ? `Tìm thấy ${availableRooms.length} phòng trống` : `Found ${availableRooms.length} available rooms`);
      }
    } catch (error) {
      console.error('Error searching for available rooms:', error);
      toast.error(language === 'vi' ? 'Đã xảy ra lỗi khi tìm kiếm phòng trống' : 'An error occurred while searching for available rooms');
      setFilteredRoomTypes(roomTypes);
    } finally {
      setSearching(false);
    }
  };
  const clearSearch = () => {
    setSearchFilters(null);
    setFilteredRoomTypes(roomTypes);
  };
  const getRoomName = room => {
    return language === 'vi' ? room.name : room.name_en;
  };
  const getRoomDescription = room => {
    return language === 'vi' ? room.description : room.description_en;
  };
  const getRoomCapacity = room => {
    return language === 'vi' ? room.capacity : room.capacity_en;
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };
  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };
  const getDisplayPrice = room => {
    if (isWeekend() && room.weekend_price) {
      return room.weekend_price;
    }
    return room.price;
  };
  return <MainLayout>
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img src="/lovable-uploads/7e2eee36-3be7-4e6f-87d5-e0540c160bef.png" alt="Room Types" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <motion.h1 className="font-display text-4xl md:text-5xl font-bold mb-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
            {language === 'vi' ? 'Loại Phòng' : 'Room Types'}
          </motion.h1>
          <motion.p className="text-beach-100 max-w-3xl text-lg mb-8" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            {language === 'vi' ? 'Khám phá các lựa chọn phòng nghỉ sang trọng tại An Nam Village, được thiết kế để đáp ứng mọi nhu cầu của bạn.' : 'Explore our luxurious accommodation options at An Nam Village, designed to meet all your needs.'}
          </motion.p>
        </div>
      </div>
      
      <div className="bg-beach-50 py-6">
        <div className="container mx-auto px-4 -mt-16 relative z-30">
          <RoomSearchFilter onSearch={searchAvailableRooms} isLoading={searching} />
        </div>
      </div>
      
      <section className="py-12 md:py-16 bg-beach-50">
        <div className="container mx-auto px-4">
          {searchFilters && <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-medium text-beach-800">
                  {language === 'vi' ? `Kết quả tìm kiếm (${filteredRoomTypes.length})` : `Search Results (${filteredRoomTypes.length})`}
                </h2>
                <p className="text-sm text-beach-600">
                  {language === 'vi' ? `Phòng trống từ ${searchFilters.checkIn} đến ${searchFilters.checkOut}` : `Available rooms from ${searchFilters.checkIn} to ${searchFilters.checkOut}`}
                </p>
              </div>
              <Button variant="outline" onClick={clearSearch}>
                {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
              </Button>
            </div>}
          
          {loading || searching ? <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
            </div> : filteredRoomTypes.length === 0 ? <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-beach-100">
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                {language === 'vi' ? 'Không tìm thấy phòng trống' : 'No available rooms found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === 'vi' ? 'Vui lòng thử chọn ngày khác hoặc liên hệ với chúng tôi để được hỗ trợ.' : 'Please try different dates or contact us for assistance.'}
              </p>
              <Button asChild className="bg-beach-600 hover:bg-beach-700 text-white">
                <Link to="/lien-he">
                  {language === 'vi' ? 'Liên hệ ngay' : 'Contact us'}
                </Link>
              </Button>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRoomTypes.map(room => <motion.div key={room.id} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }}>
                  <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                    <div className="h-60 overflow-hidden relative">
                      <img src={room.image_url} alt={getRoomName(room)} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      {room.is_popular && <Badge className="absolute top-3 right-3 bg-coral-500 bg-[#747911]">
                          {language === 'vi' ? 'Phổ biến' : 'Popular'}
                        </Badge>}
                      {room.remainingRooms !== undefined && <Badge className="absolute top-3 left-3 bg-beach-600">
                          {language === 'vi' ? `Còn ${room.remainingRooms} phòng` : `${room.remainingRooms} rooms left`}
                        </Badge>}
                    </div>
                    <CardContent className="py-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-beach-900">{getRoomName(room)}</h3>
                        <div className="text-right">
                          <span className="text-beach-500 font-medium block">{formatPrice(getDisplayPrice(room))}đ</span>
                          {room.weekend_price && room.weekend_price !== room.price && <span className="text-gray-500 text-xs block mt-1">
                              {language === 'vi' ? isWeekend() ? 'Giá cuối tuần' : 'Giá ngày thường: ' + formatPrice(room.price) + 'đ' : isWeekend() ? 'Weekend price' : 'Regular price: ' + formatPrice(room.price) + 'đ'}
                            </span>}
                        </div>
                      </div>
                      <p className="text-beach-700 mb-4 flex-grow">{getRoomDescription(room)}</p>
                      <div className="flex items-center mb-4">
                        <Users size={18} className="text-beach-600 mr-2" />
                        <span className="text-gray-600 text-sm">{getRoomCapacity(room)}</span>
                      </div>
                      <div className="mt-auto flex justify-between items-center">
                        <Button asChild className="rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors">
                          <Link to={`/loai-phong/${room.id}`}>
                            {language === 'vi' ? 'Chi Tiết' : 'Details'}
                          </Link>
                        </Button>
                        <Button asChild className="bg-beach-600 hover:bg-beach-700 text-white">
                          <Link to={`/dat-phong${searchFilters ? `?roomType=${room.id}&checkIn=${searchFilters.checkIn}&checkOut=${searchFilters.checkOut}&guests=${searchFilters.guests}` : ''}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {language === 'vi' ? 'Đặt Ngay' : 'Book Now'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>)}
            </div>}
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center bg-slate-100">
          <h2 className="font-display text-3xl font-bold mb-6 text-beach-900">
            {language === 'vi' ? 'Cần Hỗ Trợ Chọn Phòng?' : 'Need Help Choosing a Room?'}
          </h2>
          <p className="text-beach-700 max-w-2xl mx-auto mb-8">
            {language === 'vi' ? 'Hãy liên hệ với đội ngũ chăm sóc khách hàng của chúng tôi để được tư vấn lựa chọn phòng phù hợp nhất với nhu cầu của bạn.' : 'Contact our customer care team for advice on choosing the most suitable room for your needs.'}
          </p>
          <Button asChild size="lg" className="bg-beach-600 hover:bg-beach-700 text-white">
            <Link to="/lien-he" className="gray-900">
              {language === 'vi' ? 'Liên Hệ Ngay' : 'Contact Now'}
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>;
};
export default RoomTypesPage;