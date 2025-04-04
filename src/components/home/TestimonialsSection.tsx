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
    vi: 'Kỳ nghỉ tuyệt vời tại Annam Village! Villa với hồ bơi riêng rất sạch sẽ và thoải mái. Nhân viên thân thiện và nhiệt tình. Chắc chắn sẽ quay lại!',
    en: 'Wonderful vacation at Annam Village! The villa with private pool was very clean and comfortable. Friendly and enthusiastic staff. Will definitely come back!'
  },
  image: '/lovable-uploads/ff2fe940-82b8-4f88-a56c-eeaea2c86b0c.png'
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
  rating: 4,
  content: {
    vi: 'Không gian yên tĩnh, phòng ốc sạch sẽ, tiện nghi đầy đủ. Điểm cộng cho bữa sáng ngon và đa dạng. Sẽ giới thiệu cho bạn bè và người thân.',
    en: 'Quiet space, clean rooms, full amenities. Plus point for delicious and diverse breakfast. Will recommend to friends and family.'
  },
  image: '/lovable-uploads/dd828878-82ae-4104-959b-b8793c180d89.png'
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
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
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