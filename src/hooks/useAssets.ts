import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface UseAssetsReturn {
  trafficSignals: TrafficSignal[];
  cctvAssets: CCTVAsset[];
  infrastructureStatus: InfrastructureStatus[];
  loading: boolean;
  error: string | null;
  stats: {
    totalCCTV: number;
    operationalCCTV: number;
    totalSignals: number;
    operationalSignals: number;
    infrastructureHealthy: number;
  };
  refetch: () => Promise<void>;
}

export const useAssets = (): UseAssetsReturn => {
  const [trafficSignals, setTrafficSignals] = useState<TrafficSignal[]>([]);
  const [cctvAssets, setCctvAssets] = useState<CCTVAsset[]>([]);
  const [infrastructureStatus, setInfrastructureStatus] = useState<InfrastructureStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [signalsResult, cctvResult, infraResult] = await Promise.all([
        supabase.from('traffic_signals').select('*').order('location'),
        supabase.from('cctv_assets').select('*').order('location'),
        supabase.from('infrastructure_status').select('*').order('infrastructure_type')
      ]);

      if (signalsResult.error) throw signalsResult.error;
      if (cctvResult.error) throw cctvResult.error;
      if (infraResult.error) throw infraResult.error;

      setTrafficSignals(signalsResult.data || []);
      setCctvAssets(cctvResult.data || []);
      setInfrastructureStatus(infraResult.data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => ({
    totalCCTV: cctvAssets.length,
    operationalCCTV: cctvAssets.filter(c => c.status === 'operational').length,
    totalSignals: trafficSignals.length,
    operationalSignals: trafficSignals.filter(s => s.status === 'operational').length,
    infrastructureHealthy: infrastructureStatus.filter(i => i.status === 'operational').length
  }), [cctvAssets, trafficSignals, infrastructureStatus]);

  return {
    trafficSignals,
    cctvAssets,
    infrastructureStatus,
    loading,
    error,
    stats,
    refetch: fetchData
  };
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'operational': return 'bg-emerald-500';
    case 'maintenance': return 'bg-blue-500';
    case 'faulty': return 'bg-yellow-500';
    case 'degraded': return 'bg-orange-500';
    case 'offline': return 'bg-red-500';
    default: return 'bg-muted';
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
