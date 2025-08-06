-- Fix the RLS issue that's causing booking failures
-- Re-enable RLS for consultation_requests and ensure all tables have proper RLS configuration

-- Re-enable RLS for consultation_requests table
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Verify bookings table has proper RLS (it should already be enabled)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Verify other tables have RLS enabled
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_date_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holiday_prices ENABLE ROW LEVEL SECURITY;

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;