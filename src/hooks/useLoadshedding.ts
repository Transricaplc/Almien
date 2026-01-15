import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LoadsheddingStatus {
  id: string;
  stage: number;
  suburb: string | null;
  area_code: string | null;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  source: string;
  last_updated: string;
}

interface UseLoadsheddingReturn {
  status: LoadsheddingStatus | null;
  loading: boolean;
  error: string | null;
  currentStage: number;
  isActive: boolean;
  refetch: () => Promise<void>;
}

export const useLoadshedding = (): UseLoadsheddingReturn => {
  const [status, setStatus] = useState<LoadsheddingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('loadshedding_status')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      setStatus(data as LoadsheddingStatus || null);
    } catch (err) {
      console.error('Error fetching loadshedding status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch loadshedding data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    status,
    loading,
    error,
    currentStage: status?.stage || 0,
    isActive: status?.is_active || false,
    refetch: fetchData,
  };
};

export const getStageColor = (stage: number): string => {
  if (stage === 0) return 'hsl(160 84% 39%)';
  if (stage <= 2) return 'hsl(38 92% 50%)';
  if (stage <= 4) return 'hsl(25 95% 53%)';
  return 'hsl(0 84% 60%)';
};

export const getStageSeverity = (stage: number): 'none' | 'low' | 'moderate' | 'high' | 'critical' => {
  if (stage === 0) return 'none';
  if (stage <= 2) return 'low';
  if (stage <= 4) return 'moderate';
  if (stage <= 6) return 'high';
  return 'critical';
};
