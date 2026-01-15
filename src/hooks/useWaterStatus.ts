import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WaterDam {
  id: string;
  dam_name: string;
  dam_code: string;
  current_level: number;
  capacity_ml: number;
  status: 'normal' | 'low' | 'critical' | 'maintenance';
  last_updated: string;
}

export interface WaterOutage {
  id: string;
  suburb: string;
  area_description: string;
  outage_type: 'burst' | 'planned' | 'emergency';
  start_time: string;
  estimated_end_time: string | null;
  is_active: boolean;
}

interface UseWaterStatusReturn {
  dams: WaterDam[];
  outages: WaterOutage[];
  loading: boolean;
  error: string | null;
  totalCapacity: number;
  averageLevel: number;
  activeOutages: number;
  refetch: () => Promise<void>;
}

export const useWaterStatus = (): UseWaterStatusReturn => {
  const [dams, setDams] = useState<WaterDam[]>([]);
  const [outages, setOutages] = useState<WaterOutage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [damsRes, outagesRes] = await Promise.all([
        supabase.from('water_status').select('*').order('dam_name'),
        supabase.from('water_outages').select('*').eq('is_active', true).order('start_time', { ascending: false })
      ]);

      if (damsRes.error) throw damsRes.error;
      if (outagesRes.error) throw outagesRes.error;

      setDams(damsRes.data as WaterDam[] || []);
      setOutages(outagesRes.data as WaterOutage[] || []);
    } catch (err) {
      console.error('Error fetching water status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch water data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalCapacity = dams.reduce((sum, dam) => sum + Number(dam.capacity_ml), 0);
  const averageLevel = dams.length > 0 
    ? dams.reduce((sum, dam) => sum + Number(dam.current_level), 0) / dams.length 
    : 0;
  const activeOutages = outages.filter(o => o.is_active).length;

  return {
    dams,
    outages,
    loading,
    error,
    totalCapacity,
    averageLevel,
    activeOutages,
    refetch: fetchData,
  };
};

export const getDamStatusColor = (level: number): string => {
  if (level >= 70) return 'hsl(160 84% 39%)';
  if (level >= 50) return 'hsl(38 92% 50%)';
  if (level >= 30) return 'hsl(25 95% 53%)';
  return 'hsl(0 84% 60%)';
};

export const getOutageTypeIcon = (type: 'burst' | 'planned' | 'emergency'): string => {
  switch (type) {
    case 'burst': return '🚰';
    case 'planned': return '🔧';
    case 'emergency': return '⚠️';
    default: return '💧';
  }
};
