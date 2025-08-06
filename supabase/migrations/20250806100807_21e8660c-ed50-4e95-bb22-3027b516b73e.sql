-- Fix critical security issues: Enable RLS and secure database functions

-- Enable RLS on tables that have policies but RLS disabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Secure database functions by adding search_path protection
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.check_room_availability(p_room_type_id uuid, p_check_in date, p_check_out date)
 RETURNS TABLE(available boolean, remaining_rooms integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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