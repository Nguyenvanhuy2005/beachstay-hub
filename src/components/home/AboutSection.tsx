
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-beach-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative">
              <img 
                src="/lovable-uploads/595dc250-29ec-4d1d-873b-d34aecdba712.png"
                alt="Annam Village - Không gian nghỉ dưỡng" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <img 
                  src="/lovable-uploads/cdfb47b1-e949-44cc-85b1-de98fba2961e.png"
                  alt="Chi tiết thiết kế" 
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
              Về Annam Village
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Không gian nghỉ dưỡng <span className="text-beach-600">đẳng cấp</span> tại Vũng Tàu
            </h2>
            <p className="text-gray-700 mb-6">
              Annam Village là chuỗi biệt thự, căn hộ cho thuê ngắn ngày tại thành phố biển Vũng Tàu. Với thiết kế độc đáo kết hợp giữa kiến trúc hiện đại và nét đẹp truyền thống, chúng tôi mang đến cho bạn không gian nghỉ dưỡng lý tưởng, nơi hòa mình vào thiên nhiên và thư giãn tuyệt đối.
            </p>
            <p className="text-gray-700 mb-8">
              Mỗi căn biệt thự đều được thiết kế tỉ mỉ với đầy đủ tiện nghi hiện đại, không gian xanh, hồ bơi riêng và dịch vụ chuyên nghiệp, đảm bảo mang đến trải nghiệm nghỉ dưỡng khó quên cho bạn và người thân.
            </p>
            <Button className="bg-beach-600 hover:bg-beach-700 text-white px-8 py-6">
              Tìm Hiểu Thêm <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
