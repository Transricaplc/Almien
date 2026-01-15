-- Create train_routes table for live rail data
CREATE TABLE public.train_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  safety_score INTEGER NOT NULL DEFAULT 50,
  stations INTEGER NOT NULL DEFAULT 0,
  operating_cameras INTEGER NOT NULL DEFAULT 0,
  total_cameras INTEGER NOT NULL DEFAULT 0,
  incidents_24h INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'moderate',
  is_operational BOOLEAN NOT NULL DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.train_routes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read train routes"
ON public.train_routes
FOR SELECT
USING (true);

-- Create wind_reports table for Cape Town wind data
CREATE TABLE public.wind_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  wind_speed_kmh NUMERIC NOT NULL,
  wind_gust_kmh NUMERIC,
  wind_direction TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'moderate',
  affects_drivers BOOLEAN NOT NULL DEFAULT false,
  affects_beach_goers BOOLEAN NOT NULL DEFAULT false,
  affects_surfers BOOLEAN NOT NULL DEFAULT false,
  affects_hikers BOOLEAN NOT NULL DEFAULT false,
  advisory TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wind_reports ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read wind reports"
ON public.wind_reports
FOR SELECT
USING (true);

-- Insert Cape Town train routes
INSERT INTO public.train_routes (route_code, name, safety_score, stations, operating_cameras, total_cameras, incidents_24h, status) VALUES
('SOUTHERN', 'Southern Line', 45, 32, 18, 32, 15, 'high_risk'),
('CENTRAL', 'Central Line', 32, 28, 12, 28, 24, 'critical'),
('NORTHERN', 'Northern Line', 68, 18, 15, 18, 6, 'moderate'),
('CAPE_FLATS', 'Cape Flats Line', 38, 22, 10, 22, 20, 'critical');

-- Insert Cape Town wind report
INSERT INTO public.wind_reports (location, wind_speed_kmh, wind_gust_kmh, wind_direction, description, severity, affects_drivers, affects_beach_goers, affects_surfers, affects_hikers, advisory) VALUES
('Cape Town Metro', 45, 65, 'SE', 'Strong South-Easter (Cape Doctor) active', 'high', true, true, true, true, 'Strong winds expected. Secure loose items. High-sided vehicles exercise caution on N1/N2.'),
('False Bay', 38, 52, 'SE', 'Moderate offshore winds', 'moderate', false, true, true, false, 'Good surfing conditions at Muizenberg. Beach umbrellas not advised.'),
('Table Bay', 52, 78, 'SE', 'Very strong gusts at waterfront', 'severe', true, true, false, true, 'Avoid outdoor dining at V&A. Pedestrians take care near buildings.'),
('Cape Point', 60, 85, 'SE', 'Extreme wind conditions', 'severe', true, true, false, true, 'Cape Point Nature Reserve: exercise extreme caution on cliff walks.');