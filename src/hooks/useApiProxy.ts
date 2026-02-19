import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// =============================================
// ESP Status
// =============================================

export interface ESPStatus {
  status: 'live' | 'demo';
  eskom_stage?: number;
  eskom_updated?: string;
  capetown_stage?: number | null;
  capetown_updated?: string | null;
  stage?: number;
  note?: string;
}

export interface ESPAreaSchedule {
  status: 'live' | 'demo';
  area_id: string;
  area_name?: string;
  region?: string;
  events?: Array<{ note: string; start: string; end: string }>;
  next_outage?: { start: string; end: string; note: string } | null;
  note?: string;
}

export interface ProxyWeather {
  status: 'live' | 'demo';
  temp: number;
  feels_like: number;
  wind_speed: number;
  wind_direction: number | string;
  description: string;
  icon: string;
  humidity: number;
  wind_alert: boolean;
  note?: string;
}

const PROXY_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/apiproxy`;

async function proxyFetch<T>(params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  try {
    const resp = await fetch(`${PROXY_BASE}?${qs}`, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
    });
    if (!resp.ok) throw new Error(`Proxy error: ${resp.status}`);
    return resp.json();
  } catch {
    // Fallback: return null to trigger demo mode in hooks
    throw new Error('Edge function unavailable');
  }
}

// =============================================
// useESPStatus — national/CT stage
// =============================================

export const useESPStatus = () => {
  const [data, setData] = useState<ESPStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      setLoading(true);
      const result = await proxyFetch<ESPStatus>({ service: 'esp-status' });
      setData(result);
      setError(null);
    } catch (e: any) {
      // Fallback to demo data
      setData({ status: 'demo', stage: 0, stage_updated: new Date().toISOString(), note: '🔄 Demo data — edge function deploying' } as any);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const iv = setInterval(fetch_, 15 * 60 * 1000); // 15 min
    return () => clearInterval(iv);
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
};

// =============================================
// useESPArea — schedule for a specific area ID
// =============================================

export const useESPArea = (areaId: string | null) => {
  const [data, setData] = useState<ESPAreaSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    if (!areaId) return;
    try {
      setLoading(true);
      const result = await proxyFetch<ESPAreaSchedule>({ service: 'esp-area', area_id: areaId });
      setData(result);
      setError(null);
    } catch {
      setData({ status: 'demo', area_id: areaId, events: [], next_outage: null, note: '🔄 Demo data' } as any);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
};

// =============================================
// useProxyWeather — weather via edge function
// =============================================

export const useProxyWeather = (lat?: string, lon?: string) => {
  const [data, setData] = useState<ProxyWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = { service: 'weather' };
      if (lat) params.lat = lat;
      if (lon) params.lon = lon;
      const result = await proxyFetch<ProxyWeather>(params);
      setData(result);
      setError(null);
    } catch {
      setData({ status: 'demo', temp: 24, feels_like: 22, wind_speed: 15, wind_direction: 'SE', description: 'Clear sky', icon: '01d', humidity: 55, wind_alert: false, note: '🔄 Demo data' });
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    fetch_();
    const iv = setInterval(fetch_, 15 * 60 * 1000);
    return () => clearInterval(iv);
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
};

// =============================================
// ESP Area ID Mapping
// =============================================

export const ESP_AREA_MAP: Record<string, string> = {
  'cape-town-cbd': 'capetown-6-capetowncbd',
  'sea-point': 'capetown-16-seapoint',
  'camps-bay': 'capetown-16-campsbay',
  'green-point': 'capetown-16-greenpoint',
  'gardens': 'capetown-6-gardens',
  'woodstock': 'capetown-6-woodstock',
  'observatory': 'capetown-6-observatory',
  'bo-kaap': 'capetown-6-bokaap',
  'athlone': 'capetown-13-athlone',
  'mitchells-plain': 'capetown-13-mitchellsplain',
  'khayelitsha': 'capetown-12-khayelitsha',
  'bellville': 'capetown-8-bellville',
  'durbanville': 'capetown-8-durbanville',
  'goodwood': 'capetown-8-goodwood',
  'parow': 'capetown-8-parow',
  'claremont': 'capetown-15-claremont',
  'wynberg': 'capetown-15-wynberg',
  'rondebosch': 'capetown-15-rondebosch',
  'newlands': 'capetown-15-newlands',
  'muizenberg': 'capetown-16-muizenberg',
  'stellenbosch': 'westerncape-10-stellenbosch',
  'george': 'westerncape-10-george',
  'paarl': 'westerncape-10-paarl',
  'cpt-airport': 'capetown-6-capetowninternationalairport',
};
