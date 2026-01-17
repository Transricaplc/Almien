-- ========================================
-- SAFESYNC ARCHITECTURE COMPLETION MIGRATION
-- Missing elements from architecture prompt
-- ========================================

-- ======================
-- A. DATA INGESTION LAYER
-- ======================

-- 1. Traffic Signals (Core asset type in architecture)
CREATE TABLE public.traffic_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates_lat NUMERIC,
  coordinates_lng NUMERIC,
  intersection_type TEXT DEFAULT 'standard', -- standard, pedestrian, smart
  status TEXT NOT NULL DEFAULT 'operational', -- operational, faulty, offline, maintenance
  last_maintenance TIMESTAMPTZ,
  controller_type TEXT, -- fixed-time, adaptive, smart
  is_synchronized BOOLEAN DEFAULT false, -- part of green wave
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.traffic_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read traffic signals" ON public.traffic_signals FOR SELECT USING (true);

CREATE INDEX idx_traffic_signals_status ON public.traffic_signals(status);
CREATE INDEX idx_traffic_signals_location ON public.traffic_signals(location);

-- 2. CCTV Asset Registry (metadata only - no feeds per governance)
CREATE TABLE public.cctv_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camera_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates_lat NUMERIC,
  coordinates_lng NUMERIC,
  ward_id INTEGER,
  camera_type TEXT DEFAULT 'fixed', -- fixed, ptz, lpr, thermal
  status TEXT NOT NULL DEFAULT 'operational', -- operational, offline, maintenance
  resolution TEXT, -- 1080p, 4k
  has_night_vision BOOLEAN DEFAULT false,
  recording_enabled BOOLEAN DEFAULT true,
  last_maintenance TIMESTAMPTZ,
  installed_date DATE,
  owner TEXT DEFAULT 'city', -- city, private, partnership
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cctv_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read CCTV assets" ON public.cctv_assets FOR SELECT USING (true);

CREATE INDEX idx_cctv_assets_status ON public.cctv_assets(status);
CREATE INDEX idx_cctv_assets_ward ON public.cctv_assets(ward_id);

-- 3. Emergency Call Aggregates (privacy-first - only aggregated data)
CREATE TABLE public.emergency_call_aggregates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  ward_id INTEGER NOT NULL,
  suburb TEXT,
  call_type TEXT NOT NULL, -- medical, fire, crime, traffic, other
  total_calls INTEGER NOT NULL DEFAULT 0,
  avg_response_time_minutes NUMERIC,
  priority_high INTEGER DEFAULT 0,
  priority_medium INTEGER DEFAULT 0,
  priority_low INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_call_aggregates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read call aggregates" ON public.emergency_call_aggregates FOR SELECT USING (true);

CREATE INDEX idx_emergency_calls_period ON public.emergency_call_aggregates(period_start, period_end);
CREATE INDEX idx_emergency_calls_ward ON public.emergency_call_aggregates(ward_id);

-- 4. Power/Network Status (grid status feeds)
CREATE TABLE public.infrastructure_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  infrastructure_type TEXT NOT NULL, -- power_grid, fiber_network, water_pump, street_light
  zone_code TEXT NOT NULL,
  zone_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'operational', -- operational, degraded, offline, maintenance
  capacity_percent INTEGER, -- 0-100
  last_incident TIMESTAMPTZ,
  incident_count_24h INTEGER DEFAULT 0,
  estimated_restoration TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'city_systems', -- city_systems, eskom, telkom
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.infrastructure_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read infrastructure status" ON public.infrastructure_status FOR SELECT USING (true);

CREATE INDEX idx_infra_status_type ON public.infrastructure_status(infrastructure_type);
CREATE INDEX idx_infra_status_zone ON public.infrastructure_status(zone_code);

-- ======================
-- D. PROCESSING & INTELLIGENCE LAYER
-- ======================

-- 5. Risk Scores (computed risk for zones/assets)
CREATE TABLE public.risk_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- suburb, ward, asset, route
  entity_id TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  risk_category TEXT NOT NULL, -- crime, infrastructure, traffic, environmental
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  trend TEXT DEFAULT 'stable', -- improving, stable, worsening
  factors JSONB DEFAULT '{}', -- contributing factors
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id, risk_category)
);

ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read risk scores" ON public.risk_scores FOR SELECT USING (true);

