import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GeoWardBoundaryRow {
  id: string;
  ward_number: number;
  boundary_geojson: unknown;
}

export function useGeoWardsRealtime() {
  const [wards, setWards] = useState<GeoWardBoundaryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInitial = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('geo_wards')
        .select('id, ward_number, boundary_geojson')
        .not('boundary_geojson', 'is', null);

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setWards([]);
      } else {
        setWards((data as GeoWardBoundaryRow[]) ?? []);
      }

      setIsLoading(false);
    };

    fetchInitial();

    const channel = supabase
      .channel('geo_wards_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'geo_wards',
        },
        (payload) => {
          setWards((current) => {
            const evt = payload.eventType;
            if (evt === 'INSERT') {
              const row = payload.new as GeoWardBoundaryRow;
              if (!row?.boundary_geojson) return current;
              if (current.some((w) => w.id === row.id)) return current;
              return [...current, row];
            }

            if (evt === 'UPDATE') {
              const row = payload.new as GeoWardBoundaryRow;
              const next = current.map((w) => (w.id === row.id ? row : w));
              return row?.boundary_geojson ? next : next.filter((w) => w.id !== row.id);
            }

            if (evt === 'DELETE') {
              const oldRow = payload.old as { id?: string };
              if (!oldRow?.id) return current;
              return current.filter((w) => w.id !== oldRow.id);
            }

            return current;
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { wards, isLoading, error };
}
