import { capeTownAreas, type AreaSafetyData } from '@/data/capeTownSafetyData';
import { suburbIntelligence, type SuburbData } from '@/data/suburbIntelligence';
import type { SuburbIntelligence } from '@/hooks/useSuburbIntelligence';

export interface UnifiedSuburbResult {
  id: string;
  name: string;
  wardId?: number;
  safetyScore: number; // normalised 0-10
  areaData?: AreaSafetyData;
  suburbData?: SuburbData;
  coordinates?: { lat: number; lng: number };
  matchType: 'area' | 'suburb' | 'ward';
}

export function searchAllSuburbs(
  query: string,
  supabaseSuburbs: SuburbIntelligence[] = []
): UnifiedSuburbResult[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();

  const results: UnifiedSuburbResult[] = [];
  const seenNames = new Set<string>();

  // 1. capeTownAreas — has coordinates + safety scores (already 0-10)
  capeTownAreas.forEach(area => {
    const key = area.name.toLowerCase();
    if (area.name.toLowerCase().includes(q) && !seenNames.has(key)) {
      seenNames.add(key);
      results.push({
        id: area.id,
        name: area.name,
        safetyScore: area.safetyScore,
        areaData: area,
        coordinates: area.coordinates,
        matchType: 'area',
      });
    }
  });

  // 2. local suburbIntelligence — has SAPS + hospital contacts (score 0-100)
  suburbIntelligence.forEach(sub => {
    const key = sub.suburb_name.toLowerCase();
    if (
      (sub.suburb_name.toLowerCase().includes(q) ||
        String(sub.ward_id).includes(q) ||
        sub.saps_station.toLowerCase().includes(q)) &&
      !seenNames.has(key)
    ) {
      seenNames.add(key);
      results.push({
        id: sub.id,
        name: sub.suburb_name,
        wardId: sub.ward_id,
        safetyScore: sub.safety_score / 10,
        suburbData: sub,
        matchType: 'suburb',
      });
    } else if (
      (sub.suburb_name.toLowerCase().includes(q) ||
        String(sub.ward_id).includes(q)) &&
      seenNames.has(key)
    ) {
      // Augment existing result with suburbData (SAPS/hospital) if missing
      const existing = results.find(r => r.name.toLowerCase() === key);
      if (existing && !existing.suburbData) {
        existing.suburbData = sub;
        existing.wardId = sub.ward_id;
      }
    }
  });

  // 3. Supabase suburbs — catches anything not in local data
  supabaseSuburbs.forEach(sub => {
    const key = sub.suburb_name.toLowerCase();
    if (
      (sub.suburb_name.toLowerCase().includes(q) ||
        String(sub.ward_id).includes(q)) &&
      !seenNames.has(key)
    ) {
      seenNames.add(key);
      results.push({
        id: `supabase-${sub.id}`,
        name: sub.suburb_name,
        wardId: sub.ward_id,
        safetyScore: sub.safety_score / 10,
        matchType: 'ward',
      });
    }
  });

  return results.slice(0, 8);
}
