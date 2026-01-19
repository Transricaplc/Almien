-- Add physical address fields to fixed urban safety asset tables
-- This ensures ontology compliance for location-based entity searches

-- 1. Add address fields to CCTV Assets
ALTER TABLE public.cctv_assets 
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS suburb TEXT,
ADD COLUMN IF NOT EXISTS area_code TEXT,
ADD COLUMN IF NOT EXISTS municipality TEXT DEFAULT 'City of Cape Town';

-- 2. Add address fields to Traffic Signals
ALTER TABLE public.traffic_signals 
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS suburb TEXT,
ADD COLUMN IF NOT EXISTS area_code TEXT,
ADD COLUMN IF NOT EXISTS ward_id INTEGER,
ADD COLUMN IF NOT EXISTS municipality TEXT DEFAULT 'City of Cape Town';

-- 3. Add address fields to Infrastructure Status
ALTER TABLE public.infrastructure_status 
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS suburb TEXT,
ADD COLUMN IF NOT EXISTS area_code TEXT,
ADD COLUMN IF NOT EXISTS ward_id INTEGER,
ADD COLUMN IF NOT EXISTS municipality TEXT DEFAULT 'City of Cape Town';

-- 4. Create indexes for address-based searches
CREATE INDEX IF NOT EXISTS idx_cctv_assets_suburb ON public.cctv_assets(suburb);
CREATE INDEX IF NOT EXISTS idx_cctv_assets_area_code ON public.cctv_assets(area_code);
CREATE INDEX IF NOT EXISTS idx_cctv_assets_ward ON public.cctv_assets(ward_id);

CREATE INDEX IF NOT EXISTS idx_traffic_signals_suburb ON public.traffic_signals(suburb);
CREATE INDEX IF NOT EXISTS idx_traffic_signals_area_code ON public.traffic_signals(area_code);
CREATE INDEX IF NOT EXISTS idx_traffic_signals_ward ON public.traffic_signals(ward_id);

CREATE INDEX IF NOT EXISTS idx_infrastructure_suburb ON public.infrastructure_status(suburb);
CREATE INDEX IF NOT EXISTS idx_infrastructure_area_code ON public.infrastructure_status(area_code);
CREATE INDEX IF NOT EXISTS idx_infrastructure_ward ON public.infrastructure_status(ward_id);

-- 5. Add additional asset entity types to ontology for hospitals, police, fire stations, taxi ranks
INSERT INTO public.ontology_entity_types (type_name, display_name, description, icon, color, properties_schema) 
VALUES
  ('hospital', 'Hospital', 'Medical emergency facility', 'cross', '#ef4444', '{"street": "string", "suburb": "string", "area_code": "string", "ward": "integer", "municipality": "string", "contact": "string", "emergency_dept": "boolean"}'),
  ('police_station', 'Police Station', 'SAPS law enforcement facility', 'shield', '#3b82f6', '{"street": "string", "suburb": "string", "area_code": "string", "ward": "integer", "municipality": "string", "contact": "string", "cluster": "string"}'),
  ('fire_station', 'Fire Station', 'Fire and rescue facility', 'flame', '#f97316', '{"street": "string", "suburb": "string", "area_code": "string", "ward": "integer", "municipality": "string", "contact": "string", "coverage_area": "string"}'),
  ('taxi_rank', 'Taxi Rank', 'Public transport taxi facility', 'car', '#8b5cf6', '{"street": "string", "suburb": "string", "area_code": "string", "ward": "integer", "municipality": "string", "routes": "array", "operating_hours": "string"}'),
  ('bus_stop', 'Bus Stop', 'Public transport bus facility', 'bus', '#06b6d4', '{"street": "string", "suburb": "string", "area_code": "string", "ward": "integer", "municipality": "string", "routes": "array"}'),
  ('clinic', 'Clinic', 'Primary healthcare facility', 'heart-pulse', '#ec4899', '{"street": "string", "suburb": "string", "area_code": "string", "ward": "integer", "municipality": "string", "contact": "string", "services": "array"}'),
  ('cctv', 'CCTV Camera', 'Surveillance camera asset', 'camera', '#8b5cf6', '{"street": "string", "suburb": "string", "area_code": "string", "ward": "integer", "municipality": "string", "camera_type": "string", "status": "string"}'),
  ('traffic_signal', 'Traffic Signal', 'Traffic control signal', 'traffic-cone', '#10b981', '{"street": "string", "suburb": "string", "area_code": "string", "ward": "integer", "municipality": "string", "signal_type": "string", "status": "string"}')
ON CONFLICT (type_name) DO UPDATE SET
  properties_schema = EXCLUDED.properties_schema,
  description = EXCLUDED.description;