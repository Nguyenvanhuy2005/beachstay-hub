import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimationWrapper from '@/components/utils/AnimationWrapper';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Fallback images in case database fetch fails
const fallbackImages = [{
  id: 'fallback-1',
  src: '/lovable-uploads/595dc250-29ec-4d1d-873b-d34aecdba712.png',
  alt: {
    vi: 'Khu vực hồ bơi ngoài trời',
    en: 'Outdoor pool area'
  },
  category: {
    vi: 'Hồ Bơi',
    en: 'Pool'
  }
}, {
  id: 'fallback-2',
  src: '/lovable-uploads/21668da3-408e-4c55-845e-d0812b05e091.png',
  alt: {
    vi: 'Phòng ngủ sang trọng với tầm nhìn ra hồ bơi',
    en: 'Luxurious bedroom with pool view'
  },
  category: {
    vi: 'Phòng Ngủ',
    en: 'Bedroom'
  }
}, {
  id: 'fallback-3',
  src: '/lovable-uploads/3de4ca25-b7f7-4567-8e8a-de3b9ef3e8ab.png',
  alt: {
    vi: 'Không gian phòng khách thoáng đãng',
    en: 'Spacious living room area'
  },
  category: {
    vi: 'Phòng Khách',
    en: 'Living Room'
  }
}, {
  id: 'fallback-4',
  src: '/lovable-uploads/447ed5f1-0675-492c-8437-bb1fdf09ab86.png',
  alt: {
    vi: 'Phòng ăn và bếp đầy đủ tiện nghi',
    en: 'Fully equipped dining and kitchen area'
  },
  category: {
    vi: 'Phòng Ăn',
    en: 'Dining Room'
  }
}, {
  id: 'fallback-5',
  src: '/lovable-uploads/dd828878-82ae-4104-959b-b8793c180d89.png',
  alt: {
    vi: 'Phòng ngủ với thiết kế hiện đại',
    en: 'Bedroom with modern design'
  },
  category: {
    vi: 'Phòng Ngủ',
    en: 'Bedroom'
  }
}, {
  id: 'fallback-6',
  src: '/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png',
  alt: {
    vi: 'Khu vực lối vào villa',
    en: 'Villa entrance area'
  },
  category: {
    vi: 'Ngoại Thất',
    en: 'Exterior'
  }
}];
interface GalleryImage {
  id: string;
  src: string;
  alt: string | {
    vi: string;
    en: string;
  };
  category: string | {
    vi: string;
    en: string;
  };
}
const GallerySection = () => {
  const {
    language,
    t
  } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingImages, setLoadingImages] = useState(true);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchGalleryImages();
  }, []);
  const fetchGalleryImages = async () => {
    try {
      setLoadingImages(true);
      setError(false);
      const {
        data,
        error
      } = await supabase.from('gallery_images').select('*').order('created_at', {
        ascending: false
      });
      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setGalleryImages(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(img => {
          if (typeof img.category === 'object') {
            return img.category[language] || img.category.vi;
          }
          return img.category;
        }))];
        setCategories(uniqueCategories);
      } else {
        // If no images in database, use fallback images
        setGalleryImages(fallbackImages);

        // Extract unique categories from fallback images
        const uniqueCategories = [...new Set(fallbackImages.map(img => {
          if (typeof img.category === 'object') {
            return img.category[language] || img.category.vi;
          }
          return img.category;
        }))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError(true);

      // Use fallback images on error
      setGalleryImages(fallbackImages);

      // Extract unique categories from fallback images
      const uniqueCategories = [...new Set(fallbackImages.map(img => {
        if (typeof img.category === 'object') {
          return img.category[language] || img.category.vi;
        }
        return img.category;
      }))];
      setCategories(uniqueCategories);
      toast({
        title: t('error_loading_data'),
        description: t('error_loading_gallery'),
        variant: 'destructive'
      });
    } finally {
      setLoadingImages(false);
    }
  };

  // Helper function to get the localized alt text
  const getLocalizedAlt = (alt: string | {
    vi: string;
    en: string;
  }) => {
    if (typeof alt === 'object') {
      return alt[language] || alt.vi;
    }
    return alt;
  };

  // Helper function to get the localized category
  const getLocalizedCategory = (category: string | {
    vi: string;
    en: string;
  }) => {
    if (typeof category === 'object') {
      return category[language] || category.vi;
    }
    return category;
  };
  const filteredImages = selectedCategory === 'all' ? galleryImages : galleryImages.filter(image => {
    const imageCategory = getLocalizedCategory(image.category);
    return imageCategory === selectedCategory;
  });
  return <section className="py-20 bg-beach-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url(/pattern-light.svg)] opacity-5 z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <AnimationWrapper direction="up" duration={0.8} once={true}>
          <div className="text-center mb-12">
            <div className="inline-block mb-2 rounded bg-beach-100 px-3 py-1 text-sm font-semibold text-beach-800">
              {t('gallery')}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('discover_images')}
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              {t('gallery_desc')}
            </p>
          </div>
        </AnimationWrapper>

        {loadingImages ? <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
          </div> : <>
            <AnimationWrapper direction="up" delay={0.2} once={true}>
              <div className="flex justify-center mb-8 space-x-2 flex-wrap">
                <Button variant={selectedCategory === 'all' ? "default" : "outline"} className={selectedCategory === 'all' ? "bg-beach-600 hover:bg-beach-700 m-1" : "border-beach-200 text-beach-800 hover:bg-beach-100 m-1"} onClick={() => setSelectedCategory('all')}>
                  {t('all')}
                </Button>
                
                {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} className={selectedCategory === category ? "bg-beach-600 hover:bg-beach-700 m-1" : "border-beach-200 text-beach-800 hover:bg-beach-100 m-1"} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </Button>)}
              </div>
            </AnimationWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image, index) => <AnimationWrapper key={image.id || index} direction="up" delay={0.1 * (index % 3)} duration={0.6} once={true}>
                  <motion.div className="overflow-hidden rounded-lg shadow-lg bg-white" whileHover={{
              y: -5,
              transition: {
                duration: 0.3
              }
            }}>
                    <div className="h-72 overflow-hidden">
                      <img src={image.src} alt={getLocalizedAlt(image.alt)} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" onError={e => {
                  e.currentTarget.src = "/placeholder.svg";
                }} />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{getLocalizedAlt(image.alt)}</h3>
                      <p className="text-sm text-gray-500">{getLocalizedCategory(image.category)}</p>
                    </div>
                  </motion.div>
                </AnimationWrapper>)}
            </div>

            {error && <div className="text-center mt-6">
                <Button variant="outline" onClick={fetchGalleryImages} className="border-beach-200 text-beach-800 hover:bg-beach-100">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t('try_again')}
                </Button>
              </div>}

            <AnimationWrapper direction="up" delay={0.4} once={true}>
              <div className="text-center mt-12">
                <Button asChild className="bg-transparent border-2 border-beach-700 text-beach-700 hover:bg-beach-50 px-8 py-6">
                  <a href="#" className="inline-flex items-center">
                    <Camera className="mr-2 h-5 w-5" />
                    {t('view_more_images')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </AnimationWrapper>
          </>}
      </div>
    </section>;
};
export default GallerySection;