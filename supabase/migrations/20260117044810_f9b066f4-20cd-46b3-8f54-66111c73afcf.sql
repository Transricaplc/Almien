-- Replace materialized view function with direct query for entity stats
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
    et.type_name,
    et.display_name,
    et.icon,
    et.color,
    COUNT(e.id) as entity_count,
    COUNT(e.id) FILTER (WHERE e.is_active) as active_count,
    MAX(e.updated_at) as last_updated
  FROM public.ontology_entity_types et
  LEFT JOIN public.ontology_entities e ON e.entity_type_id = et.id
  GROUP BY et.id, et.type_name, et.display_name, et.icon, et.color
  ORDER BY et.display_name;
END;
$$;

-- Also update the neighborhood function to use direct query
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
  WITH graph AS (
    SELECT 
      r.id as relationship_id,
      rt.type_name as rel_type,
      fe.id as from_id,
      fe.name as from_name,
      fet.type_name as from_type,
      te.id as to_id,
      te.name as to_name,
      tet.type_name as to_type
    FROM public.ontology_relationships r
    JOIN public.ontology_relationship_types rt ON r.relationship_type_id = rt.id
    JOIN public.ontology_entities fe ON r.from_entity_id = fe.id
    JOIN public.ontology_entity_types fet ON fe.entity_type_id = fet.id
    JOIN public.ontology_entities te ON r.to_entity_id = te.id
    JOIN public.ontology_entity_types tet ON te.entity_type_id = tet.id
    WHERE r.valid_to IS NULL OR r.valid_to > now()
  ),
  neighborhood AS (
    SELECT 
      CASE WHEN g.from_id = p_entity_id THEN g.to_id ELSE g.from_id END as eid,
      CASE WHEN g.from_id = p_entity_id THEN g.to_name ELSE g.from_name END as ename,
      CASE WHEN g.from_id = p_entity_id THEN g.to_type ELSE g.from_type END as etype,
      g.rel_type as rtype,
      CASE WHEN g.from_id = p_entity_id THEN 'outgoing' ELSE 'incoming' END as dir,
      1 as d
    FROM graph g
    WHERE g.from_id = p_entity_id OR g.to_id = p_entity_id
  )
  SELECT DISTINCT eid, ename, etype, rtype, dir, d
  FROM neighborhood
  WHERE eid != p_entity_id;
END;
$$;