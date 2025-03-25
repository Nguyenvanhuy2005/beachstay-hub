
import React, { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";

// Sử dụng React.lazy cho các section không cần thiết ngay lập tức
const AboutSection = React.lazy(() => import("@/components/home/AboutSection"));
const RoomTypesSection = React.lazy(() => import("@/components/home/RoomTypesSection"));
const AmenitiesSection = React.lazy(() => import("@/components/home/AmenitiesSection"));
const TestimonialsSection = React.lazy(() => import("@/components/home/TestimonialsSection"));
const GallerySection = React.lazy(() => import("@/components/home/GallerySection"));
const CtaSection = React.lazy(() => import("@/components/home/CtaSection"));

// Component loading fallback
const SectionFallback = () => (
  <div className="w-full py-16">
    <Skeleton className="w-[80%] h-8 mx-auto mb-4" />
    <Skeleton className="w-[60%] h-6 mx-auto mb-8" />
    <div className="flex flex-wrap justify-center gap-4">
      <Skeleton className="w-[300px] h-[200px]" />
      <Skeleton className="w-[300px] h-[200px]" />
      <Skeleton className="w-[300px] h-[200px]" />
    </div>
  </div>
);

const Index = () => {
  return (
    <MainLayout>
      {/* HeroSection luôn được tải ngay lập tức */}
      <HeroSection />
      
      {/* Các section khác được lazy load */}
      <Suspense fallback={<SectionFallback />}>
        <AboutSection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <RoomTypesSection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <AmenitiesSection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <GallerySection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <CtaSection />
      </Suspense>
    </MainLayout>
  );
};

export default Index;
