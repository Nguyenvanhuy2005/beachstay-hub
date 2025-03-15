
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RoomTypesPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample room types data
  const roomTypes = [
    {
      id: 1,
      name: language === 'vi' ? 'Phòng Deluxe Hướng Biển' : 'Sea View Deluxe Room',
      description: language === 'vi' 
        ? 'Phòng rộng 45m² với ban công riêng hướng biển, trang bị đầy đủ tiện nghi và thiết kế hiện đại.'
        : 'Spacious 45m² room with private sea-view balcony, fully equipped with modern amenities.',
      price: language === 'vi' ? '2,800,000 VND' : '$115',
      image: '/lovable-uploads/4f6b5954-4f23-421b-b0cd-beee0b9c8bc3.png'
    },
    {
      id: 2,
      name: language === 'vi' ? 'Phòng Gia Đình' : 'Family Suite',
      description: language === 'vi' 
        ? 'Phòng rộng 65m² phù hợp cho gia đình 4 người, có khu vực sinh hoạt chung và 2 phòng ngủ riêng biệt.'
        : '65m² room suitable for a family of 4, with a common living area and 2 separate bedrooms.',
      price: language === 'vi' ? '3,500,000 VND' : '$145',
      image: '/lovable-uploads/842f894d-4d09-4b7b-9de4-e68c7d1e2e30.png'
    },
    {
      id: 3,
      name: language === 'vi' ? 'Biệt Thự Bãi Biển' : 'Beach Villa',
      description: language === 'vi' 
        ? 'Biệt thự 120m² với hồ bơi riêng, trực tiếp ra bãi biển, phù hợp cho kỳ nghỉ sang trọng và riêng tư.'
        : '120m² villa with private pool, direct beach access, perfect for a luxurious and private vacation.',
      price: language === 'vi' ? '7,500,000 VND' : '$310',
      image: '/lovable-uploads/cdfb47b1-e949-44cc-85b1-de98fba2961e.png'
    },
    {
      id: 4,
      name: language === 'vi' ? 'Phòng Superior' : 'Superior Room',
      description: language === 'vi' 
        ? 'Phòng 40m² trang nhã với tầm nhìn ra vườn, đầy đủ tiện nghi hiện đại và không gian thoải mái.'
        : '40m² elegant room with garden view, modern amenities, and comfortable space.',
      price: language === 'vi' ? '2,200,000 VND' : '$90',
      image: '/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png'
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomTypes.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="h-60 overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="py-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-beach-900">{room.name}</h3>
                      <span className="text-beach-500 font-medium">{room.price}</span>
                    </div>
                    <p className="text-beach-700 mb-6 flex-grow">{room.description}</p>
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
          <Button asChild size="lg">
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
