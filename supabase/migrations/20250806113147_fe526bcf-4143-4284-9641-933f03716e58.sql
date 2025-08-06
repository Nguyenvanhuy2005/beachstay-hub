-- Check current RLS policies for consultation_requests
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'consultation_requests';

-- Drop and recreate the public insert policy to fix the issue
DROP POLICY IF EXISTS "Allow public insert access to consultation_requests" ON public.consultation_requests;

-- Create a new policy that definitely allows public inserts
CREATE POLICY "Enable public insert for consultation_requests" 
ON public.consultation_requests 
FOR INSERT 
TO public
WITH CHECK (true);

-- Also ensure RLS is enabled
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;