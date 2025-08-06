import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Testimonials data with both languages
const testimonials = [{
  id: 1,
  name: {
    vi: 'Nguyễn Thị Mai',
    en: 'Nguyen Thi Mai'
  },
  role: {
    vi: 'Khách Hàng',
    en: 'Customer'
  },
  rating: 5,
  content: {
    vi: 'Chuyến nghỉ lần này mình cảm thấy vô cùng dễ chịu luôn vì villa thiết kế dễ thương, nhẹ nhàng, hồ bơi thì sạch, chăn mền mới, thơm và rất yên tĩnh, mình có thể nằm phơi nắng đọc sách cả buổi. Nhân viên thì tận tâm cực, còn giúp tụi mình đặt hải sản về nướng tại villa. Rất biết ơn vì mọi điều nhỏ đều được chăm chút.',
    en: 'This vacation was extremely comfortable because the villa has a cute, gentle design, the pool is clean, the blankets are new, fragrant and very quiet, I can lie in the sun and read books all day. The staff is extremely dedicated and even helped us order seafood to grill at the villa. Very grateful that every little detail is taken care of.'
  },
  highlight: {
    vi: 'Rất biết ơn vì mọi điều nhỏ đều được chăm chút',
    en: 'Very grateful that every little detail is taken care of'
  },
  image: '/lovable-uploads/b453ee05-3e2c-4c5c-914c-80232a28fcf7.png'
}, {
  id: 2,
  name: {
    vi: 'Trần Minh Đức',
    en: 'Tran Minh Duc'
  },
  role: {
    vi: 'Khách Hàng',
    en: 'Customer'
  },
  rating: 5,
  content: {
    vi: 'Ba mẹ mình nói chưa bao giờ đi Vũng Tàu mà thấy đáng như lần này, mọi khi đi ngắn ngày mình đặt tạm bợ cho có chỗ nghỉ, nay chi ra để đặt cho cả nhà đi mà phải nói Villa ở đây làm chuyến đi trọn vẹn hơn hẳn. Vừa mát mẻ, vừa đủ đồ dùng cho cả nhà, có luôn mọi thứ để giải trí ồn ào vậy đó nhưng cứ ngồi ở đây chỉ thấy chữa lành tâm trạng; ba mẹ mình ưng lắm!',
    en: 'My parents said they have never been to Vung Tau and found it as worthwhile as this time. Usually when going on short trips, I just book temporarily to have a place to rest, but this time I spent money to book for the whole family and I must say the Villa here makes the trip much more complete. It is both cool and has enough amenities for the whole family, with everything for entertainment. Despite all the noise, sitting here just heals the soul; my parents love it!'
  },
  highlight: {
    vi: 'Villa ở đây làm chuyến đi trọn vẹn hơn hẳn',
    en: 'The Villa here makes the trip much more complete'
  },
  image: '/lovable-uploads/69fab503-b4cb-4837-857f-b43ad6994a94.png'
}, {
  id: 3,
  name: {
    vi: 'Lê Thanh Hà',
    en: 'Le Thanh Ha'
  },
  role: {
    vi: 'Khách Hàng',
    en: 'Customer'
  },
  rating: 5,
  content: {
    vi: 'Vị trí tuyệt vời, gần biển và các điểm tham quan. Villa rộng rãi, thiết kế hiện đại. Đội ngũ nhân viên chu đáo. Sẽ quay lại trong kỳ nghỉ tiếp theo.',
    en: 'Great location, close to the beach and attractions. Spacious villa, modern design. Attentive staff. Will return on our next vacation.'
  },
  image: '/lovable-uploads/21668da3-408e-4c55-845e-d0812b05e091.png'
}];
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    language
  } = useLanguage();
  const isVietnamese = language === 'vi';
  const nextTestimonial = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  return <section className="py-20 bg-beach-700 text-white relative">
      <div className="absolute inset-0 bg-[url(/pattern-dark.svg)] opacity-10 z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 bg-green-900">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 rounded bg-beach-600 px-3 py-1 text-sm font-semibold text-white">
            {isVietnamese ? 'Đánh Giá' : 'Testimonials'}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {isVietnamese ? 'Khách Hàng Nói Gì Về Chúng Tôi' : 'What Our Guests Say About Us'}
          </h2>
          <p className="text-beach-100 max-w-3xl mx-auto">
            {isVietnamese ? 'Hãy xem khách hàng đã trải nghiệm dịch vụ của chúng tôi nói gì về Annam Village.' : 'See what guests who have experienced our service say about Annam Village.'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <motion.div key={activeIndex} initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} transition={{
            duration: 0.5
          }} className="bg-beach-800/50 backdrop-blur-sm p-8 md:p-10 rounded-xl bg-gray-900">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <img src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name[language]} className="w-20 h-20 rounded-full object-cover border-4 border-beach-500" />
                
                <div className="flex-1">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} className={i < testimonials[activeIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} />)}
                  </div>
                  
                  {testimonials[activeIndex].highlight && (
                    <p className="text-lg font-bold mb-4 text-yellow-300">
                      "{testimonials[activeIndex].highlight[language]}"
                    </p>
                  )}
                  
                  <blockquote className="text-lg mb-6 italic text-beach-50">
                    "{testimonials[activeIndex].content[language]}"
                  </blockquote>
                  
                  <div>
                    <h4 className="font-bold text-xl">
                      {testimonials[activeIndex].name[language]}
                    </h4>
                    <p className="text-beach-200">
                      {testimonials[activeIndex].role[language]}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => <button key={index} onClick={() => setActiveIndex(index)} className={`w-3 h-3 rounded-full transition-all ${index === activeIndex ? "bg-white scale-125" : "bg-beach-200/50 hover:bg-beach-200"}`} aria-label={`Go to testimonial ${index + 1}`} />)}
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12">
              <button onClick={prevTestimonial} className="bg-beach-600 hover:bg-beach-500 text-white p-2 rounded-full transition-all" aria-label="Previous testimonial">
                <ChevronLeft size={24} />
              </button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12">
              <button onClick={nextTestimonial} className="bg-beach-600 hover:bg-beach-500 text-white p-2 rounded-full transition-all" aria-label="Next testimonial">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;