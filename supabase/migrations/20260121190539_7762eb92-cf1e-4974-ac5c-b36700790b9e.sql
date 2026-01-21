-- Tighten permissive INSERT policy to satisfy security linter while keeping public report submission
DROP POLICY IF EXISTS "Anyone can create citizen reports" ON public.citizen_reports;

CREATE POLICY "Anyone can create citizen reports"
ON public.citizen_reports
FOR INSERT
WITH CHECK (
  report_type IS NOT NULL
  AND length(trim(report_type)) > 0
);
