
import { Bath, Utensils, Wifi, Smile, Bike, Coffee } from "lucide-react";

const amenities = [
  {
    id: 1,
    name: "Hồ Bơi",
    description: "Thư giãn và tận hưởng làn nước mát tại hồ bơi ngoài trời với view đẹp",
    icon: Bath,
  },
  {
    id: 2,
    name: "Nhà Hàng",
    description: "Thưởng thức ẩm thực đa dạng từ các món Việt truyền thống đến quốc tế",
    icon: Utensils,
  },
  {
    id: 3,
    name: "Wifi Miễn Phí",
    description: "Kết nối internet tốc độ cao miễn phí trong toàn bộ khu nghỉ dưỡng",
    icon: Wifi,
  },
  {
    id: 4,
    name: "Dịch Vụ Concierge",
    description: "Đội ngũ nhân viên chuyên nghiệp sẵn sàng hỗ trợ mọi yêu cầu của bạn",
    icon: Smile,
  },
  {
    id: 5,
    name: "Cho Thuê Xe Đạp",
    description: "Khám phá vẻ đẹp của Vũng Tàu bằng xe đạp với dịch vụ cho thuê tại chỗ",
    icon: Bike,
  },
  {
    id: 6,
    name: "Quầy Bar",
    description: "Thưởng thức đồ uống đa dạng tại quầy bar với không gian thoáng đãng",
    icon: Coffee,
  },
];

const AmenitiesSection = () => {
  return (
    <section className="py-20 bg-beach-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
            Tiện Ích
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dịch Vụ & Tiện Ích Đẳng Cấp
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Chúng tôi cung cấp đầy đủ tiện ích và dịch vụ chất lượng cao, đảm bảo kỳ nghỉ của bạn luôn thoải mái và thư giãn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-beach-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <amenity.icon className="text-beach-600 h-6 w-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
                {amenity.name}
              </h3>
              <p className="text-gray-700">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
