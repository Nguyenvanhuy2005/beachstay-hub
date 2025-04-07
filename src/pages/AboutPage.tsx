
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutPage = () => {
  const {
    language
  } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img src="/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png" alt="About Us" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="font-display text-4xl md:text-5xl font-bold mb-4">
            {language === 'vi' ? 'Về Chúng Tôi' : 'About Us'}
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
            {language === 'vi' ? 'Khám phá câu chuyện, tầm nhìn và sứ mệnh của AnNam Village - điểm đến nghỉ dưỡng hoàn hảo tại Vũng Tàu.' : 'Discover the story, vision, and mission of AnNam Village - the perfect resort destination in Vung Tau.'}
          </motion.p>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-beach-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }}>
              <img src="/lovable-uploads/3de4ca25-b7f7-4567-8e8a-de3b9ef3e8ab.png" alt="Our Story" className="rounded-lg shadow-xl w-full h-auto object-cover" />
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }}>
              <h2 className="font-display text-3xl font-bold mb-6 text-beach-900">
                {language === 'vi' ? 'Câu Chuyện Của Chúng Tôi' : 'Our Story'}
              </h2>
              <p className="text-beach-800 mb-4">
                {language === 'vi' ? 'AnNam bắt đầu từ năm 2018, khi tụi mình muốn tạo ra nhiều căn nhà nhỏ giữa Vũng Tàu dành cho những người thích cảm giác được ở một nơi riêng tư, dễ chịu và có chút gì đó… thật bình yên.' : 'AnNam began in 2018, when we dreamed of creating small, cozy homes in Vung Tau for those who long for a private, tranquil space — something that feels... truly peaceful.'}
              </p>
              <p className="text-beach-800 mb-4">
                {language === 'vi' ? 'Chúng tôi tin rằng: Một nơi ở đẹp không cần phải quá cầu kỳ. Chỉ cần đủ xanh, đủ thoáng, đủ tinh tế trong từng góc nhỏ - để bất kỳ ai ghé tới cũng có thể thật sự thả hồn phiêu du và trở về nguyên bản chính mình.' : 'We believe that a beautiful place to stay doesn't have to be extravagant. It just needs enough greenery, enough openness, and enough thoughtfulness in the little details — so that anyone who visits can let their soul wander and gently return to their truest self.'}
              </p>
              <p className="text-beach-800 mb-4">
                {language === 'vi' ? 'Mỗi căn hộ và villa của AnNam đều mang hơi thở từ vùng biển Vũng Tàu, pha chút cảm hứng truyền thống, nhưng cũng đủ tối giản và gần gũi để bạn có thể trò chuyện với chính mình, hoặc cùng bạn bè tận hưởng khoảng thời gian ý nghĩa bên nhau.' : 'Each apartment and villa at AnNam carries the essence of Vung Tau's seaside spirit — blended with touches of tradition, yet minimalist and familiar enough for you to slow down, reconnect with yourself, or share meaningful moments with friends.'}
              </p>
              <p className="text-beach-800">
                {language === 'vi' ? 'Hành trình đó, tới giờ vẫn đang được chúng tôi giữ gìn và vun đắp - bằng tất cả sự tử tế dành cho những du khách ghé qua.' : 'That journey is still unfolding today — nurtured with kindness, for every traveler who passes through.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="font-display text-3xl mb-6 text-beach-900 font-bold">
              {language === 'vi' ? 'Giá Trị Cốt Lõi' : 'Our Core Values'}
            </h2>
            <p className="text-beach-800 max-w-3xl mx-auto">
              {language === 'vi' ? 'Những điều nhỏ nhất — từ cách chào đón bạn, đến không gian sống, hay cách chúng tôi ứng xử với thiên nhiên — đều bắt đầu từ những giá trị này.' : 'The smallest things — from how we welcome you, to the living spaces, to how we interact with nature — all begin with these values.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: language === 'vi' ? 'Tận Tâm' : 'Dedication',
                description: language === 'vi' ? 'Đặt trọn trái tim và tâm huyết vào từng chi tiết nhỏ, để mỗi trải nghiệm của du khách luôn là điều đáng nhớ và trọn vẹn nhất.' : 'Putting our heart and passion into every small detail, so that each guest experience is always memorable and complete.',
                icon: '✦'
              }, 
              {
                title: language === 'vi' ? 'Thông Thái' : 'Wisdom',
                description: language === 'vi' ? 'Để mỗi dịch vụ và lựa chọn phục vụ từ AnNam đều làm an lòng khách hàng. Chỉ mong mỗi khách đến – như khách về quê nhà.' : 'So that every service and option from AnNam reassures our customers. We simply hope each guest arrives - like coming home.',
                icon: '✦'
              }, 
              {
                title: language === 'vi' ? 'Thuần Thiên' : 'Natural Connection',
                description: language === 'vi' ? 'Mỗi kiến trúc từ AnNam luôn hướng đến không gian sống thuần thiên nhiên - để du khách như được đắm mình giữa lòng thiên nhiên xanh mát.' : 'Every architectural element at AnNam always aims for living spaces in harmony with nature - so guests feel immersed in green nature.',
                icon: '✦'
              }
            ].map((value, index) => (
              <motion.div 
                key={index} 
                initial={{
                  opacity: 0,
                  y: 30
                }} 
                whileInView={{
                  opacity: 1,
                  y: 0
                }} 
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }} 
                viewport={{
                  once: true
                }} 
                className="bg-white p-8 rounded-lg shadow-md border border-beach-100 text-center hover:shadow-xl transition-shadow"
              >
                <div className="inline-block text-3xl text-beach-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-beach-900">{value.title}</h3>
                <p className="text-beach-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      
    </MainLayout>;
};
export default AboutPage;
