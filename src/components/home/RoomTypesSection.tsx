
import { Link } from "react-router-dom";
import { ArrowRight, Users, Wifi, Coffee, Bath, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const roomTypes = [
  {
    id: 1,
    name: "Villa Hồ Bơi Riêng",
    image: "/lovable-uploads/21668da3-408e-4c55-845e-d0812b05e091.png",
    description: "Villa 2 phòng ngủ với hồ bơi riêng, không gian rộng rãi và đầy đủ tiện nghi hiện đại.",
    capacity: "4 người lớn, 2 trẻ em",
    price: "3,500,000",
    amenities: ["Hồ bơi riêng", "Wifi miễn phí", "Bếp đầy đủ", "Dịch vụ dọn phòng", "Smart TV"],
    isPopular: true,
  },
  {
    id: 2,
    name: "Căn Hộ Hướng Biển",
    image: "/lovable-uploads/dd828878-82ae-4104-959b-b8793c180d89.png",
    description: "Căn hộ với view biển tuyệt đẹp, thiết kế hiện đại và không gian thoáng đãng.",
    capacity: "2 người lớn, 1 trẻ em",
    price: "1,800,000",
    amenities: ["View biển", "Wifi miễn phí", "Bàn làm việc", "Dịch vụ dọn phòng", "Smart TV"],
    isPopular: false,
  },
  {
    id: 3,
    name: "Phòng Deluxe",
    image: "/lovable-uploads/ff2fe940-82b8-4f88-a56c-eeaea2c86b0c.png",
    description: "Phòng nghỉ sang trọng với nội thất cao cấp, view đẹp và tiện nghi đầy đủ.",
    capacity: "2 người lớn",
    price: "1,200,000",
    amenities: ["Bồn tắm", "Wifi miễn phí", "Minibar", "Dịch vụ dọn phòng", "Smart TV"],
    isPopular: false,
  },
];

const RoomTypesSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Wave background decoration */}
      <div className="absolute top-0 left-0 right-0 h-64 wave-bg z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
            Loại Phòng
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lựa Chọn Phòng Nghỉ Lý Tưởng
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Annam Village cung cấp đa dạng loại phòng nghỉ sang trọng, từ Villa với hồ bơi riêng đến căn hộ hướng biển, đáp ứng mọi nhu cầu của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roomTypes.map((room) => (
            <div 
              key={room.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-60 object-cover"
                />
                {room.isPopular && (
                  <Badge className="absolute top-4 right-4 bg-coral-500">
                    Phổ biến
                  </Badge>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
                  {room.name}
                </h3>
                <p className="text-gray-700 mb-4">
                  {room.description}
                </p>
                <div className="flex items-center mb-4">
                  <Users size={18} className="text-beach-600 mr-2" />
                  <span className="text-gray-600 text-sm">{room.capacity}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity, index) => {
                    const icons = {
                      "Wifi miễn phí": <Wifi size={14} />,
                      "Bếp đầy đủ": <Coffee size={14} />,
                      "Bồn tắm": <Bath size={14} />,
                      "Smart TV": <Tv size={14} />,
                    };
                    const IconComponent = icons[amenity as keyof typeof icons];
                    
                    return (
                      <span 
                        key={index}
                        className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {IconComponent && <span className="mr-1">{IconComponent}</span>}
                        {amenity}
                      </span>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <div>
                    <span className="text-beach-700 font-bold text-xl">
                      {room.price}đ
                    </span>
                    <span className="text-gray-500 text-sm"> / đêm</span>
                  </div>
                  <Link to={`/loai-phong/${room.id}`}>
                    <Button variant="outline" className="border-beach-500 text-beach-700 hover:bg-beach-50">
                      Chi Tiết
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-beach-600 hover:bg-beach-700 text-white px-8 py-6">
            Xem Tất Cả Loại Phòng <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoomTypesSection;
