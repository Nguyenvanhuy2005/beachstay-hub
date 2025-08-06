-- Fix remaining RLS security issues
-- Enable RLS on all tables that need it

-- Enable RLS on holiday_prices if not already enabled
ALTER TABLE public.holiday_prices ENABLE ROW LEVEL SECURITY;

-- Enable RLS on room_date_prices if not already enabled  
ALTER TABLE public.room_date_prices ENABLE ROW LEVEL SECURITY;

-- Ensure all tables in public schema have RLS enabled
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;