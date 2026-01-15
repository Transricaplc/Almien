import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WindReport {
  id: string;
  location: string;
  wind_speed_kmh: number;
  wind_gust_kmh: number | null;
  wind_direction: string;
  description: string | null;
  severity: string;
  affects_drivers: boolean;
  affects_beach_goers: boolean;
  affects_surfers: boolean;
  affects_hikers: boolean;
  advisory: string | null;
  last_updated: string;
}

interface UseWindReportsReturn {
  windReports: WindReport[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWindReports = (): UseWindReportsReturn => {
  const [windReports, setWindReports] = useState<WindReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('wind_reports')
        .select('*')
        .order('severity', { ascending: false });

      if (fetchError) throw fetchError;

      setWindReports(data as WindReport[] || []);
    } catch (err) {
      console.error('Error fetching wind reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wind reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    windReports,
    loading,
    error,
    refetch: fetchData,
  };
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'severe': return 'hsl(0 84% 60%)';
    case 'high': return 'hsl(25 95% 53%)';
    case 'moderate': return 'hsl(38 92% 50%)';
    case 'low': return 'hsl(160 84% 39%)';
    default: return 'hsl(215 20% 65%)';
  }
};

export const getWindDirectionIcon = (direction: string): string => {
  const dirMap: Record<string, string> = {
    'N': '↓', 'NE': '↙', 'E': '←', 'SE': '↖',
    'S': '↑', 'SW': '↗', 'W': '→', 'NW': '↘',
  };
  return dirMap[direction] || '○';
};
