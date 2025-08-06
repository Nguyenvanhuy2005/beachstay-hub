-- Fix the duplicate INSERT policies on bookings table
-- Remove the duplicate policy and keep only one clear policy

-- Drop the duplicate policy
DROP POLICY IF EXISTS "Allow public insert access to bookings" ON public.bookings;

-- Keep the clearer named policy
-- Verify that "Allow public booking creation" policy exists and works correctly
DO $$
BEGIN
    -- Check if the policy exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Allow public booking creation'
    ) THEN
        CREATE POLICY "Allow public booking creation" 
        ON public.bookings 
        FOR INSERT 
        WITH CHECK (true);
    END IF;
END $$;

-- Verify current policies
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'bookings' 
ORDER BY policyname;