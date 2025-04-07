import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const slides = [
  {
    id: 1,
    image: "/lovable-uploads/32ffc101-dc48-4c38-a8ad-0b1f56dfaad0.png",
    titleKey: "peaceful_space",
    subtitleKey: "peaceful_space_desc",
  },
  {
    id: 2,
    image: "/lovable-uploads/635ad522-9789-42a4-b02a-6290f845f81a.png",
    titleKey: "luxury_experience",
    subtitleKey: "luxury_experience_desc",
  },
  {
    id: 3,
    image: "/lovable-uploads/5075ccfe-742f-4147-a0c4-7d2c00807201.png",
    titleKey: "premium_amenities",
    subtitleKey: "premium_amenities_desc",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBookNow = () => {
    navigate('/dat-phong');
  };

  const handleExplore = () => {
    navigate('/loai-phong');
  };

  return (
    <section className="relative h-[70vh] md:h-[75vh] overflow-hidden">
      {/* Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10" />
            <img
              src={slide.image}
              alt={t(slide.titleKey)}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-white font-sans font-bold text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight fade-in">
            {t(slides[currentSlide].titleKey)}
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-6">
            {t(slides[currentSlide].subtitleKey)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-primary hover:bg-green-800 text-white font-medium px-6 py-5 text-base"
              onClick={handleBookNow}
            >
              {t('book_now_action')}
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10 px-6 py-5 text-base"
              onClick={handleExplore}
            >
              {t('explore')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-primary" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
