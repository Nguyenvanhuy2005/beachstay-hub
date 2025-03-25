
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBooking = () => {
    navigate('/dat-phong');
  };

  const handleViewRooms = () => {
    navigate('/loai-phong');
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/lovable-uploads/4f6b5954-4f23-421b-b0cd-beee0b9c8bc3.png"
          alt="Annam Village Resort"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 md:px-6 flex flex-col justify-center items-center md:items-start text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 drop-shadow-lg">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button 
              size="lg"
              className="bg-beach-500 hover:bg-beach-600 text-white px-8 py-6 text-lg"
              onClick={handleBooking}
            >
              {t('home.hero.buttonText')}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={handleViewRooms}
            >
              {t('common.viewRooms')}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white/80 text-sm mb-2">
            {t('common.scrollDown')}
          </span>
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <motion.div 
              className="w-1.5 h-3 bg-white/80 rounded-full mt-2"
              animate={{ 
                y: [0, 12, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            ></motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
