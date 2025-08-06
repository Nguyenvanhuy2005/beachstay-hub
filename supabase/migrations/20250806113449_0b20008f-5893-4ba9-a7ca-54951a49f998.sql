-- First, check what policies currently exist
SELECT policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'consultation_requests';

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Allow public insert access to consultation_requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Enable public insert for consultation_requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Admins can view all consultation_requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Admins can update consultation_requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Admins can delete consultation_requests" ON public.consultation_requests;

-- Temporarily disable RLS to clear any issues
ALTER TABLE public.consultation_requests DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Create a simple, working public insert policy
CREATE POLICY "public_insert_consultation" 
ON public.consultation_requests 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Create admin policies
CREATE POLICY "admin_select_consultation" 
ON public.consultation_requests 
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "admin_update_consultation" 
ON public.consultation_requests 
FOR UPDATE 
TO authenticated
USING (is_admin());

CREATE POLICY "admin_delete_consultation" 
ON public.consultation_requests 
FOR DELETE 
TO authenticated
USING (is_admin());