CREATE INDEX idx_risk_scores_entity ON public.risk_scores(entity_type, entity_id);
CREATE INDEX idx_risk_scores_category ON public.risk_scores(risk_category);

-- 6. Alert Queue (internal alert system - no external notifications)
CREATE TABLE public.alert_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- threshold_breach, pattern_detected, anomaly, escalation
  priority TEXT NOT NULL DEFAULT 'medium', -- critical, high, medium, low
  title TEXT NOT NULL,
  description TEXT,
  entity_type TEXT,
  entity_id TEXT,
  ward_id INTEGER,
  threshold_value NUMERIC,
  actual_value NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, acknowledged, resolved, dismissed
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  auto_expire_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alert_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read alerts" ON public.alert_queue FOR SELECT USING (true);

CREATE INDEX idx_alert_queue_status ON public.alert_queue(status);
CREATE INDEX idx_alert_queue_priority ON public.alert_queue(priority);
CREATE INDEX idx_alert_queue_created ON public.alert_queue(created_at DESC);

-- 7. Incident Clusters (for pattern detection)
CREATE TABLE public.incident_clusters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_type TEXT NOT NULL, -- spatial, temporal, category
  category TEXT NOT NULL, -- crime, traffic, infrastructure, weather
  center_lat NUMERIC,
  center_lng NUMERIC,
  radius_meters INTEGER,
  incident_count INTEGER NOT NULL,
  time_window_hours INTEGER,
  first_incident TIMESTAMPTZ,
  last_incident TIMESTAMPTZ,
  severity TEXT DEFAULT 'moderate', -- low, moderate, high, critical
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.incident_clusters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read clusters" ON public.incident_clusters FOR SELECT USING (true);

CREATE INDEX idx_clusters_active ON public.incident_clusters(is_active);
CREATE INDEX idx_clusters_category ON public.incident_clusters(category);

-- ======================
-- E. API & SERVICES LAYER
-- ======================

-- 8. Audit Log (governance & compliance)
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL, -- view, query, export, config_change
  resource_type TEXT NOT NULL, -- dashboard, report, entity, config
  resource_id TEXT,
  actor_type TEXT NOT NULL DEFAULT 'system', -- system, user, api
  actor_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  request_path TEXT,
  query_params JSONB,
  result TEXT DEFAULT 'success', -- success, failure, partial
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
-- Audit logs are sensitive - read-only for now
CREATE POLICY "Anyone can read audit logs" ON public.audit_log FOR SELECT USING (true);

CREATE INDEX idx_audit_log_action ON public.audit_log(action);
CREATE INDEX idx_audit_log_resource ON public.audit_log(resource_type);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at DESC);

-- ======================
-- F. CITY KPIS / EXECUTIVE SUMMARY
-- ======================

-- 9. City KPIs (executive dashboard metrics)
CREATE TABLE public.city_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_code TEXT NOT NULL UNIQUE,
  kpi_name TEXT NOT NULL,
  category TEXT NOT NULL, -- safety, infrastructure, response, environment
  current_value NUMERIC NOT NULL,
  previous_value NUMERIC,
  target_value NUMERIC,
  unit TEXT NOT NULL, -- percent, count, minutes, score
  trend TEXT DEFAULT 'stable', -- up, down, stable
  trend_percent NUMERIC,
  period TEXT NOT NULL, -- daily, weekly, monthly
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.city_kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read KPIs" ON public.city_kpis FOR SELECT USING (true);

CREATE INDEX idx_kpis_category ON public.city_kpis(category);
CREATE INDEX idx_kpis_period ON public.city_kpis(period, period_start);

-- ======================
-- DATA RETENTION POLICY METADATA
-- ======================

-- 10. Data Retention Policies (governance)
CREATE TABLE public.data_retention_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL UNIQUE,
  retention_days INTEGER NOT NULL,
  archive_enabled BOOLEAN DEFAULT false,
  archive_location TEXT,
  last_cleanup TIMESTAMPTZ,
  next_cleanup TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read retention policies" ON public.data_retention_policies FOR SELECT USING (true);

