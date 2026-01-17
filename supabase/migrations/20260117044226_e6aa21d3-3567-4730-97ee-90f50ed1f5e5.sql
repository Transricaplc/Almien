-- =============================================
-- SAFESYNC URBAN SAFETY ONTOLOGY SCHEMA
-- Inspired by Palantir Foundry principles
-- Open, city-owned, purpose-built
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CORE ENTITY TYPE REGISTRY
-- Tracks all object types in the ontology
-- =============================================
CREATE TABLE public.ontology_entity_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'circle',
  color TEXT DEFAULT '#6366f1',
  properties_schema JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seed core entity types
INSERT INTO public.ontology_entity_types (type_name, display_name, description, icon, color, properties_schema) VALUES
  ('ward', 'Ward', 'Municipal administrative division', 'map-pin', '#3b82f6', '{"ward_number": "integer", "councillor": "string", "population": "integer"}'),
  ('suburb', 'Suburb', 'Residential/commercial area within a ward', 'home', '#10b981', '{"area_code": "string", "safety_score": "integer"}'),
  ('incident', 'Incident', 'Safety or infrastructure event', 'alert-triangle', '#ef4444', '{"severity": "string", "category": "string", "resolved": "boolean"}'),
  ('asset', 'Asset', 'Physical infrastructure (CCTV, traffic light, etc.)', 'camera', '#8b5cf6', '{"asset_type": "string", "operational": "boolean", "last_maintenance": "timestamp"}'),
  ('service', 'Service', 'Emergency or municipal service provider', 'phone', '#f59e0b', '{"service_type": "string", "contact": "string", "hours": "string"}'),
  ('zone', 'Zone', 'Defined geographic area (pickup zone, high-risk, etc.)', 'square', '#ec4899', '{"zone_type": "string", "risk_level": "string"}'),
  ('route', 'Route', 'Transportation or recreation path', 'navigation', '#06b6d4', '{"route_type": "string", "distance_km": "number"}'),
  ('report', 'Report', 'Citizen-submitted observation', 'file-text', '#64748b', '{"report_type": "string", "status": "string"}');

-- =============================================
-- CORE ENTITIES TABLE
-- Unified entity storage with typed properties
-- =============================================
CREATE TABLE public.ontology_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type_id UUID NOT NULL REFERENCES public.ontology_entity_types(id) ON DELETE CASCADE,
  external_id TEXT, -- Links to existing tables (suburb_intelligence.id, etc.)
  name TEXT NOT NULL,
  description TEXT,
  properties JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  source TEXT DEFAULT 'system', -- Data provenance
  source_timestamp TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_entities_type ON public.ontology_entities(entity_type_id);
CREATE INDEX idx_entities_external_id ON public.ontology_entities(external_id);
CREATE INDEX idx_entities_properties ON public.ontology_entities USING GIN(properties);

-- =============================================
-- RELATIONSHIP TYPE REGISTRY
-- Defines valid relationship types between entities
-- =============================================
CREATE TABLE public.ontology_relationship_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  from_entity_type TEXT NOT NULL, -- e.g., 'suburb'
  to_entity_type TEXT NOT NULL,   -- e.g., 'ward'
  is_bidirectional BOOLEAN DEFAULT false,
  properties_schema JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seed core relationship types
INSERT INTO public.ontology_relationship_types (type_name, display_name, from_entity_type, to_entity_type, is_bidirectional, description) VALUES
  ('belongs_to', 'Belongs To', 'suburb', 'ward', false, 'Suburb is part of a ward'),
  ('occurred_in', 'Occurred In', 'incident', 'suburb', false, 'Incident happened in suburb'),
  ('monitors', 'Monitors', 'asset', 'zone', false, 'Asset provides coverage for zone'),
  ('serves', 'Serves', 'service', 'suburb', false, 'Service provider covers suburb'),
  ('reported_at', 'Reported At', 'report', 'suburb', false, 'Report submitted for location'),
  ('adjacent_to', 'Adjacent To', 'suburb', 'suburb', true, 'Suburbs share boundary'),
  ('connects', 'Connects', 'route', 'suburb', false, 'Route passes through suburb'),
  ('triggered_by', 'Triggered By', 'incident', 'incident', false, 'Incident chain/cascade'),
  ('escalated_to', 'Escalated To', 'incident', 'service', false, 'Incident assigned to service');

-- =============================================
-- ENTITY RELATIONSHIPS (JUNCTION TABLE)
-- Stores actual relationships between entities
-- =============================================
CREATE TABLE public.ontology_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relationship_type_id UUID NOT NULL REFERENCES public.ontology_relationship_types(id) ON DELETE CASCADE,
  from_entity_id UUID NOT NULL REFERENCES public.ontology_entities(id) ON DELETE CASCADE,
  to_entity_id UUID NOT NULL REFERENCES public.ontology_entities(id) ON DELETE CASCADE,
  properties JSONB DEFAULT '{}',
  confidence NUMERIC(3,2) DEFAULT 1.0, -- 0-1 confidence score
  source TEXT DEFAULT 'system',
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(relationship_type_id, from_entity_id, to_entity_id)
);

CREATE INDEX idx_relationships_from ON public.ontology_relationships(from_entity_id);
CREATE INDEX idx_relationships_to ON public.ontology_relationships(to_entity_id);
CREATE INDEX idx_relationships_type ON public.ontology_relationships(relationship_type_id);

