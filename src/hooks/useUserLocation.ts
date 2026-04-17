import { useState, useEffect, useCallback } from 'react';
import { suburbIntelligence, type SuburbData } from '@/data/suburbIntelligence';
import { capeTownAreas, type AreaSafetyData } from '@/data/capeTownSafetyData';

export interface UserLocation {
  coords: { lat: number; lng: number } | null;
  nearestSuburb: SuburbData | null;
  nearestArea: AreaSafetyData | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Approximate suburb centroids — extended set
const suburbCentroids: Record<string, { lat: number; lng: number }> = {
  'sea-point': { lat: -33.9196, lng: 18.3878 },
  'khayelitsha': { lat: -34.0356, lng: 18.6739 },
  'mitchells-plain': { lat: -34.0489, lng: 18.6269 },
  'claremont': { lat: -33.9812, lng: 18.4640 },
  'constantia': { lat: -34.0231, lng: 18.4398 },
  'bellville': { lat: -33.8960, lng: 18.6285 },
  'woodstock': { lat: -33.9318, lng: 18.4490 },
  'rondebosch': { lat: -33.9698, lng: 18.4767 },
  'gardens': { lat: -33.9293, lng: 18.4172 },
  'milnerton': { lat: -33.8695, lng: 18.4867 },
  'table-view': { lat: -33.8256, lng: 18.4864 },
  'durbanville': { lat: -33.8305, lng: 18.6529 },
  'fish-hoek': { lat: -34.1368, lng: 18.4269 },
  'hout-bay': { lat: -34.0425, lng: 18.3558 },
  'muizenberg': { lat: -34.1094, lng: 18.4716 },
  'gugulethu': { lat: -33.9944, lng: 18.5813 },
  'langa': { lat: -33.9427, lng: 18.5354 },
  'delft': { lat: -33.9807, lng: 18.6423 },
  'athlone': { lat: -33.9655, lng: 18.5085 },
  'ottery': { lat: -34.0117, lng: 18.5083 },
  'parow': { lat: -33.9000, lng: 18.5833 },
  'wynberg': { lat: -34.0010, lng: 18.4690 },
};

const FALLBACK_COORDS = { lat: -33.9249, lng: 18.4241 }; // Cape Town CBD

export function useUserLocation(): UserLocation & { refresh: () => void } {
  const [state, setState] = useState<UserLocation>({
    coords: null,
    nearestSuburb: null,
    nearestArea: null,
    loading: false,
    error: null,
    permissionDenied: false,
  });

  const resolve = useCallback(
    (coords: { lat: number; lng: number }, opts: { denied?: boolean; error?: string | null } = {}) => {
      // Find nearest area from capeTownAreas (has coordinates)
      let nearestArea: AreaSafetyData | null = null;
      let minDist = Infinity;
      capeTownAreas.forEach(area => {
        const d = haversineDistance(coords, area.coordinates);
        if (d < minDist) {
          minDist = d;
          nearestArea = area;
        }
      });

      // Find nearest suburb in local data using centroids
      let nearestSuburb: SuburbData | null = null;
      let minSubDist = Infinity;
      suburbIntelligence.forEach(sub => {
        const centroid = suburbCentroids[sub.id];
        if (!centroid) return;
        const d = haversineDistance(coords, centroid);
        if (d < minSubDist) {
          minSubDist = d;
          nearestSuburb = sub;
        }
      });

      setState({
        coords,
        nearestSuburb,
        nearestArea,
        loading: false,
        error: opts.error ?? null,
        permissionDenied: !!opts.denied,
      });
    },
    []
  );

  const fetchLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(FALLBACK_COORDS, { error: 'Geolocation not supported' });
      return;
    }
    setState(s => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => {
        const denied = err.code === err.PERMISSION_DENIED;
        resolve(FALLBACK_COORDS, {
          denied,
          error: denied ? 'Location permission denied' : 'Could not get location',
        });
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, [resolve]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { ...state, refresh: fetchLocation };
}
