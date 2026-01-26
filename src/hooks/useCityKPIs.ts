import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCriticalRealtimeQuery, useStandardRealtimeQuery } from './useRealtimeQuery';

// =============================================
// TYPES
// =============================================

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

// =============================================
// FETCHERS
// =============================================

const fetchKPIs = async (): Promise<CityKPI[]> => {
  const { data, error } = await supabase
    .from('city_kpis')
    .select('*')
    .order('category');
  
  if (error) throw error;
  return data || [];
};

const fetchDataSourceHealth = async (): Promise<DataSourceHealth[]> => {
  const { data, error } = await supabase
    .from('data_source_health')
    .select('*')
    .order('is_critical', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

const fetchActiveAlerts = async (): Promise<AlertQueueItem[]> => {
  const { data, error } = await supabase
    .from('alert_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) throw error;
  return data || [];
};

// =============================================
// HOOKS
// =============================================

export const useCityKPIs = () => {
  return useStandardRealtimeQuery({
    queryKey: ['city-kpis'],
    queryFn: fetchKPIs,
    table: 'city_kpis',
    pollingInterval: 60000, // 1 minute
  });
};

export const useDataSourceHealth = () => {
  return useCriticalRealtimeQuery({
    queryKey: ['data-source-health'],
    queryFn: fetchDataSourceHealth,
    table: 'data_source_health',
    pollingInterval: 15000, // 15 seconds for critical monitoring
  });
};

export const useActiveAlerts = () => {
  return useCriticalRealtimeQuery({
    queryKey: ['active-alerts'],
    queryFn: fetchActiveAlerts,
    table: 'alert_queue',
    pollingInterval: 10000, // 10 seconds for alerts
  });
};

/**
 * Combined hook for city intelligence dashboard
 * Uses individual hooks for better caching and selective updates
 */
export const useCityIntelligence = () => {
  const kpisQuery = useCityKPIs();
  const healthQuery = useDataSourceHealth();
  const alertsQuery = useActiveAlerts();

  return {
    // Data
    kpis: kpisQuery.data || [],
    dataSourceHealth: healthQuery.data || [],
    activeAlerts: alertsQuery.data || [],
    
    // Combined loading state
    loading: kpisQuery.isLoading || healthQuery.isLoading || alertsQuery.isLoading,
    isRefetching: kpisQuery.isRefetching || healthQuery.isRefetching || alertsQuery.isRefetching,
    
    // Combined error state
    error: kpisQuery.error?.message || healthQuery.error?.message || alertsQuery.error?.message || null,
    
    // Last updated (most recent of all three)
    lastUpdated: [kpisQuery.lastUpdated, healthQuery.lastUpdated, alertsQuery.lastUpdated]
      .filter(Boolean)
      .sort((a, b) => (b?.getTime() || 0) - (a?.getTime() || 0))[0] || null,
    
    // Refetch all
    refetch: async () => {
      await Promise.all([
        kpisQuery.refetch(),
        healthQuery.refetch(),
        alertsQuery.refetch(),
      ]);
    },
  };
};

// =============================================
// UTILITIES
// =============================================

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
    case 'degraded': return 'bg-amber-500';
    case 'unhealthy': return 'bg-orange-500';
    case 'offline': return 'bg-red-500';
    default: return 'bg-muted';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-amber-500 text-black';
    case 'low': return 'bg-blue-500 text-white';
    default: return 'bg-muted';
  }
};

export const useCategorizedKPIs = () => {
  const { kpis, loading, error } = useCityIntelligence();
  
  return useMemo(() => ({
    safety: kpis.filter(k => k.category === 'safety'),
    infrastructure: kpis.filter(k => k.category === 'infrastructure'),
    environment: kpis.filter(k => k.category === 'environment'),
    transport: kpis.filter(k => k.category === 'transport'),
    loading,
    error,
  }), [kpis, loading, error]);
};
