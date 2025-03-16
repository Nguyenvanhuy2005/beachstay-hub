
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import './index.css';
import App from './App';
import Index from './pages/Index';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import AmenitiesPage from './pages/AmenitiesPage';
import RoomTypesPage from './pages/RoomTypesPage';
import RoomDetailPage from './pages/RoomDetailPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFound from './pages/NotFound';

import { LanguageProvider } from './contexts/LanguageContext';

// Create a query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Index />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="amenities" element={<AmenitiesPage />} />
              <Route path="rooms" element={<RoomTypesPage />} />
              <Route path="rooms/:id" element={<RoomDetailPage />} />
              <Route path="dat-phong" element={<BookingPage />} />
              <Route path="booking-success" element={<BookingSuccessPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
              <Route path="admin-login" element={<AdminLoginPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
