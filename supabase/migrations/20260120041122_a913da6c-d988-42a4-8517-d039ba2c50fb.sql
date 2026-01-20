-- Create geographic hierarchy tables for SafeSync ontology

-- 1. Regions (Province level)
CREATE TABLE IF NOT EXISTS public.geo_regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Districts (Metro/District municipalities)
CREATE TABLE IF NOT EXISTS public.geo_districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id UUID NOT NULL REFERENCES public.geo_regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  municipality_type TEXT NOT NULL CHECK (municipality_type IN ('Metropolitan', 'District')),
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(region_id, name)
);

-- 3. Local Municipalities (for District municipalities)
CREATE TABLE IF NOT EXISTS public.geo_local_municipalities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id UUID NOT NULL REFERENCES public.geo_districts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(district_id, name)
);

-- 4. Wards
CREATE TABLE IF NOT EXISTS public.geo_wards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ward_number INTEGER NOT NULL,
  district_id UUID REFERENCES public.geo_districts(id) ON DELETE CASCADE,
  local_municipality_id UUID REFERENCES public.geo_local_municipalities(id) ON DELETE CASCADE,
  boundary_geojson JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT ward_has_parent CHECK (district_id IS NOT NULL OR local_municipality_id IS NOT NULL)
);

-- 5. Suburbs with postcodes
CREATE TABLE IF NOT EXISTS public.geo_suburbs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  postcode TEXT NOT NULL,
  district_id UUID REFERENCES public.geo_districts(id) ON DELETE CASCADE,
  local_municipality_id UUID REFERENCES public.geo_local_municipalities(id) ON DELETE CASCADE,
  coordinates_lat NUMERIC,
  coordinates_lng NUMERIC,
  boundary_geojson JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Ward-Suburb mapping (many-to-many)
CREATE TABLE IF NOT EXISTS public.geo_ward_suburbs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ward_id UUID NOT NULL REFERENCES public.geo_wards(id) ON DELETE CASCADE,
  suburb_id UUID NOT NULL REFERENCES public.geo_suburbs(id) ON DELETE CASCADE,
  coverage_percent NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ward_id, suburb_id)
);

-- Enable RLS
ALTER TABLE public.geo_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_local_municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_suburbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_ward_suburbs ENABLE ROW LEVEL SECURITY;

-- Public read policies (geographic data is public)
CREATE POLICY "Anyone can read regions" ON public.geo_regions FOR SELECT USING (true);
CREATE POLICY "Anyone can read districts" ON public.geo_districts FOR SELECT USING (true);
CREATE POLICY "Anyone can read local municipalities" ON public.geo_local_municipalities FOR SELECT USING (true);
CREATE POLICY "Anyone can read wards" ON public.geo_wards FOR SELECT USING (true);
CREATE POLICY "Anyone can read suburbs" ON public.geo_suburbs FOR SELECT USING (true);
CREATE POLICY "Anyone can read ward suburbs" ON public.geo_ward_suburbs FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_geo_districts_region ON public.geo_districts(region_id);
CREATE INDEX idx_geo_local_municipalities_district ON public.geo_local_municipalities(district_id);
CREATE INDEX idx_geo_wards_district ON public.geo_wards(district_id);
CREATE INDEX idx_geo_wards_local_municipality ON public.geo_wards(local_municipality_id);
CREATE INDEX idx_geo_suburbs_district ON public.geo_suburbs(district_id);
CREATE INDEX idx_geo_suburbs_postcode ON public.geo_suburbs(postcode);
CREATE INDEX idx_geo_suburbs_name ON public.geo_suburbs(name);

-- Seed Western Cape region
INSERT INTO public.geo_regions (name, code) VALUES ('Western Cape', 'WC');

-- Seed Districts
WITH region AS (SELECT id FROM public.geo_regions WHERE code = 'WC')
INSERT INTO public.geo_districts (region_id, name, municipality_type, code)
SELECT region.id, d.name, d.type, d.code FROM region,
(VALUES 
  ('City of Cape Town', 'Metropolitan', 'CPT'),
  ('West Coast District Municipality', 'District', 'DC1'),
  ('Cape Winelands District Municipality', 'District', 'DC2'),
  ('Overberg District Municipality', 'District', 'DC3'),
  ('Garden Route District Municipality', 'District', 'DC4'),
  ('Central Karoo District Municipality', 'District', 'DC5')
) AS d(name, type, code);

