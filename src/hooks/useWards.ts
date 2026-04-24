import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Ward {
  id: number;
  ward_number: number;
  ward_name: string | null;
  suburb: string | null;
  district: string | null;
  lat: number | null;
  lng: number | null;
  safety_score: number;
  incident_count: number;
}

export function useWards() {
  return useQuery<Ward[]>({
    queryKey: ['wards'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('wards')
        .select('*')
        .order('ward_number');
      if (error) throw error;
      return (data ?? []) as Ward[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWardByCoords(lat: number | null, lng: number | null): Ward | null {
  const { data: wards } = useWards();
  if (!lat || !lng || !wards) return null;
  let nearest: Ward | null = null;
  let minDist = Infinity;
  for (const ward of wards) {
    if (ward.lat == null || ward.lng == null) continue;
    const d = Math.sqrt(Math.pow(ward.lat - lat, 2) + Math.pow(ward.lng - lng, 2));
    if (d < minDist) {
      minDist = d;
      nearest = ward;
    }
  }
  return nearest;
}
