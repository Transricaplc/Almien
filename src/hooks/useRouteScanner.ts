import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SafetyService } from './useSafetyServices';
import type { Ward } from './useWards';

export interface RiskSegment {
  label: string;
  risk: 'safe' | 'warn' | 'threat';
  weight: number;
}

export interface ScannedRoute {
  from_label: string;
  to_label: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  from_ward: string;
  to_ward: string;
  distance_km: number;
  eta_minutes: number;
  risk_score: number;
  risk_level: 'safe' | 'warn' | 'threat';
  risk_segments: RiskSegment[];
  services_along: SafetyService[];
}

function bandFromScore(score: number): 'safe' | 'warn' | 'threat' {
  return score >= 70 ? 'safe' : score >= 50 ? 'warn' : 'threat';
}

export function useRouteScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScannedRoute | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function scanRoute(
    fromLabel: string,
    fromLat: number,
    fromLng: number,
    toLabel: string,
    toLat: number,
    toLng: number,
  ) {
    setScanning(true);
    setError(null);
    try {
      const { data: wardsData } = await (supabase as any).from('wards').select('*');
      const wards = (wardsData ?? []) as Ward[];

      const findNearest = (lat: number, lng: number): Ward | null => {
        let best: Ward | null = null;
        let bestD = Infinity;
        for (const w of wards) {
          if (w.lat == null || w.lng == null) continue;
          const d = Math.sqrt(Math.pow(w.lat - lat, 2) + Math.pow(w.lng - lng, 2));
          if (d < bestD) { bestD = d; best = w; }
        }
        return best;
      };

      const fromWard = findNearest(fromLat, fromLng);
      const toWard = findNearest(toLat, toLng);

      const midLat = (fromLat + toLat) / 2;
      const midLng = (fromLng + toLng) / 2;
      const { data: servicesData } = await (supabase as any)
        .from('safety_services')
        .select('*');
      const services = (servicesData ?? []) as SafetyService[];
      const nearby = services
        .map((s) => ({
          ...s,
          dist: Math.sqrt(Math.pow((s.lat ?? 0) - midLat, 2) + Math.pow((s.lng ?? 0) - midLng, 2)),
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5);

      const fromScore = fromWard?.safety_score ?? 60;
      const toScore = toWard?.safety_score ?? 60;
      const avgScore = Math.round((fromScore + toScore) / 2);
      const riskLevel = bandFromScore(avgScore);

      const R = 6371;
      const dLat = ((toLat - fromLat) * Math.PI) / 180;
      const dLng = ((toLng - fromLng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((fromLat * Math.PI) / 180) *
          Math.cos((toLat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const distKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
      const etaMin = Math.max(1, Math.round(distKm / 0.5));

      const segments: RiskSegment[] = [
        { label: fromWard?.suburb || 'Origin', risk: bandFromScore(fromScore), weight: 2 },
        { label: 'Mid-route', risk: riskLevel, weight: 3 },
        { label: toWard?.suburb || 'Destination', risk: bandFromScore(toScore), weight: 2 },
      ];

      setResult({
        from_label: fromLabel,
        to_label: toLabel,
        from_lat: fromLat,
        from_lng: fromLng,
        to_lat: toLat,
        to_lng: toLng,
        from_ward: fromWard?.ward_name || 'Unknown Ward',
        to_ward: toWard?.ward_name || 'Unknown Ward',
        distance_km: distKm,
        eta_minutes: etaMin,
        risk_score: avgScore,
        risk_level: riskLevel,
        risk_segments: segments,
        services_along: nearby,
      });
    } catch (e: any) {
      setError(e?.message || 'Scan failed');
    } finally {
      setScanning(false);
    }
  }

  return { scanRoute, scanning, result, error, reset: () => setResult(null) };
}
