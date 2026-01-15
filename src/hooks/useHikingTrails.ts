import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HikingTrail {
  id: string;
  name: string;
  location: string;
  difficulty: 'easy' | 'moderate' | 'difficult' | 'extreme';
  distance_km: number;
  elevation_gain_m: number;
  estimated_hours: number;
  sunrise_time: string | null;
  sunset_time: string | null;
  is_open: boolean;
  safety_notes: string | null;
  coordinates_lat: number | null;
  coordinates_lng: number | null;
}

interface UseHikingTrailsReturn {
  trails: HikingTrail[];
  loading: boolean;
  error: string | null;
  getTrailById: (id: string) => HikingTrail | undefined;
  getOpenTrails: () => HikingTrail[];
  refetch: () => Promise<void>;
}

export const useHikingTrails = (): UseHikingTrailsReturn => {
  const [trails, setTrails] = useState<HikingTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hiking_trails')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setTrails(data as HikingTrail[] || []);
    } catch (err) {
      console.error('Error fetching hiking trails:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch hiking trails');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTrailById = (id: string) => trails.find(t => t.id === id);
  const getOpenTrails = () => trails.filter(t => t.is_open);

  return {
    trails,
    loading,
    error,
    getTrailById,
    getOpenTrails,
    refetch: fetchData,
  };
};

export const getDifficultyColor = (difficulty: HikingTrail['difficulty']): string => {
  switch (difficulty) {
    case 'easy': return 'hsl(160 84% 39%)';
    case 'moderate': return 'hsl(38 92% 50%)';
    case 'difficult': return 'hsl(25 95% 53%)';
    case 'extreme': return 'hsl(0 84% 60%)';
    default: return 'hsl(210 10% 60%)';
  }
};

export const getDifficultyLabel = (difficulty: HikingTrail['difficulty']): string => {
  const labels: Record<HikingTrail['difficulty'], string> = {
    easy: 'Easy',
    moderate: 'Moderate',
    difficult: 'Difficult',
    extreme: 'Extreme',
  };
  return labels[difficulty] || difficulty;
};

export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
