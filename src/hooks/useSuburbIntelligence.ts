import { useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardRealtimeQuery } from './useRealtimeQuery';

// =============================================
// TYPES
// =============================================

export interface SuburbIntelligence {
  id: string;
  suburb_name: string;
  area_code: string;
  ward_id: number;
  safety_score: number;
  cctv_coverage: number;
  incidents_24h: number;
  saps_station: string;
  saps_contact: string;
  fire_station: string;
  fire_contact: string;
  hospital_name: string;
  hospital_contact: string;
  risk_type: string | null;
}

// =============================================
// FETCHER
// =============================================

const fetchSuburbIntelligence = async (): Promise<SuburbIntelligence[]> => {
  const { data, error } = await supabase
    .from('suburb_intelligence')
    .select('*')
    .order('suburb_name', { ascending: true });

  if (error) throw error;
  return data || [];
};

// =============================================
// HOOK
// =============================================

export const useSuburbIntelligence = () => {
  const query = useStandardRealtimeQuery({
    queryKey: ['suburb-intelligence'],
    queryFn: fetchSuburbIntelligence,
    table: 'suburb_intelligence',
    pollingInterval: 60000, // 1 minute - suburb data doesn't change frequently
  });

  const suburbs = query.data || [];

  const searchSuburbs = useCallback((searchQuery: string): SuburbIntelligence[] => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return suburbs
      .filter(suburb => suburb.suburb_name.toLowerCase().includes(lowerQuery))
      .slice(0, 8);
  }, [suburbs]);

  const getSuburbById = useCallback((id: string): SuburbIntelligence | undefined => {
    return suburbs.find(suburb => suburb.id === id);
  }, [suburbs]);

  const getSuburbsByWard = useCallback((wardId: number): SuburbIntelligence[] => {
    return suburbs.filter(suburb => suburb.ward_id === wardId);
  }, [suburbs]);

  return {
    suburbs,
    loading: query.isLoading,
    error: query.error?.message || null,
    lastUpdated: query.lastUpdated,
    searchSuburbs,
    getSuburbById,
    getSuburbsByWard,
    refetch: query.refetch,
  };
};

// =============================================
// UTILITIES
// =============================================

export const getSafetyColor = (score: number): string => {
  if (score >= 80) return 'hsl(var(--safety-good))';
  if (score >= 60) return 'hsl(var(--safety-moderate))';
  if (score >= 40) return 'hsl(var(--safety-poor))';
  return 'hsl(var(--safety-critical))';
};

export const getSafetyLabel = (score: number): string => {
  if (score >= 80) return 'Safe';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Elevated';
  return 'High Risk';
};

export const getSafetyBadgeClass = (score: number): string => {
  if (score >= 80) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
  if (score >= 60) return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
  if (score >= 40) return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
  return 'bg-red-500/10 text-red-500 border-red-500/30';
};

export const getRiskLevel = (score: number): 'low' | 'moderate' | 'high' | 'critical' => {
  if (score >= 80) return 'low';
  if (score >= 60) return 'moderate';
  if (score >= 40) return 'high';
  return 'critical';
};

export const estimateFunctioningCCTV = (coverage: number, safetyScore: number): number => {
  // Estimate functioning CCTV based on coverage and general infrastructure health
  const baseRate = Math.min(100, coverage * 0.85);
  const healthModifier = (safetyScore / 100) * 15;
  return Math.round(Math.min(100, baseRate + healthModifier));
};

export const useSuburbStats = () => {
  const { suburbs, loading, error } = useSuburbIntelligence();

  return useMemo(() => {
    if (loading || suburbs.length === 0) {
      return {
        averageSafetyScore: 0,
        totalIncidents24h: 0,
        highRiskCount: 0,
        totalSuburbs: 0,
        loading,
        error,
      };
    }

    const averageSafetyScore = Math.round(
      suburbs.reduce((sum, s) => sum + s.safety_score, 0) / suburbs.length
    );
    const totalIncidents24h = suburbs.reduce((sum, s) => sum + s.incidents_24h, 0);
    const highRiskCount = suburbs.filter(s => s.safety_score < 40).length;

    return {
      averageSafetyScore,
      totalIncidents24h,
      highRiskCount,
      totalSuburbs: suburbs.length,
      loading,
      error,
    };
  }, [suburbs, loading, error]);
};
