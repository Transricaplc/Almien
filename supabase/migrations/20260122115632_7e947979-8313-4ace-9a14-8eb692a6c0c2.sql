-- Tighten RLS: remove permissive INSERT policies; inserts will be performed by backend function using service role.

DROP POLICY IF EXISTS "Anyone can create alerts" ON public.alert_queue;
DROP POLICY IF EXISTS "Anyone can create wildfire alert links" ON public.wildfire_alerts;

-- Ensure no accidental INSERT is possible from clients
REVOKE INSERT, UPDATE, DELETE ON public.alert_queue FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.wildfire_alerts FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.wildfire_events FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.wildfire_perimeters FROM anon, authenticated;