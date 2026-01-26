import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardRealtimeQuery } from './useRealtimeQuery';

// =============================================
// TYPES
// =============================================

export interface TrafficSignal {
  id: string;
  signal_code: string;
  name: string;
  location: string;
  coordinates_lat: number | null;
  coordinates_lng: number | null;
  intersection_type: string;
  status: string;
  controller_type: string | null;
  is_synchronized: boolean;
  last_maintenance: string | null;
}

export interface CCTVAsset {
  id: string;
  camera_code: string;
  name: string;
  location: string;
  coordinates_lat: number | null;
  coordinates_lng: number | null;
  ward_id: number | null;
  camera_type: string;
  status: string;
  resolution: string | null;
  has_night_vision: boolean;
  recording_enabled: boolean;
  owner: string;
}

export interface InfrastructureStatus {
  id: string;
  infrastructure_type: string;
  zone_code: string;
  zone_name: string;
  status: string;
  capacity_percent: number | null;
  incident_count_24h: number;
  last_updated: string;
}

export interface AssetStats {
  totalCCTV: number;
  operationalCCTV: number;
  totalSignals: number;
  operationalSignals: number;
  infrastructureHealthy: number;
  totalInfrastructure: number;
}

// =============================================
// FETCHERS
// =============================================

const fetchTrafficSignals = async (): Promise<TrafficSignal[]> => {
  const { data, error } = await supabase
    .from('traffic_signals')
    .select('*')
    .order('location');
  
  if (error) throw error;
  return data || [];
};

const fetchCCTVAssets = async (): Promise<CCTVAsset[]> => {
  const { data, error } = await supabase
    .from('cctv_assets')
    .select('*')
    .order('location');
  
  if (error) throw error;
  return data || [];
};

const fetchInfrastructureStatus = async (): Promise<InfrastructureStatus[]> => {
  const { data, error } = await supabase
    .from('infrastructure_status')
    .select('*')
    .order('infrastructure_type');
  
  if (error) throw error;
  return data || [];
};

// =============================================
// HOOKS
// =============================================

export const useTrafficSignals = () => {
  return useStandardRealtimeQuery({
    queryKey: ['traffic-signals'],
    queryFn: fetchTrafficSignals,
    table: 'traffic_signals',
    pollingInterval: 30000, // 30 seconds
  });
};

export const useCCTVAssets = () => {
  return useStandardRealtimeQuery({
    queryKey: ['cctv-assets'],
    queryFn: fetchCCTVAssets,
    table: 'cctv_assets',
    pollingInterval: 30000, // 30 seconds
  });
};

export const useInfrastructureStatus = () => {
  return useStandardRealtimeQuery({
    queryKey: ['infrastructure-status'],
    queryFn: fetchInfrastructureStatus,
    table: 'infrastructure_status',
    pollingInterval: 30000, // 30 seconds
  });
};

/**
 * Combined assets hook with computed statistics
 */
export const useAssets = () => {
  const signalsQuery = useTrafficSignals();
  const cctvQuery = useCCTVAssets();
  const infraQuery = useInfrastructureStatus();

  const trafficSignals = signalsQuery.data || [];
  const cctvAssets = cctvQuery.data || [];
  const infrastructureStatus = infraQuery.data || [];

  const stats = useMemo((): AssetStats => ({
    totalCCTV: cctvAssets.length,
    operationalCCTV: cctvAssets.filter(c => c.status === 'operational').length,
    totalSignals: trafficSignals.length,
    operationalSignals: trafficSignals.filter(s => s.status === 'operational').length,
    totalInfrastructure: infrastructureStatus.length,
    infrastructureHealthy: infrastructureStatus.filter(i => i.status === 'operational').length,
  }), [cctvAssets, trafficSignals, infrastructureStatus]);

  const loading = signalsQuery.isLoading || cctvQuery.isLoading || infraQuery.isLoading;
  const error = signalsQuery.error?.message || cctvQuery.error?.message || infraQuery.error?.message || null;

  return {
    trafficSignals,
    cctvAssets,
    infrastructureStatus,
    stats,
    loading,
    error,
    lastUpdated: signalsQuery.lastUpdated,
    refetch: async () => {
      await Promise.all([
        signalsQuery.refetch(),
        cctvQuery.refetch(),
        infraQuery.refetch(),
      ]);
    },
  };
};

// =============================================
// UTILITIES
// =============================================

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'operational': return 'bg-emerald-500';
    case 'maintenance': return 'bg-blue-500';
    case 'faulty': return 'bg-amber-500';
    case 'degraded': return 'bg-orange-500';
    case 'offline': return 'bg-red-500';
    default: return 'bg-muted';
  }
};

export const getStatusTextColor = (status: string): string => {
  switch (status) {
    case 'operational': return 'text-emerald-500';
    case 'maintenance': return 'text-blue-500';
    case 'faulty': return 'text-amber-500';
    case 'degraded': return 'text-orange-500';
    case 'offline': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
};

export const getAssetIcon = (type: string): string => {
  switch (type) {
    case 'fixed': return 'camera';
    case 'ptz': return 'video';
    case 'lpr': return 'scan';
    case 'thermal': return 'thermometer';
    case 'standard': return 'circle-dot';
    case 'pedestrian': return 'footprints';
    case 'smart': return 'cpu';
    default: return 'circle';
  }
};

export const useCCTVByWard = (wardId: number | null) => {
  const { cctvAssets, loading, error } = useAssets();
  
  return useMemo(() => ({
    cameras: wardId ? cctvAssets.filter(c => c.ward_id === wardId) : cctvAssets,
    loading,
    error,
  }), [cctvAssets, wardId, loading, error]);
};
