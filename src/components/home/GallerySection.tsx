
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "/lovable-uploads/595dc250-29ec-4d1d-873b-d34aecdba712.png",
    alt: "Khu vực hồ bơi ngoài trời",
    category: "Hồ Bơi",
  },
  {
    id: 2,
    src: "/lovable-uploads/21668da3-408e-4c55-845e-d0812b05e091.png",
    alt: "Phòng ngủ sang trọng với tầm nhìn ra hồ bơi",
    category: "Phòng Ngủ",
  },
  {
    id: 3,
    src: "/lovable-uploads/3de4ca25-b7f7-4567-8e8a-de3b9ef3e8ab.png",
    alt: "Không gian phòng khách thoáng đãng",
    category: "Phòng Khách",
  },
  {
    id: 4,
    src: "/lovable-uploads/447ed5f1-0675-492c-8437-bb1fdf09ab86.png",
    alt: "Phòng ăn và bếp đầy đủ tiện nghi",
    category: "Phòng Ăn",
  },
  {
    id: 5,
    src: "/lovable-uploads/dd828878-82ae-4104-959b-b8793c180d89.png",
    alt: "Phòng ngủ với thiết kế hiện đại",
    category: "Phòng Ngủ",
  },
  {
    id: 6,
    src: "/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png",
    alt: "Khu vực lối vào villa",
    category: "Ngoại Thất",
  },
];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tất Cả");

  const categories = ["Tất Cả", ...Array.from(new Set(galleryImages.map(img => img.category)))];

  const filteredImages = activeCategory === "Tất Cả" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
            Thư Viện Ảnh
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khám Phá Annam Village
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Hãy chiêm ngưỡng không gian sang trọng, tiện nghi và vẻ đẹp thiên nhiên tại Annam Village qua bộ sưu tập hình ảnh của chúng tôi.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-beach-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div 
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <span className="text-white/80 text-sm">{image.category}</span>
                  <p className="text-white font-medium">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
            {selectedImage && (
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded"
              />
            )}
            {selectedImage && (
              <div className="bg-white p-4 rounded-b">
                <p className="font-medium text-gray-900">{selectedImage.alt}</p>
                <p className="text-sm text-gray-500">{selectedImage.category}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
