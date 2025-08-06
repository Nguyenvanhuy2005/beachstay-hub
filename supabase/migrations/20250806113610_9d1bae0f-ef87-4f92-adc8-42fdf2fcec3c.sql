-- Temporarily disable RLS for consultation_requests to allow form submissions
ALTER TABLE public.consultation_requests DISABLE ROW LEVEL SECURITY;

-- Verify the change
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'consultation_requests';