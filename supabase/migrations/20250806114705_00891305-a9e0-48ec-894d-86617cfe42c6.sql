-- Debug and fix RLS for bookings table
-- The issue is that INSERT policy might have conflicts

-- First, let's check the exact INSERT policy definition
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'bookings' AND cmd = 'INSERT';

-- Drop the current INSERT policy and recreate it properly
DROP POLICY IF EXISTS "Allow public booking creation" ON public.bookings;

-- Create a new, explicit INSERT policy for anonymous users
CREATE POLICY "Public can insert bookings" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Verify the new policy
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'bookings' AND cmd = 'INSERT';