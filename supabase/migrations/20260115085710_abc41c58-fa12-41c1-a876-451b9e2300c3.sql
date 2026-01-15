-- Create water_status table for dam levels and water outages
CREATE TABLE public.water_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dam_name TEXT NOT NULL,
  dam_code TEXT NOT NULL UNIQUE,
  current_level DECIMAL(5,2) NOT NULL DEFAULT 0,
  capacity_ml DECIMAL(10,2) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'low', 'critical', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create water_outages table for burst pipes and planned maintenance
CREATE TABLE public.water_outages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suburb TEXT NOT NULL,
  area_description TEXT NOT NULL,
  outage_type TEXT NOT NULL DEFAULT 'burst' CHECK (outage_type IN ('burst', 'planned', 'emergency')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estimated_end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hiking_trails table
CREATE TABLE public.hiking_trails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'difficult', 'extreme')),
  distance_km DECIMAL(5,2) NOT NULL,
  elevation_gain_m INTEGER NOT NULL DEFAULT 0,
  estimated_hours DECIMAL(4,2) NOT NULL,
  sunrise_time TIME,
  sunset_time TIME,
  is_open BOOLEAN NOT NULL DEFAULT true,
  safety_notes TEXT,
  coordinates_lat DECIMAL(10,7),
  coordinates_lng DECIMAL(10,7),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create beaches table
CREATE TABLE public.beaches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  shark_flag_status TEXT NOT NULL DEFAULT 'green' CHECK (shark_flag_status IN ('green', 'yellow', 'red', 'black')),
  water_quality TEXT NOT NULL DEFAULT 'good' CHECK (water_quality IN ('excellent', 'good', 'fair', 'poor')),
  lifeguard_on_duty BOOLEAN NOT NULL DEFAULT false,
  current_conditions TEXT,
  water_temp_celsius DECIMAL(4,1),
  wind_speed_kmh INTEGER,
  is_open BOOLEAN NOT NULL DEFAULT true,
  coordinates_lat DECIMAL(10,7),
  coordinates_lng DECIMAL(10,7),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loadshedding_status table
CREATE TABLE public.loadshedding_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage INTEGER NOT NULL DEFAULT 0,
  suburb TEXT,
  area_code TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'eskom',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weather_data table for caching
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL DEFAULT 'Cape Town',
  temperature_celsius DECIMAL(4,1),
  feels_like_celsius DECIMAL(4,1),
  humidity_percent INTEGER,
  wind_speed_kmh DECIMAL(5,1),
  wind_direction TEXT,
  description TEXT,
  icon_code TEXT,
  uv_index INTEGER,
  visibility_km DECIMAL(5,1),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flight_status table
CREATE TABLE public.flight_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_number TEXT NOT NULL,
  airline TEXT NOT NULL,
  flight_type TEXT NOT NULL CHECK (flight_type IN ('arrival', 'departure')),
  origin_destination TEXT NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'boarding', 'departed', 'in_flight', 'landed', 'delayed', 'cancelled')),
  terminal TEXT,
  gate TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.water_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_outages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiking_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loadshedding_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_status ENABLE ROW LEVEL SECURITY;

-- Create public read policies for all tables (public safety data)
CREATE POLICY "Anyone can read water status" ON public.water_status FOR SELECT USING (true);
CREATE POLICY "Anyone can read water outages" ON public.water_outages FOR SELECT USING (true);
CREATE POLICY "Anyone can read hiking trails" ON public.hiking_trails FOR SELECT USING (true);
CREATE POLICY "Anyone can read beaches" ON public.beaches FOR SELECT USING (true);
CREATE POLICY "Anyone can read loadshedding status" ON public.loadshedding_status FOR SELECT USING (true);
CREATE POLICY "Anyone can read weather data" ON public.weather_data FOR SELECT USING (true);
CREATE POLICY "Anyone can read flight status" ON public.flight_status FOR SELECT USING (true);