import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SuburbIntelligence {
  id: string;
  suburb_name: string;
  ward_id: number;
  area_code: string;
  saps_station: string;
  saps_contact: string;
  fire_station: string;
  fire_contact: string;
  hospital_name: string;
  hospital_contact: string;
  safety_score: number;
  risk_type: string | null;
  cctv_coverage: number;
  incidents_24h: number;
  created_at: string;
  updated_at: string;
}

interface UseSuburbIntelligenceReturn {
  suburbs: SuburbIntelligence[];
  loading: boolean;
  error: string | null;
  searchSuburbs: (query: string) => SuburbIntelligence[];
  getSuburbById: (id: string) => SuburbIntelligence | undefined;
  refetch: () => Promise<void>;
}

export const useSuburbIntelligence = (): UseSuburbIntelligenceReturn => {
  const [suburbs, setSuburbs] = useState<SuburbIntelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuburbs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('suburb_intelligence')
        .select('*')
        .order('suburb_name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setSuburbs(data || []);
    } catch (err) {
      console.error('Error fetching suburb intelligence:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suburb data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuburbs();
  }, []);

  const searchSuburbs = useMemo(() => {
    return (query: string): SuburbIntelligence[] => {
      if (!query.trim()) return [];
      const lowerQuery = query.toLowerCase();
      return suburbs.filter(suburb =>
        suburb.suburb_name.toLowerCase().includes(lowerQuery)
      ).slice(0, 8);
    };
  }, [suburbs]);

  const getSuburbById = useMemo(() => {
    return (id: string): SuburbIntelligence | undefined => {
      return suburbs.find(suburb => suburb.id === id);
    };
  }, [suburbs]);

  return {
    suburbs,
    loading,
    error,
    searchSuburbs,
    getSuburbById,
    refetch: fetchSuburbs,
  };
};

export const getRiskLevel = (score: number): 'low' | 'moderate' | 'high' | 'critical' => {
  if (score >= 80) return 'low';
  if (score >= 60) return 'moderate';
  if (score >= 40) return 'high';
  return 'critical';
};

export const getSafetyColor = (score: number): string => {
  if (score >= 80) return 'hsl(160 84% 39%)';
  if (score >= 60) return 'hsl(38 92% 50%)';
  if (score >= 40) return 'hsl(25 95% 53%)';
  return 'hsl(0 84% 60%)';
};

export const estimateFunctioningCCTV = (cctvCoverage: number, safetyScore: number): number => {
  // Estimate functioning CCTV as percentage based on coverage and safety
  const basePercentage = cctvCoverage;
  const safetyBonus = (safetyScore / 100) * 15;
  return Math.min(100, Math.round(basePercentage + safetyBonus));
};
