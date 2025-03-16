
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AboutPage from "./pages/AboutPage";
import RoomTypesPage from "./pages/RoomTypesPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPage from "./pages/AdminPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiePage from "./pages/CookiePage";
import { supabase } from './lib/supabase';
import { useToast } from './hooks/use-toast';
import { useEffect } from 'react';

// Create QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Ensure we have a storage bucket for images
    const createImageBucket = async () => {
      try {
        const { error } = await supabase.functions.invoke('create-image-bucket');
        
        if (error) {
          console.error('Error creating image bucket:', error);
        }
      } catch (err) {
        console.error('Failed to initialize image bucket:', err);
      }
    };
    
    createImageBucket();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" richColors closeButton />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ve-chung-toi" element={<AboutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/loai-phong" element={<RoomTypesPage />} />
              <Route path="/rooms" element={<RoomTypesPage />} />
              <Route path="/loai-phong/:id" element={<RoomDetailPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
              <Route path="/dich-vu" element={<ServicesPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/lien-he" element={<ContactPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dat-phong" element={<BookingPage />} />
              <Route path="/booking-success" element={<BookingSuccessPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/dieu-khoan" element={<TermsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/bao-mat" element={<PrivacyPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookie" element={<CookiePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
