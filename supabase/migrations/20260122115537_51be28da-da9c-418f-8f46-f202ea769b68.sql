-- Wildfire (CSI AFIS) feed tables

CREATE TABLE IF NOT EXISTS public.wildfire_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'csi_afis',
  external_id TEXT,
  title TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'moderate', -- low, moderate, high, critical
  status TEXT NOT NULL DEFAULT 'active', -- active, contained, extinguished
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  latitude NUMERIC,
  longitude NUMERIC,
  intensity NUMERIC,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT wildfire_events_external_unique UNIQUE (source, external_id)
);

CREATE INDEX IF NOT EXISTS idx_wildfire_events_active ON public.wildfire_events (status);
CREATE INDEX IF NOT EXISTS idx_wildfire_events_severity ON public.wildfire_events (severity);
CREATE INDEX IF NOT EXISTS idx_wildfire_events_detected_at ON public.wildfire_events (detected_at DESC);

CREATE TABLE IF NOT EXISTS public.wildfire_perimeters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.wildfire_events(id) ON DELETE CASCADE,
  perimeter_geojson JSONB NOT NULL,
  area_ha NUMERIC,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wildfire_perimeters_event_id ON public.wildfire_perimeters (event_id);

-- Link table to dedupe alerts per wildfire event
CREATE TABLE IF NOT EXISTS public.wildfire_alerts (
  event_id UUID NOT NULL REFERENCES public.wildfire_events(id) ON DELETE CASCADE,
  alert_id UUID NOT NULL REFERENCES public.alert_queue(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id)
);

-- Ensure updated_at maintenance works
CREATE TRIGGER update_wildfire_events_updated_at
BEFORE UPDATE ON public.wildfire_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- RLS
-- =========================
ALTER TABLE public.wildfire_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildfire_perimeters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildfire_alerts ENABLE ROW LEVEL SECURITY;

-- Public read for map viewer
CREATE POLICY "Anyone can read wildfire events"
ON public.wildfire_events
FOR SELECT
USING (true);

CREATE POLICY "Anyone can read wildfire perimeters"
ON public.wildfire_perimeters
FOR SELECT
USING (true);

CREATE POLICY "Anyone can read wildfire alerts"
ON public.wildfire_alerts
FOR SELECT
USING (true);

-- Allow viewer to create alert dedupe records (staging)
CREATE POLICY "Anyone can create wildfire alert links"
ON public.wildfire_alerts
FOR INSERT
WITH CHECK (true);

-- Allow creating alerts from the wildfire viewer (staging)
ALTER TABLE public.alert_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create alerts"
ON public.alert_queue
FOR INSERT
WITH CHECK (true);
