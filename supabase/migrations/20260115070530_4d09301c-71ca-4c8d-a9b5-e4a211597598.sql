-- Create table for caching API responses from external services
CREATE TABLE public.api_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  cache_key TEXT NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (source, cache_key)
);

-- Create index for efficient lookups
CREATE INDEX idx_api_cache_source_key ON public.api_cache (source, cache_key);
CREATE INDEX idx_api_cache_expires_at ON public.api_cache (expires_at);

-- Enable Row Level Security
ALTER TABLE public.api_cache ENABLE ROW LEVEL SECURITY;

-- Public read access - this is public information (loadshedding schedules, road status, etc.)
CREATE POLICY "Anyone can read cached API data"
ON public.api_cache
FOR SELECT
USING (true);

-- Only service role can insert/update/delete (edge functions use service role)
-- No policies for INSERT/UPDATE/DELETE means only service_role can modify

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_api_cache_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_api_cache_updated_at
BEFORE UPDATE ON public.api_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_api_cache_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.api_cache IS 'Caches responses from external APIs like EskomSePush, SANRAL i-Traffic, etc.';