
import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thị Mai",
    role: "Khách Hàng",
    rating: 5,
    content: "Kỳ nghỉ tuyệt vời tại Annam Village! Villa với hồ bơi riêng rất sạch sẽ và thoải mái. Nhân viên thân thiện và nhiệt tình. Chắc chắn sẽ quay lại!",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Trần Văn Đức",
    role: "Khách Hàng",
    rating: 5,
    content: "Không gian yên tĩnh, thiết kế tinh tế và hiện đại. Đặc biệt ấn tượng với hồ bơi và khu vực ngoài trời. Dịch vụ rất tốt, nhân viên luôn sẵn sàng hỗ trợ.",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    role: "Khách Hàng",
    rating: 4,
    content: "Vị trí thuận tiện, gần biển và các điểm tham quan. Phòng ốc sạch sẽ, đầy đủ tiện nghi. Bữa sáng ngon và phong phú. Sẽ giới thiệu cho bạn bè!",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 4,
    name: "Phạm Minh Tuấn",
    role: "Khách Hàng",
    rating: 5,
    content: "Trải nghiệm đáng nhớ tại Annam Village. Không gian thiết kế đẹp, hòa hợp với thiên nhiên. Nhân viên chu đáo và thân thiện. Chắc chắn sẽ quay lại!",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (containerRef.current) {
      const scrollPosition = activeIndex * (containerRef.current.offsetWidth / 2);
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <section className="py-20 bg-beach-800 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 rounded bg-beach-700/50 px-3 py-1 text-sm font-semibold text-beach-100">
            Đánh Giá
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-beach-100 max-w-3xl mx-auto">
            Hãy xem khách hàng đã trải nghiệm dịch vụ của chúng tôi nói gì về Annam Village.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={handlePrev}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div 
            ref={containerRef}
            className="overflow-x-auto hide-scrollbar py-8"
          >
            <div className="flex space-x-6" style={{ width: `${testimonials.length * 100}%` }}>
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-6 bg-beach-700/30 backdrop-blur-sm rounded-lg transition-all duration-300 ${
                    index === activeIndex ? "scale-105 shadow-xl" : "scale-100"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-medium text-white">{testimonial.name}</h4>
                      <p className="text-beach-200 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-beach-100">
                    {testimonial.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={handleNext}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === activeIndex ? "bg-beach-400" : "bg-beach-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
