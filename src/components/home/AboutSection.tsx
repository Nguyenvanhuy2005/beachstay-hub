
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { language, t } = useLanguage();
  const isVietnamese = language === 'vi';

  return (
    <section className="py-20 bg-gradient-to-b from-white to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative">
              <img 
                src="/lovable-uploads/595dc250-29ec-4d1d-873b-d34aecdba712.png"
                alt={isVietnamese ? "Annam Village - Không gian nghỉ dưỡng" : "Annam Village - Retreat space"}
                className="rounded-lg shadow-xl w-full h-auto"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <img 
                  src="/lovable-uploads/cdfb47b1-e949-44cc-85b1-de98fba2961e.png"
                  alt={isVietnamese ? "Chi tiết thiết kế" : "Design details"}
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="inline-block mb-2 rounded bg-secondary px-3 py-1 text-sm font-semibold text-primary">
              {t('about_annam')}
            </div>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {isVietnamese ? (
                <>Không gian nghỉ dưỡng <span className="text-primary">đẳng cấp</span> tại Vũng Tàu</>
              ) : (
                <>Luxury <span className="text-primary">retreat space</span> in Vung Tau</>
              )}
            </h2>
            <p className="text-gray-700 mb-6">
              {t('about_description')}
            </p>
            <p className="text-gray-700 mb-8">
              {t('villa_description')}
            </p>
            <Button className="bg-primary hover:bg-green-800 text-white px-8 py-6">
              {t('learn_more')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
