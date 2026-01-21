import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type WardRow = {
  id: string;
  ward_number: number;
  boundary_geojson: unknown | null;
};

type WardSuburbRow = {
  ward_id: string;
  suburb_id: string;
};

type SuburbRow = {
  id: string;
  coordinates_lat: number | null;
  coordinates_lng: number | null;
};

export interface WardCentroid {
  wardNumber: number;
  hasBoundary: boolean;
  center: { lat: number; lng: number } | null;
}

/**
 * Provides an approximate centroid per ward by averaging suburb coordinates in that ward.
 * This allows us to render a fallback marker even when a ward polygon is missing.
 */
export function useWardCentroids() {
  const [wards, setWards] = useState<WardRow[]>([]);
  const [wardSuburbs, setWardSuburbs] = useState<WardSuburbRow[]>([]);
  const [suburbs, setSuburbs] = useState<SuburbRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);

      const [wardsRes, wardSuburbsRes, suburbsRes] = await Promise.all([
        supabase.from('geo_wards').select('id, ward_number, boundary_geojson'),
        supabase.from('geo_ward_suburbs').select('ward_id, suburb_id'),
        supabase.from('geo_suburbs').select('id, coordinates_lat, coordinates_lng'),
      ]);

      if (!mounted) return;

      const firstErr = wardsRes.error || wardSuburbsRes.error || suburbsRes.error;
      if (firstErr) {
        setError(firstErr.message);
        setWards([]);
        setWardSuburbs([]);
        setSuburbs([]);
        setIsLoading(false);
        return;
      }

      setWards((wardsRes.data as WardRow[]) ?? []);
      setWardSuburbs((wardSuburbsRes.data as WardSuburbRow[]) ?? []);
      setSuburbs((suburbsRes.data as SuburbRow[]) ?? []);
      setIsLoading(false);
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, []);

  const centroids = useMemo((): WardCentroid[] => {
    const suburbMap = new Map<string, SuburbRow>();
    suburbs.forEach((s) => suburbMap.set(s.id, s));

    const wardIdToSuburbIds = new Map<string, string[]>();
    wardSuburbs.forEach((ws) => {
      const arr = wardIdToSuburbIds.get(ws.ward_id) ?? [];
      arr.push(ws.suburb_id);
      wardIdToSuburbIds.set(ws.ward_id, arr);
    });

    return wards
      .map((w) => {
        const suburbIds = wardIdToSuburbIds.get(w.id) ?? [];
        let sumLat = 0;
        let sumLng = 0;
        let count = 0;

        suburbIds.forEach((sid) => {
          const s = suburbMap.get(sid);
          if (!s) return;
          if (s.coordinates_lat == null || s.coordinates_lng == null) return;
          sumLat += Number(s.coordinates_lat);
          sumLng += Number(s.coordinates_lng);
          count += 1;
        });

        const center =
          count > 0
            ? { lat: sumLat / count, lng: sumLng / count }
            : null;

        return {
          wardNumber: w.ward_number,
          hasBoundary: !!w.boundary_geojson,
          center,
        };
      })
      .sort((a, b) => a.wardNumber - b.wardNumber);
  }, [suburbs, wardSuburbs, wards]);

  return { centroids, isLoading, error };
}
