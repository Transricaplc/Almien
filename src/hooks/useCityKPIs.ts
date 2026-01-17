import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CityKPI {
  id: string;
  kpi_code: string;
  kpi_name: string;
  category: string;
  current_value: number;
  previous_value: number | null;
  target_value: number | null;
  unit: string;
  trend: string;
  trend_percent: number | null;
  period: string;
  period_start: string;
  period_end: string;
  last_updated: string;
}

export interface DataSourceHealth {
  id: string;
  source_name: string;
  source_type: string;
  status: string;
  last_successful_sync: string | null;
  consecutive_failures: number;
  is_critical: boolean;
}

export interface AlertQueueItem {
  id: string;
  alert_type: string;
  priority: string;
  title: string;
  description: string | null;
  entity_type: string | null;
  status: string;
  created_at: string;
}

interface UseCityIntelligenceReturn {
  kpis: CityKPI[];
  dataSourceHealth: DataSourceHealth[];
  activeAlerts: AlertQueueItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCityIntelligence = (): UseCityIntelligenceReturn => {
  const [kpis, setKpis] = useState<CityKPI[]>([]);
  const [dataSourceHealth, setDataSourceHealth] = useState<DataSourceHealth[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<AlertQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [kpisResult, healthResult, alertsResult] = await Promise.all([
        supabase.from('city_kpis').select('*').order('category'),
        supabase.from('data_source_health').select('*').order('is_critical', { ascending: false }),
        supabase.from('alert_queue').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(10)
      ]);

      if (kpisResult.error) throw kpisResult.error;
      if (healthResult.error) throw healthResult.error;
      if (alertsResult.error) throw alertsResult.error;

      setKpis(kpisResult.data || []);
      setDataSourceHealth(healthResult.data || []);
      setActiveAlerts(alertsResult.data || []);
    } catch (err) {
      console.error('Error fetching city intelligence:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60 * 1000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return {
    kpis,
    dataSourceHealth,
    activeAlerts,
    loading,
    error,
    refetch: fetchData
  };
};

export const getKPIsByCategory = (kpis: CityKPI[], category: string): CityKPI[] => {
  return kpis.filter(k => k.category === category);
};

export const getTrendColor = (trend: string): string => {
  switch (trend) {
    case 'up': return 'text-emerald-500';
    case 'down': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
};

export const getHealthStatusColor = (status: string): string => {
  switch (status) {
    case 'healthy': return 'bg-emerald-500';
    case 'degraded': return 'bg-yellow-500';
    case 'unhealthy': return 'bg-orange-500';
    case 'offline': return 'bg-red-500';
    default: return 'bg-muted';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-blue-500 text-white';
    default: return 'bg-muted';
  }
};