-- Seed Local Municipalities
WITH districts AS (
  SELECT id, name FROM public.geo_districts WHERE municipality_type = 'District'
)
INSERT INTO public.geo_local_municipalities (district_id, name)
SELECT d.id, lm.name FROM districts d
JOIN (VALUES
  ('West Coast District Municipality', 'Matzikama'),
  ('West Coast District Municipality', 'Cederberg'),
  ('West Coast District Municipality', 'Bergrivier'),
  ('West Coast District Municipality', 'Saldanha Bay'),
  ('West Coast District Municipality', 'Swartland'),
  ('Cape Winelands District Municipality', 'Breede Valley'),
  ('Cape Winelands District Municipality', 'Drakenstein'),
  ('Cape Winelands District Municipality', 'Stellenbosch'),
  ('Cape Winelands District Municipality', 'Witzenberg'),
  ('Cape Winelands District Municipality', 'Langeberg'),
  ('Overberg District Municipality', 'Theewaterskloof'),
  ('Overberg District Municipality', 'Overstrand'),
  ('Overberg District Municipality', 'Cape Agulhas'),
  ('Overberg District Municipality', 'Swellendam'),
  ('Garden Route District Municipality', 'George'),
  ('Garden Route District Municipality', 'Mossel Bay'),
  ('Garden Route District Municipality', 'Knysna'),
  ('Garden Route District Municipality', 'Bitou'),
  ('Garden Route District Municipality', 'Oudtshoorn'),
  ('Garden Route District Municipality', 'Hessequa'),
  ('Central Karoo District Municipality', 'Beaufort West'),
  ('Central Karoo District Municipality', 'Laingsburg'),
  ('Central Karoo District Municipality', 'Prince Albert')
) AS lm(district_name, name) ON d.name = lm.district_name;

-- Seed Cape Town suburbs with postcodes
WITH cpt AS (SELECT id FROM public.geo_districts WHERE code = 'CPT')
INSERT INTO public.geo_suburbs (district_id, name, postcode)
SELECT cpt.id, s.name, s.postcode FROM cpt,
(VALUES
  ('Athlone', '7764'),
  ('Bantry Bay', '8005'),
  ('Bellville', '7530'),
  ('Bergvliet', '7945'),
  ('Bo-Kaap', '8001'),
  ('Bothasig', '7441'),
  ('Brackenfell', '7560'),
  ('Camps Bay', '8005'),
  ('Claremont', '7708'),
  ('Constantia', '7806'),
  ('Diep River', '7800'),
  ('Fish Hoek', '7974'),
  ('Glencairn', '7975'),
  ('Grassy Park', '7941'),
  ('Hout Bay', '7872'),
  ('Kalk Bay', '7990'),
  ('Kenilworth', '7745'),
  ('Killarney Gardens', '7441'),
  ('Kommetjie', '7976'),
  ('Lakeside', '7946'),
  ('Melkbosstrand', '7441'),
  ('Milnerton', '7435'),
  ('Mowbray', '7705'),
  ('Newlands', '7725'),
  ('Noordhoek', '7979'),
  ('Observatory', '7925'),
  ('Ocean View', '7975'),
  ('Plumstead', '7801'),
  ('Rondebosch', '7701'),
  ('Rosebank', '7700'),
  ('Simons Town', '7995'),
  ('Southfield', '7880'),
  ('St James', '7946'),
  ('Sunnydale', '7975'),
  ('Sun Valley', '7985'),
  ('Tokai', '7966'),
  ('Westlake', '7945'),
  ('Wynberg', '7800'),
  ('Bloubergstrand', '7441'),
  ('Atlantis', '7349'),
  ('Parklands', '7441'),
  ('Table View', '7439'),
  ('Sunningdale', '7441')
) AS s(name, postcode);

-- Create Cape Town wards (1-116)
WITH cpt AS (SELECT id FROM public.geo_districts WHERE code = 'CPT')
INSERT INTO public.geo_wards (district_id, ward_number)
SELECT cpt.id, generate_series(1, 116)
FROM cpt;