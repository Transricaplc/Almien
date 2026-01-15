import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrainRoute {
  id: string;
  route_code: string;
  name: string;
  safety_score: number;
  stations: number;
  operating_cameras: number;
  total_cameras: number;
  incidents_24h: number;
  status: string;
  is_operational: boolean;
  last_updated: string;
}

interface UseTrainRoutesReturn {
  trainRoutes: TrainRoute[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTrainRoutes = (): UseTrainRoutesReturn => {
  const [trainRoutes, setTrainRoutes] = useState<TrainRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('train_routes')
        .select('*')
        .order('safety_score', { ascending: true });

      if (fetchError) throw fetchError;

      setTrainRoutes(data as TrainRoute[] || []);
    } catch (err) {
      console.error('Error fetching train routes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch train routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    trainRoutes,
    loading,
    error,
    refetch: fetchData,
  };
};
