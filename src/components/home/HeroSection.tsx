
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const slides = [
  {
    id: 1,
    image: "/lovable-uploads/842f894d-4d09-4b7b-9de4-e68c7d1e2e30.png",
    titleKey: "peaceful_space",
    subtitleKey: "peaceful_space_desc",
  },
  {
    id: 2,
    image: "/lovable-uploads/3de4ca25-b7f7-4567-8e8a-de3b9ef3e8ab.png",
    titleKey: "luxury_experience",
    subtitleKey: "luxury_experience_desc",
  },
  {
    id: 3,
    image: "/lovable-uploads/447ed5f1-0675-492c-8437-bb1fdf09ab86.png",
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
    <section className="relative h-screen overflow-hidden">
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
          <h1 className="text-white font-sans font-bold text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight fade-in">
            {t(slides[currentSlide].titleKey)}
          </h1>
          <p className="text-white/90 text-xl md:text-2xl mb-8">
            {t(slides[currentSlide].subtitleKey)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-primary hover:bg-green-800 text-white font-medium px-8 py-6 text-lg"
              onClick={handleBookNow}
            >
              {t('book_now_action')}
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={handleExplore}
            >
              {t('explore')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
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
