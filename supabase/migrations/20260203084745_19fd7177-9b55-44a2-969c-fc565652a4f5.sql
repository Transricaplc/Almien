-- ============================================
-- SAFE ZONES TABLE - Stores safe locations across Cape Town
-- ============================================
CREATE TABLE public.safe_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL, -- 'police_station', 'hospital', 'fire_station', 'community_center', 'shopping_mall', 'cid_office', 'security_booth'
  address TEXT NOT NULL,
  neighborhood TEXT,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  contact_number TEXT,
  operating_hours JSONB DEFAULT '{}',
  safety_rating INTEGER DEFAULT 5 CHECK (safety_rating >= 1 AND safety_rating <= 5),
  is_24_hours BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.safe_zones ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read safe zones" ON public.safe_zones
  FOR SELECT USING (true);

-- Create index for geo queries
CREATE INDEX idx_safe_zones_location ON public.safe_zones (latitude, longitude);
CREATE INDEX idx_safe_zones_type ON public.safe_zones (zone_type);
CREATE INDEX idx_safe_zones_neighborhood ON public.safe_zones (neighborhood);

-- Add updated_at trigger
CREATE TRIGGER update_safe_zones_updated_at
  BEFORE UPDATE ON public.safe_zones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- NEIGHBORHOOD RATINGS TABLE - Safety scores per area
-- ============================================
CREATE TABLE public.neighborhood_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  neighborhood TEXT NOT NULL UNIQUE,
  safety_score NUMERIC(3, 2) NOT NULL CHECK (safety_score >= 0 AND safety_score <= 5),
  crime_rate TEXT NOT NULL CHECK (crime_rate IN ('very_low', 'low', 'medium', 'high', 'very_high')),
  crime_count_30d INTEGER DEFAULT 0,
  robbery_count INTEGER DEFAULT 0,
  assault_count INTEGER DEFAULT 0,
  burglary_count INTEGER DEFAULT 0,
  theft_count INTEGER DEFAULT 0,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  population_estimate INTEGER,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.neighborhood_ratings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read neighborhood ratings" ON public.neighborhood_ratings
  FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_neighborhood_ratings_score ON public.neighborhood_ratings (safety_score DESC);
CREATE INDEX idx_neighborhood_ratings_location ON public.neighborhood_ratings (latitude, longitude);

-- ============================================
-- SEED DATA - Cape Town Safe Zones
-- ============================================
INSERT INTO public.safe_zones (name, zone_type, address, neighborhood, latitude, longitude, contact_number, is_24_hours, operating_hours) VALUES
-- Police Stations
('Cape Town Central SAPS', 'police_station', 'Buitenkant Street, CBD', 'CBD', -33.9283, 18.4216, '021 467 8000', true, '{}'),
('Sea Point SAPS', 'police_station', 'Main Road, Sea Point', 'Sea Point', -33.9172, 18.3850, '021 430 3700', true, '{}'),
('Camps Bay SAPS', 'police_station', 'Victoria Road, Camps Bay', 'Camps Bay', -33.9501, 18.3760, '021 437 8401', true, '{}'),
('Woodstock SAPS', 'police_station', 'Victoria Road, Woodstock', 'Woodstock', -33.9280, 18.4450, '021 442 3200', true, '{}'),
('Claremont SAPS', 'police_station', 'Main Road, Claremont', 'Claremont', -33.9860, 18.4680, '021 657 2240', true, '{}'),
('Wynberg SAPS', 'police_station', 'Main Road, Wynberg', 'Wynberg', -34.0000, 18.4660, '021 761 3000', true, '{}'),
('Bellville SAPS', 'police_station', 'Durban Road, Bellville', 'Bellville', -33.9010, 18.6280, '021 918 3000', true, '{}'),
('Mitchells Plain SAPS', 'police_station', 'Town Centre, Mitchells Plain', 'Mitchells Plain', -34.0470, 18.6180, '021 370 1600', true, '{}'),

-- Hospitals
('Groote Schuur Hospital', 'hospital', 'Main Road, Observatory', 'Observatory', -33.9420, 18.4620, '021 404 9111', true, '{}'),
('Tygerberg Hospital', 'hospital', 'Francie van Zijl Drive, Parow', 'Parow', -33.8970, 18.6070, '021 938 4911', true, '{}'),
('Red Cross War Memorial Childrens Hospital', 'hospital', 'Klipfontein Road, Rondebosch', 'Rondebosch', -33.9570, 18.4690, '021 658 5111', true, '{}'),
('Victoria Hospital', 'hospital', 'Belmont Road, Wynberg', 'Wynberg', -34.0050, 18.4730, '021 799 1111', true, '{}'),
('Netcare Christiaan Barnard Hospital', 'hospital', 'DF Malan Street, CBD', 'CBD', -33.9220, 18.4180, '021 441 0000', true, '{}'),
('Mediclinic Cape Town', 'hospital', 'Loop Street, CBD', 'CBD', -33.9200, 18.4200, '021 464 5500', true, '{}'),