-- Insert default retention policies
INSERT INTO public.data_retention_policies (table_name, retention_days, archive_enabled) VALUES
  ('audit_log', 365, true),
  ('alert_queue', 90, true),
  ('emergency_call_aggregates', 730, true),
  ('incident_clusters', 180, false),
  ('citizen_reports', 365, true),
  ('api_cache', 7, false);

-- ======================
-- SYSTEM HEALTH MONITORING
-- ======================

-- 11. Data Source Health (failure handling)
CREATE TABLE public.data_source_health (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL, -- api, database, feed, manual
  endpoint_url TEXT,
  status TEXT NOT NULL DEFAULT 'healthy', -- healthy, degraded, unhealthy, offline
  last_successful_sync TIMESTAMPTZ,
  last_failed_sync TIMESTAMPTZ,
  consecutive_failures INTEGER DEFAULT 0,
  avg_response_ms INTEGER,
  error_message TEXT,
  is_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.data_source_health ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read source health" ON public.data_source_health FOR SELECT USING (true);

-- Insert known data sources
INSERT INTO public.data_source_health (source_name, source_type, is_critical) VALUES
  ('suburb_intelligence', 'database', true),
  ('weather_data', 'api', false),
  ('loadshedding_status', 'api', true),
  ('train_routes', 'feed', false),
  ('flight_status', 'api', false),
  ('water_status', 'api', true),
  ('citizen_reports', 'database', true);

-- ======================
-- SEED ONTOLOGY WITH NEW ENTITY TYPES
-- ======================

-- Add new entity types to ontology
INSERT INTO public.ontology_entity_types (type_name, display_name, description, icon, color, properties_schema) VALUES
  ('traffic_signal', 'Traffic Signal', 'Traffic control infrastructure', 'traffic-light', '#22c55e', '{"signal_code": "string", "intersection_type": "string", "status": "string"}'),
  ('cctv', 'CCTV Camera', 'Surveillance camera asset', 'camera', '#3b82f6', '{"camera_code": "string", "camera_type": "string", "status": "string"}'),
  ('power_zone', 'Power Zone', 'Electrical grid zone', 'zap', '#f59e0b', '{"capacity_percent": "integer", "status": "string"}'),
  ('network_zone', 'Network Zone', 'Communications network zone', 'wifi', '#8b5cf6', '{"status": "string", "provider": "string"}'),
  ('alert', 'Alert', 'System-generated alert', 'bell', '#ef4444', '{"priority": "string", "status": "string"}'),
  ('cluster', 'Incident Cluster', 'Geographic clustering of incidents', 'target', '#ec4899', '{"category": "string", "severity": "string"}')
ON CONFLICT (type_name) DO NOTHING;

-- ======================
-- UPDATE TRIGGERS
-- ======================

CREATE TRIGGER update_traffic_signals_updated_at BEFORE UPDATE ON public.traffic_signals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cctv_assets_updated_at BEFORE UPDATE ON public.cctv_assets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incident_clusters_updated_at BEFORE UPDATE ON public.incident_clusters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_retention_updated_at BEFORE UPDATE ON public.data_retention_policies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_source_health_updated_at BEFORE UPDATE ON public.data_source_health
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.traffic_signals IS 'Traffic signal infrastructure registry';
COMMENT ON TABLE public.cctv_assets IS 'CCTV camera asset registry (metadata only, no feeds)';
COMMENT ON TABLE public.emergency_call_aggregates IS 'Aggregated emergency call data (privacy-first)';
COMMENT ON TABLE public.infrastructure_status IS 'Power, network, and utility infrastructure status';
COMMENT ON TABLE public.risk_scores IS 'Computed risk scores for entities';
COMMENT ON TABLE public.alert_queue IS 'Internal alert queue for escalation';
COMMENT ON TABLE public.incident_clusters IS 'Detected incident clusters for pattern analysis';
COMMENT ON TABLE public.audit_log IS 'Governance audit trail';
COMMENT ON TABLE public.city_kpis IS 'Executive dashboard KPIs';
COMMENT ON TABLE public.data_retention_policies IS 'Data lifecycle management policies';
COMMENT ON TABLE public.data_source_health IS 'Data source health monitoring';