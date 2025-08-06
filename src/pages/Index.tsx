
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import RoomTypesSection from "@/components/home/RoomTypesSection";
import AmenitiesSection from "@/components/home/AmenitiesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <RoomTypesSection />
      <AmenitiesSection />
      <TestimonialsSection />
      
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
