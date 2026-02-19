
-- Add ESP area ID column for EskomSePush mapping
ALTER TABLE public.suburb_intelligence ADD COLUMN IF NOT EXISTS esp_area_id text;

-- Add index for ESP area ID lookups
CREATE INDEX IF NOT EXISTS idx_suburb_intelligence_esp_area_id ON public.suburb_intelligence (esp_area_id);
