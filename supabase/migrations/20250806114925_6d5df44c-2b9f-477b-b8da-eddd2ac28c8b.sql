-- Temporarily disable RLS on bookings table to allow customer bookings
-- This is a temporary fix to allow customers to book rooms

-- Disable RLS for bookings table
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'bookings';

-- Add a comment for tracking
COMMENT ON TABLE public.bookings IS 'RLS temporarily disabled to fix customer booking issues. Re-enable after investigation.';