import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ServiceType = 'saps' | 'hospital' | 'fire' | 'ambulance' | 'trauma' | 'shelter';

export interface SafetyService {
  id: number;
  name: string;
  type: ServiceType;
  address: string | null;
  phone: string | null;
  emergency_phone: string | null;
  lat: number;
  lng: number;
  ward_number: number | null;
  is_24h: boolean;
}

export function useSafetyServices(type?: ServiceType) {
  return useQuery<SafetyService[]>({
    queryKey: ['safety_services', type ?? 'all'],
    queryFn: async () => {
      let q = (supabase as any).from('safety_services').select('*');
      if (type) q = q.eq('type', type);
      const { data, error } = await q.order('name');
      if (error) throw error;
      return (data ?? []) as SafetyService[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useNearestServices(lat: number | null, lng: number | null, limit = 3) {
  const { data: services } = useSafetyServices();
  if (!lat || !lng || !services) return [] as (SafetyService & { dist: number })[];
  return services
    .map((s) => ({
      ...s,
      dist: Math.sqrt(Math.pow((s.lat ?? 0) - lat, 2) + Math.pow((s.lng ?? 0) - lng, 2)),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit);
}
