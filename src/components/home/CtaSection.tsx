
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "Giá tốt nhất đảm bảo",
  "Ưu đãi độc quyền chỉ có trên website",
  "Đặt phòng nhanh chóng, dễ dàng",
  "Hủy miễn phí trước 7 ngày",
  "Thanh toán an toàn, bảo mật"
];

const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-beach-700 to-beach-600 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-beach-500/20 -skew-x-12 transform origin-top-right"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Đặt Phòng Ngay Hôm Nay <br/>Và Nhận Ưu Đãi Đặc Biệt
            </h2>
            <p className="text-beach-100 mb-8">
              Đặt phòng trực tiếp trên website chính thức của chúng tôi để nhận được giá tốt nhất cùng nhiều ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đặt phòng online.
            </p>
            
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <div className="bg-beach-100/20 rounded-full p-1 mr-3">
                    <Check className="h-4 w-4 text-beach-100" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-beach-700 hover:bg-beach-50 px-8 py-6 text-lg font-medium">
                Đặt Phòng Ngay
              </Button>
              <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Xem Ưu Đãi
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="font-serif text-beach-700 text-2xl font-bold mb-6">
              Đặt Phòng Nhanh
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">Họ và tên</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">Số điện thoại</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Ngày đến</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Ngày đi</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">Loại phòng</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
                >
                  <option value="">Chọn loại phòng</option>
                  <option value="villa">Villa Hồ Bơi Riêng</option>
                  <option value="apartment">Căn Hộ Hướng Biển</option>
                  <option value="deluxe">Phòng Deluxe</option>
                </select>
              </div>
              <Button className="w-full bg-beach-600 hover:bg-beach-700 text-white py-3">
                Gửi Yêu Cầu
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
