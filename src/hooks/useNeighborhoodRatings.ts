import { supabase } from '@/integrations/supabase/client';
import { useStandardRealtimeQuery } from './useRealtimeQuery';

export interface NeighborhoodRating {
  id: string;
  neighborhood: string;
  safety_score: number;
  crime_rate: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  crime_count_30d: number;
  robbery_count: number;
  assault_count: number;
  burglary_count: number;
  theft_count: number;
  latitude: number | null;
  longitude: number | null;
  population_estimate: number | null;
  last_updated: string;
  created_at: string;
}

export const useNeighborhoodRatings = () => {
  return useStandardRealtimeQuery<NeighborhoodRating[]>({
    queryKey: ['neighborhood-ratings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhood_ratings')
        .select('*')
        .order('safety_score', { ascending: false });

      if (error) throw error;
      return (data ?? []) as NeighborhoodRating[];
    },
    table: 'neighborhood_ratings',
  });
};

export const useNeighborhoodByName = (name: string) => {
  return useStandardRealtimeQuery<NeighborhoodRating | null>({
    queryKey: ['neighborhood-rating', name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhood_ratings')
        .select('*')
        .ilike('neighborhood', name)
        .maybeSingle();

      if (error) throw error;
      return data as NeighborhoodRating | null;
    },
    table: 'neighborhood_ratings',
    enabled: !!name,
  });
};

export const getCrimeRateColor = (rate: string) => {
  switch (rate) {
    case 'very_low': return '#10b981';
    case 'low': return '#22c55e';
    case 'medium': return '#eab308';
    case 'high': return '#f97316';
    case 'very_high': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getCrimeRateLabel = (rate: string) => {
  switch (rate) {
    case 'very_low': return 'Very Low';
    case 'low': return 'Low';
    case 'medium': return 'Medium';
    case 'high': return 'High';
    case 'very_high': return 'Very High';
    default: return 'Unknown';
  }
};

export const getSafetyScoreColor = (score: number) => {
  if (score >= 4.0) return '#10b981';
  if (score >= 3.0) return '#22c55e';
  if (score >= 2.5) return '#eab308';
  if (score >= 2.0) return '#f97316';
  return '#ef4444';
};

export const getSafetyScoreLabel = (score: number) => {
  if (score >= 4.0) return 'Very Safe';
  if (score >= 3.0) return 'Safe';
  if (score >= 2.5) return 'Moderate';
  if (score >= 2.0) return 'Caution';
  return 'High Risk';
};
