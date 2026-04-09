-- Drop overly permissive SELECT policies on operational tables
DROP POLICY IF EXISTS "Anyone can read audit logs" ON public.audit_log;
DROP POLICY IF EXISTS "Anyone can read alerts" ON public.alert_queue;
DROP POLICY IF EXISTS "Anyone can read retention policies" ON public.data_retention_policies;
DROP POLICY IF EXISTS "Anyone can read source health" ON public.data_source_health;
DROP POLICY IF EXISTS "Anyone can read lineage" ON public.ontology_lineage;
DROP POLICY IF EXISTS "Anyone can read cached API data" ON public.api_cache;

-- Restrict audit_log to admins only
CREATE POLICY "Admins can read audit logs"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Restrict alert_queue to admins and dispatchers
CREATE POLICY "Staff can read alerts"
  ON public.alert_queue FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'));

-- Restrict data_retention_policies to admins
CREATE POLICY "Admins can read retention policies"
  ON public.data_retention_policies FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Restrict data_source_health to admins
CREATE POLICY "Admins can read source health"
  ON public.data_source_health FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Restrict ontology_lineage to admins
CREATE POLICY "Admins can read lineage"
  ON public.ontology_lineage FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Restrict api_cache to admins
CREATE POLICY "Admins can read api cache"
  ON public.api_cache FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));