-- Address security linter warnings

-- 1. Move materialized views to a non-exposed schema
CREATE SCHEMA IF NOT EXISTS internal;

-- Drop existing materialized views from public
DROP MATERIALIZED VIEW IF EXISTS public.mv_entity_stats;
DROP MATERIALIZED VIEW IF EXISTS public.mv_entity_graph;

-- Recreate in internal schema (not exposed via API)
CREATE MATERIALIZED VIEW internal.mv_entity_graph AS
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

CREATE UNIQUE INDEX idx_mv_entity_graph_rel ON internal.mv_entity_graph(relationship_id);

CREATE MATERIALIZED VIEW internal.mv_entity_stats AS
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

-- 2. Update the refresh function to use internal schema
CREATE OR REPLACE FUNCTION public.refresh_ontology_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW internal.mv_entity_graph;
  REFRESH MATERIALIZED VIEW internal.mv_entity_stats;
END;
$$;

-- 3. Update the graph traversal function to use internal schema
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
    SELECT 
      CASE WHEN g.from_id = p_entity_id THEN g.to_id ELSE g.from_id END as eid,
      CASE WHEN g.from_id = p_entity_id THEN g.to_name ELSE g.from_name END as ename,
      CASE WHEN g.from_id = p_entity_id THEN g.to_type ELSE g.from_type END as etype,
      g.relationship_type as rtype,
      CASE WHEN g.from_id = p_entity_id THEN 'outgoing' ELSE 'incoming' END as dir,
      1 as d
    FROM internal.mv_entity_graph g
    WHERE g.from_id = p_entity_id OR g.to_id = p_entity_id
    
    UNION
    
    SELECT 
      CASE WHEN g.from_id = n.eid THEN g.to_id ELSE g.from_id END,
      CASE WHEN g.from_id = n.eid THEN g.to_name ELSE g.from_name END,
      CASE WHEN g.from_id = n.eid THEN g.to_type ELSE g.from_type END,
      g.relationship_type,
      CASE WHEN g.from_id = n.eid THEN 'outgoing' ELSE 'incoming' END,
      n.d + 1
    FROM internal.mv_entity_graph g
    JOIN neighborhood n ON (g.from_id = n.eid OR g.to_id = n.eid)
    WHERE n.d < p_max_depth
  )
  SELECT DISTINCT eid, ename, etype, rtype, dir, d
  FROM neighborhood
  WHERE eid != p_entity_id;
END;
$$;

-- 4. Create a secure function to get entity stats (read-only via function)
CREATE OR REPLACE FUNCTION public.get_entity_stats()
RETURNS TABLE (
  type_name TEXT,
  display_name TEXT,
  icon TEXT,
  color TEXT,
  entity_count BIGINT,
  active_count BIGINT,
  last_updated TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.type_name,
    s.display_name,
    s.icon,
    s.color,
    s.entity_count,
    s.active_count,
    s.last_updated
  FROM internal.mv_entity_stats s;
END;
$$;