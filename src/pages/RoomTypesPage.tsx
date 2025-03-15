
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRoomTypes } from '@/api/bookingApi';
import { Loader2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RoomTypesPage = () => {
  const { language } = useLanguage();
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const data = await getRoomTypes();
      console.log('Fetched room types:', data);
      setRoomTypes(data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally {
      setLoading(false);
    }
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img 
            src="/lovable-uploads/4f6b5954-4f23-421b-b0cd-beee0b9c8bc3.png"
            alt="Room Types" 
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
            {language === 'vi' ? 'Loại Phòng' : 'Room Types'}
          </motion.h1>
          <motion.p 
            className="text-beach-100 max-w-3xl text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {language === 'vi' 
              ? 'Khám phá các lựa chọn phòng nghỉ sang trọng tại Annam Village, được thiết kế để đáp ứng mọi nhu cầu của bạn.'
              : 'Explore our luxurious accommodation options at Annam Village, designed to meet all your needs.'}
          </motion.p>
        </div>
      </div>
      
      {/* Room Types Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
            </div>
          ) : roomTypes.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-600">
                {language === 'vi' ? 'Không có loại phòng nào' : 'No room types available'}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roomTypes.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="h-60 overflow-hidden relative">
                      <img 
                        src={room.image_url} 
                        alt={getRoomName(room)} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      {room.is_popular && (
                        <Badge className="absolute top-3 right-3 bg-coral-500">
                          {language === 'vi' ? 'Phổ biến' : 'Popular'}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="py-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-beach-900">{getRoomName(room)}</h3>
                        <span className="text-beach-500 font-medium">{formatPrice(room.price)}đ</span>
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
                          <Link to="/dat-phong">
                            {language === 'vi' ? 'Đặt Ngay' : 'Book Now'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-beach-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-6 text-beach-900">
            {language === 'vi' ? 'Cần Hỗ Trợ Chọn Phòng?' : 'Need Help Choosing a Room?'}
          </h2>
          <p className="text-beach-700 max-w-2xl mx-auto mb-8">
            {language === 'vi' 
              ? 'Hãy liên hệ với đội ngũ chăm sóc khách hàng của chúng tôi để được tư vấn lựa chọn phòng phù hợp nhất với nhu cầu của bạn.'
              : 'Contact our customer care team for advice on choosing the most suitable room for your needs.'}
          </p>
          <Button asChild size="lg" className="bg-beach-600 hover:bg-beach-700 text-white">
            <Link to="/lien-he">
              {language === 'vi' ? 'Liên Hệ Ngay' : 'Contact Now'}
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default RoomTypesPage;
