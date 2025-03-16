
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimationWrapper from '@/components/utils/AnimationWrapper';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Fallback images in case database fetch fails
const fallbackImages = [
  {
    src: '/lovable-uploads/595dc250-29ec-4d1d-873b-d34aecdba712.png',
    alt: 'Khu vực hồ bơi ngoài trời',
    category: 'Hồ Bơi'
  },
  {
    src: '/lovable-uploads/21668da3-408e-4c55-845e-d0812b05e091.png', 
    alt: 'Phòng ngủ sang trọng với tầm nhìn ra hồ bơi',
    category: 'Phòng Ngủ'
  },
  {
    src: '/lovable-uploads/3de4ca25-b7f7-4567-8e8a-de3b9ef3e8ab.png',
    alt: 'Không gian phòng khách thoáng đãng',
    category: 'Phòng Khách'
  },
  {
    src: '/lovable-uploads/447ed5f1-0675-492c-8437-bb1fdf09ab86.png',
    alt: 'Phòng ăn và bếp đầy đủ tiện nghi',
    category: 'Phòng Ăn'
  },
  {
    src: '/lovable-uploads/dd828878-82ae-4104-959b-b8793c180d89.png',
    alt: 'Phòng ngủ với thiết kế hiện đại',
    category: 'Phòng Ngủ'
  },
  {
    src: '/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png',
    alt: 'Khu vực lối vào villa',
    category: 'Ngoại Thất'
  }
];

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

const GallerySection = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingImages, setLoadingImages] = useState(true);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const { toast } = useToast();
  
  const isVietnamese = language === 'vi';

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoadingImages(true);
      setError(false);
      
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setGalleryImages(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(img => img.category))];
        setCategories(uniqueCategories);
      } else {
        // If no images in database, use fallback images
        setGalleryImages(fallbackImages);
        const uniqueCategories = [...new Set(fallbackImages.map(img => img.category))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError(true);
      
      // Use fallback images on error
      setGalleryImages(fallbackImages);
      const uniqueCategories = [...new Set(fallbackImages.map(img => img.category))];
      setCategories(uniqueCategories);
      
      toast({
        title: isVietnamese ? 'Lỗi tải dữ liệu' : 'Error loading data',
        description: isVietnamese 
          ? 'Không thể tải hình ảnh thư viện từ máy chủ, đang sử dụng dữ liệu dự phòng' 
          : 'Could not load gallery images from server, using fallback data',
        variant: 'destructive',
      });
    } finally {
      setLoadingImages(false);
    }
  };

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(image => image.category === selectedCategory);

  return (
    <section className="py-20 bg-beach-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url(/pattern-light.svg)] opacity-5 z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <AnimationWrapper direction="up" duration={0.8} once={true}>
          <div className="text-center mb-12">
            <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
              {isVietnamese ? 'Thư Viện Ảnh' : 'Photo Gallery'}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {isVietnamese ? 'Khám Phá Annam Village Qua Hình Ảnh' : 'Discover Annam Village Through Images'}
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              {isVietnamese 
                ? 'Ngắm nhìn không gian sống đẳng cấp và tiện nghi hiện đại tại Annam Village qua bộ sưu tập hình ảnh được tuyển chọn kỹ lưỡng.'
                : 'View the elegant living spaces and modern amenities at Annam Village through our carefully curated collection of images.'}
            </p>
          </div>
        </AnimationWrapper>

        {loadingImages ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
          </div>
        ) : (
          <>
            <AnimationWrapper direction="up" delay={0.2} once={true}>
              <div className="flex justify-center mb-8 space-x-2 flex-wrap">
                <Button 
                  variant={selectedCategory === 'all' ? "default" : "outline"}
                  className={selectedCategory === 'all' 
                    ? "bg-beach-600 hover:bg-beach-700 m-1" 
                    : "border-beach-200 text-beach-800 hover:bg-beach-100 m-1"
                  }
                  onClick={() => setSelectedCategory('all')}
                >
                  {isVietnamese ? 'Tất Cả' : 'All'}
                </Button>
                
                {categories.map((category) => (
                  <Button 
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category 
                      ? "bg-beach-600 hover:bg-beach-700 m-1" 
                      : "border-beach-200 text-beach-800 hover:bg-beach-100 m-1"
                    }
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </AnimationWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image, index) => (
                <AnimationWrapper
                  key={image.id || index}
                  direction="up"
                  delay={0.1 * (index % 3)}
                  duration={0.6}
                  once={true}
                >
                  <motion.div 
                    className="overflow-hidden rounded-lg shadow-lg bg-white"
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  >
                    <div className="h-72 overflow-hidden">
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{image.alt}</h3>
                      <p className="text-sm text-gray-500">{image.category}</p>
                    </div>
                  </motion.div>
                </AnimationWrapper>
              ))}
            </div>

            {error && (
              <div className="text-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={fetchGalleryImages}
                  className="border-beach-200 text-beach-800 hover:bg-beach-100"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isVietnamese ? 'Thử lại' : 'Try Again'}
                </Button>
              </div>
            )}

            <AnimationWrapper direction="up" delay={0.4} once={true}>
              <div className="text-center mt-12">
                <Button asChild className="bg-transparent border-2 border-beach-700 text-beach-700 hover:bg-beach-50 px-8 py-6">
                  <a href="#" className="inline-flex items-center">
                    <Camera className="mr-2 h-5 w-5" />
                    {isVietnamese ? 'Xem Thêm Hình Ảnh' : 'View More Images'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </AnimationWrapper>
          </>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
