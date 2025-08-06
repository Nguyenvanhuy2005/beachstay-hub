-- COMPREHENSIVE SECURITY FIX MIGRATION
-- This migration addresses all critical security vulnerabilities

-- 1. Drop all existing conflicting policies first
DROP POLICY IF EXISTS "Allow anonymous access to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow anonymous inserts to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow anonymous updates to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow anonymous deletes to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow anonymous access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous inserts to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous updates to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous deletes to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public insert to room_types" ON public.room_types;
DROP POLICY IF EXISTS "Allow public update to room_types" ON public.room_types;
DROP POLICY IF EXISTS "Allow public delete from room_types" ON public.room_types;

-- 2. Enable RLS on admin_access table (CRITICAL)
ALTER TABLE public.admin_access ENABLE ROW LEVEL SECURITY;

-- 3. Create secure admin_access policies
CREATE POLICY "Only admins can view admin_access"
ON public.admin_access
FOR SELECT
USING (is_admin());

CREATE POLICY "Only admins can insert admin_access"
ON public.admin_access
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update admin_access"
ON public.admin_access
FOR UPDATE
USING (is_admin());

CREATE POLICY "Only admins can delete admin_access"
ON public.admin_access
FOR DELETE
USING (is_admin());

-- 4. Secure blog_posts policies (remove anonymous access)
CREATE POLICY "Admins can manage blog_posts"
ON public.blog_posts
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 5. Secure bookings policies (protect customer PII)
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can update booking status"
ON public.bookings
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
USING (is_admin());

-- Keep public insert for booking form
CREATE POLICY "Allow public booking creation"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- 6. Secure room_types (remove public write access)
CREATE POLICY "Admins can manage room_types"
ON public.room_types
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update room_types"
ON public.room_types
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete room_types"
ON public.room_types
FOR DELETE
USING (is_admin());

-- 7. Enhance is_admin function with search_path security
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_email TEXT;
BEGIN
  -- Get the current user's email directly from auth.users
  SELECT email INTO current_email FROM auth.users WHERE id = auth.uid();
  
  -- Simply check if the email exists in admin_access table
  RETURN EXISTS (
    SELECT 1 FROM public.admin_access 
    WHERE email = current_email AND is_active = true
  );
END;
$function$;

-- 8. Enhance check_room_availability function with search_path security
CREATE OR REPLACE FUNCTION public.check_room_availability(p_room_type_id uuid, p_check_in date, p_check_out date)
RETURNS TABLE(available boolean, remaining_rooms integer)
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  total_rooms INTEGER := 5; -- Default 5 rooms per type
  booked_rooms INTEGER;
BEGIN
  -- Count bookings for this room type that overlap with requested dates
  -- Only count confirmed or pending bookings
  SELECT COUNT(*) INTO booked_rooms
  FROM public.bookings
  WHERE room_type_id = p_room_type_id
  AND status IN ('confirmed', 'pending')
  AND (
    (check_in <= p_check_out AND check_out >= p_check_in)
  );
  
  remaining_rooms := greatest(0, total_rooms - booked_rooms);
  available := (remaining_rooms > 0);
  
  RETURN QUERY SELECT available, remaining_rooms;
END;
$function$;