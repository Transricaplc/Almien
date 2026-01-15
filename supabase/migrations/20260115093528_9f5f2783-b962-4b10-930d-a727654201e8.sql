-- Create the update function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create citizen_reports table for the reporting module
CREATE TABLE public.citizen_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  infrastructure_type TEXT,
  description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.citizen_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reports (for transparency)
CREATE POLICY "Anyone can read citizen reports"
  ON public.citizen_reports
  FOR SELECT
  USING (true);

-- Allow anyone to create reports (public reporting)
CREATE POLICY "Anyone can create citizen reports"
  ON public.citizen_reports
  FOR INSERT
  WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_citizen_reports_updated_at
  BEFORE UPDATE ON public.citizen_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();