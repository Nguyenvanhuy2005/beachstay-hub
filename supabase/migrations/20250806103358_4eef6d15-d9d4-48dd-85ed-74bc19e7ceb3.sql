-- Create consultation_requests table
CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  preferred_date DATE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Allow public to insert consultation requests
CREATE POLICY "Allow public insert access to consultation_requests" 
ON public.consultation_requests 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to view all consultation requests
CREATE POLICY "Admins can view all consultation_requests" 
ON public.consultation_requests 
FOR SELECT 
USING (is_admin());

-- Allow admins to update consultation requests
CREATE POLICY "Admins can update consultation_requests" 
ON public.consultation_requests 
FOR UPDATE 
USING (is_admin());

-- Allow admins to delete consultation requests
CREATE POLICY "Admins can delete consultation_requests" 
ON public.consultation_requests 
FOR DELETE 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_consultation_requests_updated_at
BEFORE UPDATE ON public.consultation_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();