-- CID Offices
('CCID Urban Safety', 'cid_office', 'Long Street, CBD', 'CBD', -33.9210, 18.4230, '021 426 1325', false, '{"mon-fri": "07:00-19:00", "sat": "08:00-17:00"}'),
('Sea Point CID', 'cid_office', 'Main Road, Sea Point', 'Sea Point', -33.9170, 18.3850, '021 434 1010', false, '{"mon-fri": "07:00-19:00"}'),
('V&A Waterfront Security', 'cid_office', 'V&A Waterfront', 'V&A Waterfront', -33.9030, 18.4210, '021 408 7600', true, '{}'),
('Claremont CID', 'cid_office', 'Main Road, Claremont', 'Claremont', -33.9830, 18.4640, '021 671 8331', false, '{"mon-fri": "06:00-22:00"}'),
('Constantia Security', 'cid_office', 'Constantia Main Road', 'Constantia', -34.0200, 18.4350, '021 794 7677', false, '{"mon-sun": "06:00-22:00"}'),

-- Shopping Malls (Safe havens)
('V&A Waterfront', 'shopping_mall', 'V&A Waterfront', 'V&A Waterfront', -33.9050, 18.4180, '021 408 7600', false, '{"daily": "09:00-21:00"}'),
('Canal Walk', 'shopping_mall', 'Century Boulevard, Century City', 'Century City', -33.8940, 18.5120, '021 529 9699', false, '{"daily": "09:00-21:00"}'),
('Cavendish Square', 'shopping_mall', 'Dreyer Street, Claremont', 'Claremont', -33.9830, 18.4620, '021 657 5620', false, '{"daily": "09:00-18:00"}'),
('Gateway Theatre', 'shopping_mall', 'Durban Road, Bellville', 'Bellville', -33.9050, 18.6250, '021 946 3500', false, '{"daily": "09:00-18:00"}'),

-- Fire Stations
('Cape Town Central Fire Station', 'fire_station', 'Corporation Street, CBD', 'CBD', -33.9250, 18.4200, '021 480 7700', true, '{}'),
('Sea Point Fire Station', 'fire_station', 'Main Road, Sea Point', 'Sea Point', -33.9180, 18.3860, '021 430 3750', true, '{}'),
('Bellville Fire Station', 'fire_station', 'Voortrekker Road, Bellville', 'Bellville', -33.9030, 18.6280, '021 918 3050', true, '{}');

-- ============================================
-- SEED DATA - Neighborhood Ratings
-- ============================================
INSERT INTO public.neighborhood_ratings (neighborhood, safety_score, crime_rate, crime_count_30d, robbery_count, assault_count, burglary_count, theft_count, latitude, longitude) VALUES
('CBD', 2.80, 'high', 142, 38, 28, 32, 44, -33.9258, 18.4232),
('Sea Point', 4.10, 'low', 28, 5, 6, 8, 9, -33.9180, 18.3850),
('Camps Bay', 4.50, 'very_low', 12, 2, 1, 4, 5, -33.9501, 18.3760),
('Clifton', 4.70, 'very_low', 8, 1, 0, 3, 4, -33.9390, 18.3780),
('V&A Waterfront', 4.20, 'low', 22, 6, 4, 5, 7, -33.9030, 18.4210),
('Green Point', 3.80, 'low', 35, 8, 7, 10, 10, -33.9130, 18.4050),
('Woodstock', 2.90, 'medium', 68, 15, 12, 18, 23, -33.9280, 18.4450),
('Observatory', 3.20, 'medium', 52, 12, 10, 14, 16, -33.9380, 18.4650),
('Rondebosch', 3.80, 'low', 34, 6, 5, 12, 11, -33.9620, 18.4730),
('Claremont', 4.00, 'low', 30, 5, 4, 10, 11, -33.9830, 18.4640),
('Newlands', 4.20, 'low', 25, 4, 3, 9, 9, -33.9750, 18.4580),
('Constantia', 4.30, 'low', 22, 3, 2, 10, 7, -34.0200, 18.4350),
('Wynberg', 3.10, 'medium', 58, 14, 11, 16, 17, -34.0000, 18.4660),
('Kenilworth', 3.60, 'low', 38, 8, 6, 12, 12, -33.9970, 18.4800),
('Bellville', 3.00, 'medium', 65, 16, 14, 18, 17, -33.9010, 18.6280),
('Century City', 4.10, 'low', 26, 4, 3, 8, 11, -33.8940, 18.5120),
('Milnerton', 3.50, 'medium', 45, 10, 8, 14, 13, -33.8690, 18.4970),
('Bloubergstrand', 3.90, 'low', 32, 6, 5, 11, 10, -33.8100, 18.4700),
('Hout Bay', 3.40, 'medium', 42, 10, 8, 12, 12, -34.0450, 18.3530),
('Llandudno', 4.60, 'very_low', 10, 1, 1, 4, 4, -34.0100, 18.3420),
('Khayelitsha', 1.80, 'very_high', 210, 55, 48, 45, 62, -34.0440, 18.6750),
('Mitchells Plain', 2.10, 'high', 165, 42, 38, 40, 45, -34.0470, 18.6180),
('Gugulethu', 1.90, 'very_high', 185, 48, 42, 43, 52, -33.9780, 18.5680),
('Nyanga', 1.70, 'very_high', 220, 58, 52, 50, 60, -33.9910, 18.5870),
('Philippi', 2.00, 'high', 175, 45, 40, 42, 48, -34.0150, 18.5450),
('Athlone', 2.60, 'medium', 78, 18, 15, 22, 23, -33.9620, 18.5050),
('Pinelands', 3.90, 'low', 30, 5, 4, 11, 10, -33.9380, 18.5050),
('Mowbray', 3.30, 'medium', 48, 11, 9, 14, 14, -33.9500, 18.4750);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.safe_zones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.neighborhood_ratings;