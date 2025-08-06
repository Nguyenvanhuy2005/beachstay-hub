import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BenefitsList from "@/components/home/BenefitsList";
import ConsultationForm from "@/components/booking/ConsultationForm";
import { useLanguage } from "@/contexts/LanguageContext";

const benefits = {
  vi: ["Giữ chỗ cho những ngày muốn bình yên", "Đặt phòng trực tiếp tại website của AnNam - để không bỏ lỡ vai bất ngờ nhỏ mà đội ngũ AnNam đã dành riêng cho bạn tại phòng, như một lời chào từ tê và dê mến từ chúng tôi"],
  en: ["Reserve spots for peaceful days", "Book directly on AnNam's website - so you don't miss the little surprises that our AnNam team has prepared especially for you in your room, as a greeting from us with love and care"]
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
    <section className="py-20 bg-gradient-to-r from-primary to-green-700 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/20 -skew-x-12 transform origin-top-right"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-sans text-3xl md:text-4xl font-bold mb-6">
              {language === 'vi' ? 'Đặt Phòng Ngay Hôm Nay' : 'Book Your Stay Today'} <br />
              {language === 'vi' ? 'Và Nhận Ưu Đãi Đặc Biệt' : 'And Get Special Offers'}
            </h2>
            <p className="text-neutral mb-8">
              {language === 'vi' ? 'Đặt phòng trực tiếp trên website chính thức của chúng tôi để nhận được giá tốt nhất cùng nhiều ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đặt phòng online.' : 'Book directly on our official website to get the best price and many attractive offers exclusively for online booking customers.'}
            </p>
            
            <BenefitsList benefits={benefits[language]} />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-neutral text-primary hover:bg-accent px-8 py-6 text-lg font-medium" onClick={handleFullBooking}>
                {language === 'vi' ? 'Đặt Phòng Ngay' : 'Book Now'}
              </Button>
              <Button variant="outline" onClick={handleViewDeals} className="border-neutral px-8 py-6 text-lg font-normal bg-slate-100 text-[#096800]">
                {language === 'vi' ? 'Xem Ưu Đãi' : 'View Offers'}
              </Button>
            </div>
          </div>
          
          <ConsultationForm onFullBooking={handleFullBooking} />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;