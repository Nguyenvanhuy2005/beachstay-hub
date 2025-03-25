
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BenefitsList from "@/components/home/BenefitsList";
import QuickBookingForm from "@/components/booking/QuickBookingForm";
import { useLanguage } from "@/contexts/LanguageContext";

const benefits = {
  vi: [
    "Giá tốt nhất đảm bảo",
    "Ưu đãi độc quyền chỉ có trên website",
    "Đặt phòng nhanh chóng, dễ dàng",
    "Hủy miễn phí trước 7 ngày",
    "Thanh toán an toàn, bảo mật"
  ],
  en: [
    "Best price guarantee",
    "Exclusive offers only on our website",
    "Quick and easy booking",
    "Free cancellation before 7 days",
    "Secure payment"
  ]
};

const CtaSection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const handleFullBooking = () => {
    navigate('/dat-phong');
  };

  const handleViewDeals = () => {
    navigate('/loai-phong');
  };

  return (
    <section className="py-20 bg-gradient-to-r from-beach-700 to-beach-600 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-beach-500/20 -skew-x-12 transform origin-top-right"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              {language === 'vi' ? 'Đặt Phòng Ngay Hôm Nay' : 'Book Your Stay Today'} <br/>
              {language === 'vi' ? 'Và Nhận Ưu Đãi Đặc Biệt' : 'And Get Special Offers'}
            </h2>
            <p className="text-beach-100 mb-8">
              {language === 'vi' 
                ? 'Đặt phòng trực tiếp trên website chính thức của chúng tôi để nhận được giá tốt nhất cùng nhiều ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đặt phòng online.'
                : 'Book directly on our official website to get the best price and many attractive offers exclusively for online booking customers.'}
            </p>
            
            <BenefitsList benefits={benefits[language]} />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-white text-beach-700 hover:bg-beach-50 px-8 py-6 text-lg font-medium"
                onClick={handleFullBooking}
              >
                {language === 'vi' ? 'Đặt Phòng Ngay' : 'Book Now'}
              </Button>
              <Button 
                variant="outline" 
                className="border-white/60 text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={handleViewDeals}
              >
                {language === 'vi' ? 'Xem Ưu Đãi' : 'View Offers'}
              </Button>
            </div>
          </div>
          
          <QuickBookingForm onFullBooking={handleFullBooking} />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