-- =============================================
-- DATA LINEAGE TRACKING
-- Track data provenance and transformations
-- =============================================
CREATE TABLE public.ontology_lineage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES public.ontology_entities(id) ON DELETE CASCADE,
  operation TEXT NOT NULL, -- 'create', 'update', 'merge', 'derive'
  source_system TEXT NOT NULL,
  source_table TEXT,
  source_record_id TEXT,
  transformation TEXT, -- Description of data transformation
  actor TEXT DEFAULT 'system', -- Who/what performed the operation
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  previous_state JSONB,
  new_state JSONB
);

CREATE INDEX idx_lineage_entity ON public.ontology_lineage(entity_id);
CREATE INDEX idx_lineage_timestamp ON public.ontology_lineage(timestamp DESC);

-- =============================================
-- MATERIALIZED VIEW: ENTITY GRAPH
-- Pre-computed graph for fast traversals
-- =============================================
CREATE MATERIALIZED VIEW public.mv_entity_graph AS
SELECT 
  r.id as relationship_id,
  rt.type_name as relationship_type,
  rt.display_name as relationship_display,
  fe.id as from_id,
  fe.name as from_name,
  fet.type_name as from_type,
  te.id as to_id,
  te.name as to_name,
  tet.type_name as to_type,
  r.confidence,
  r.valid_from,
  r.valid_to
FROM public.ontology_relationships r
JOIN public.ontology_relationship_types rt ON r.relationship_type_id = rt.id
JOIN public.ontology_entities fe ON r.from_entity_id = fe.id
JOIN public.ontology_entity_types fet ON fe.entity_type_id = fet.id
JOIN public.ontology_entities te ON r.to_entity_id = te.id
JOIN public.ontology_entity_types tet ON te.entity_type_id = tet.id
WHERE r.valid_to IS NULL OR r.valid_to > now();

CREATE UNIQUE INDEX idx_mv_entity_graph_rel ON public.mv_entity_graph(relationship_id);

-- =============================================
-- MATERIALIZED VIEW: ENTITY STATISTICS
-- Aggregated metrics for dashboards
-- =============================================
CREATE MATERIALIZED VIEW public.mv_entity_stats AS
SELECT 
  et.type_name,
  et.display_name,
  et.icon,
  et.color,
  COUNT(e.id) as entity_count,
  COUNT(e.id) FILTER (WHERE e.is_active) as active_count,
  MAX(e.updated_at) as last_updated
FROM public.ontology_entity_types et
LEFT JOIN public.ontology_entities e ON e.entity_type_id = et.id
GROUP BY et.id, et.type_name, et.display_name, et.icon, et.color;

-- =============================================
-- FUNCTION: Refresh materialized views
-- =============================================
CREATE OR REPLACE FUNCTION public.refresh_ontology_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_entity_graph;
  REFRESH MATERIALIZED VIEW public.mv_entity_stats;
END;
$$;

-- =============================================
-- FUNCTION: Get entity neighborhood (1-hop graph traversal)
-- =============================================
CREATE OR REPLACE FUNCTION public.get_entity_neighborhood(
  p_entity_id UUID,
  p_max_depth INTEGER DEFAULT 1
)
RETURNS TABLE (
  entity_id UUID,
  entity_name TEXT,
  entity_type TEXT,
  relationship_type TEXT,
  direction TEXT,
  depth INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE neighborhood AS (
    -- Base case: direct connections
    SELECT 
      CASE WHEN g.from_id = p_entity_id THEN g.to_id ELSE g.from_id END as eid,
      CASE WHEN g.from_id = p_entity_id THEN g.to_name ELSE g.from_name END as ename,
      CASE WHEN g.from_id = p_entity_id THEN g.to_type ELSE g.from_type END as etype,
      g.relationship_type as rtype,
      CASE WHEN g.from_id = p_entity_id THEN 'outgoing' ELSE 'incoming' END as dir,
      1 as d
    FROM public.mv_entity_graph g
    WHERE g.from_id = p_entity_id OR g.to_id = p_entity_id
    
    UNION
    
    -- Recursive case
    SELECT 
      CASE WHEN g.from_id = n.eid THEN g.to_id ELSE g.from_id END,
      CASE WHEN g.from_id = n.eid THEN g.to_name ELSE g.from_name END,
      CASE WHEN g.from_id = n.eid THEN g.to_type ELSE g.from_type END,
      g.relationship_type,
      CASE WHEN g.from_id = n.eid THEN 'outgoing' ELSE 'incoming' END,
      n.d + 1
    FROM public.mv_entity_graph g
    JOIN neighborhood n ON (g.from_id = n.eid OR g.to_id = n.eid)
    WHERE n.d < p_max_depth
  )
  SELECT DISTINCT eid, ename, etype, rtype, dir, d
  FROM neighborhood
  WHERE eid != p_entity_id;
END;
$$;

-- =============================================
-- TRIGGERS: Auto-update timestamps
-- =============================================
CREATE TRIGGER update_ontology_entity_types_updated_at
  BEFORE UPDATE ON public.ontology_entity_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ontology_entities_updated_at
  BEFORE UPDATE ON public.ontology_entities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.ontology_entity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ontology_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ontology_relationship_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ontology_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ontology_lineage ENABLE ROW LEVEL SECURITY;

-- Public read access for all ontology data
CREATE POLICY "Anyone can read entity types" ON public.ontology_entity_types FOR SELECT USING (true);
CREATE POLICY "Anyone can read entities" ON public.ontology_entities FOR SELECT USING (true);
CREATE POLICY "Anyone can read relationship types" ON public.ontology_relationship_types FOR SELECT USING (true);
CREATE POLICY "Anyone can read relationships" ON public.ontology_relationships FOR SELECT USING (true);
CREATE POLICY "Anyone can read lineage" ON public.ontology_lineage FOR SELECT USING (true);