import { supabase } from '@/integrations/supabase/client';
import { useStandardRealtimeQuery } from './useRealtimeQuery';

export interface SafeZone {
  id: string;
  name: string;
  zone_type: string;
  address: string;
  neighborhood: string | null;
  latitude: number;
  longitude: number;
  contact_number: string | null;
  operating_hours: Record<string, string>;
  safety_rating: number;
  is_24_hours: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useSafeZones = (zoneType?: string) => {
  return useStandardRealtimeQuery<SafeZone[]>({
    queryKey: ['safe-zones', zoneType ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('safe_zones')
        .select('*')
        .order('name');

      if (zoneType) {
        query = query.eq('zone_type', zoneType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as SafeZone[];
    },
    table: 'safe_zones',
  });
};

export const useNearbySafeZones = (lat: number, lng: number, radiusKm: number = 5) => {
  return useStandardRealtimeQuery<SafeZone[]>({
    queryKey: ['safe-zones-nearby', String(lat), String(lng), String(radiusKm)],
    queryFn: async () => {
      // Simple bounding box calculation (approximate)
      const latDelta = radiusKm / 111; // ~111km per degree latitude
      const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));
      
      const { data, error } = await supabase
        .from('safe_zones')
        .select('*')
        .gte('latitude', lat - latDelta)
        .lte('latitude', lat + latDelta)
        .gte('longitude', lng - lngDelta)
        .lte('longitude', lng + lngDelta)
        .order('name');

      if (error) throw error;
      
      // Calculate approximate distances and sort
      const withDistances = (data ?? []).map(zone => ({
        ...zone,
        distance: calculateDistance(lat, lng, Number(zone.latitude), Number(zone.longitude))
      }));
      
      return withDistances.sort((a, b) => a.distance - b.distance) as SafeZone[];
    },
    table: 'safe_zones',
  });
};

// Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const getZoneTypeIcon = (type: string) => {
  switch (type) {
    case 'police_station': return 'shield';
    case 'hospital': return 'cross';
    case 'fire_station': return 'flame';
    case 'cid_office': return 'eye';
    case 'shopping_mall': return 'shopping-bag';
    case 'community_center': return 'users';
    default: return 'map-pin';
  }
};

export const getZoneTypeColor = (type: string) => {
  switch (type) {
    case 'police_station': return '#3b82f6';
    case 'hospital': return '#ef4444';
    case 'fire_station': return '#f97316';
    case 'cid_office': return '#8b5cf6';
    case 'shopping_mall': return '#10b981';
    case 'community_center': return '#06b6d4';
    default: return '#6b7280';
  }
};
