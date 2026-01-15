import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Beach {
  id: string;
  name: string;
  location: string;
  shark_flag_status: 'green' | 'yellow' | 'red' | 'black';
  water_quality: 'excellent' | 'good' | 'fair' | 'poor';
  lifeguard_on_duty: boolean;
  current_conditions: string | null;
  water_temp_celsius: number | null;
  wind_speed_kmh: number | null;
  is_open: boolean;
  coordinates_lat: number | null;
  coordinates_lng: number | null;
  last_updated: string;
}

interface UseBeachesReturn {
  beaches: Beach[];
  loading: boolean;
  error: string | null;
  getBeachById: (id: string) => Beach | undefined;
  getSafeBeaches: () => Beach[];
  refetch: () => Promise<void>;
}

export const useBeaches = (): UseBeachesReturn => {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('beaches')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setBeaches(data as Beach[] || []);
    } catch (err) {
      console.error('Error fetching beaches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch beach data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getBeachById = (id: string) => beaches.find(b => b.id === id);
  const getSafeBeaches = () => beaches.filter(b => 
    b.is_open && b.shark_flag_status === 'green' && b.water_quality !== 'poor'
  );

  return {
    beaches,
    loading,
    error,
    getBeachById,
    getSafeBeaches,
    refetch: fetchData,
  };
};

export const getSharkFlagColor = (status: Beach['shark_flag_status']): string => {
  switch (status) {
    case 'green': return 'hsl(160 84% 39%)';
    case 'yellow': return 'hsl(38 92% 50%)';
    case 'red': return 'hsl(0 84% 60%)';
    case 'black': return 'hsl(0 0% 10%)';
    default: return 'hsl(210 10% 60%)';
  }
};

export const getSharkFlagLabel = (status: Beach['shark_flag_status']): string => {
  const labels: Record<Beach['shark_flag_status'], string> = {
    green: 'Safe - No sharks detected',
    yellow: 'Caution - Shark activity possible',
    red: 'Danger - Shark spotted',
    black: 'Beach Closed',
  };
  return labels[status] || status;
};

export const getWaterQualityColor = (quality: Beach['water_quality']): string => {
  switch (quality) {
    case 'excellent': return 'hsl(200 84% 50%)';
    case 'good': return 'hsl(160 84% 39%)';
    case 'fair': return 'hsl(38 92% 50%)';
    case 'poor': return 'hsl(0 84% 60%)';
    default: return 'hsl(210 10% 60%)';
  }
};
