import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GeoRegion {
  id: string;
  name: string;
  code: string;
}

export interface GeoDistrict {
  id: string;
  region_id: string;
  name: string;
  municipality_type: string;
  code: string | null;
}

export interface GeoLocalMunicipality {
  id: string;
  district_id: string;
  name: string;
  code: string | null;
}

export interface GeoWard {
  id: string;
  ward_number: number;
  district_id: string | null;
  local_municipality_id: string | null;
  boundary_geojson: unknown;
}

export interface GeoSuburb {
  id: string;
  name: string;
  postcode: string;
  district_id: string | null;
  local_municipality_id: string | null;
  coordinates_lat: number | null;
  coordinates_lng: number | null;
}

export interface GeoWardSuburb {
  ward_id: string;
  suburb_id: string;
  coverage_percent: number | null;
}

interface UseGeoOntologyReturn {
  regions: GeoRegion[];
  districts: GeoDistrict[];
  localMunicipalities: GeoLocalMunicipality[];
  wards: GeoWard[];
  suburbs: GeoSuburb[];
  wardSuburbs: GeoWardSuburb[];
  isLoading: boolean;
  error: Error | null;
  getDistrictsByRegion: (regionCode: string) => GeoDistrict[];
  getLocalMunicipalitiesByDistrict: (districtId: string) => GeoLocalMunicipality[];
  getWardsByDistrict: (districtId: string) => GeoWard[];
  getSuburbsByDistrict: (districtId: string) => GeoSuburb[];
  getSuburbsByPostcode: (postcode: string) => GeoSuburb[];
  searchSuburbs: (query: string) => GeoSuburb[];
  getSuburbsForWard: (wardId: string) => GeoSuburb[];
  refresh: () => Promise<void>;
}

export function useGeoOntology(): UseGeoOntologyReturn {
  const [regions, setRegions] = useState<GeoRegion[]>([]);
  const [districts, setDistricts] = useState<GeoDistrict[]>([]);
  const [localMunicipalities, setLocalMunicipalities] = useState<GeoLocalMunicipality[]>([]);
  const [wards, setWards] = useState<GeoWard[]>([]);
  const [suburbs, setSuburbs] = useState<GeoSuburb[]>([]);
  const [wardSuburbs, setWardSuburbs] = useState<GeoWardSuburb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [
        regionsRes,
        districtsRes,
        localMunRes,
        wardsRes,
        suburbsRes,
        wardSuburbsRes
      ] = await Promise.all([
        supabase.from('geo_regions').select('*'),
        supabase.from('geo_districts').select('*'),
        supabase.from('geo_local_municipalities').select('*'),
        supabase.from('geo_wards').select('*'),
        supabase.from('geo_suburbs').select('*'),
        supabase.from('geo_ward_suburbs').select('ward_id, suburb_id, coverage_percent')
      ]);

      if (regionsRes.error) throw regionsRes.error;
      if (districtsRes.error) throw districtsRes.error;
      if (localMunRes.error) throw localMunRes.error;
      if (wardsRes.error) throw wardsRes.error;
      if (suburbsRes.error) throw suburbsRes.error;
      if (wardSuburbsRes.error) throw wardSuburbsRes.error;

      setRegions(regionsRes.data || []);
      setDistricts(districtsRes.data || []);
      setLocalMunicipalities(localMunRes.data || []);
      setWards(wardsRes.data || []);
      setSuburbs(suburbsRes.data || []);
      setWardSuburbs(wardSuburbsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch geo ontology'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getDistrictsByRegion = useCallback((regionCode: string): GeoDistrict[] => {
    const region = regions.find(r => r.code === regionCode);
    if (!region) return [];
    return districts.filter(d => d.region_id === region.id);
  }, [regions, districts]);

  const getLocalMunicipalitiesByDistrict = useCallback((districtId: string): GeoLocalMunicipality[] => {
    return localMunicipalities.filter(lm => lm.district_id === districtId);
  }, [localMunicipalities]);

  const getWardsByDistrict = useCallback((districtId: string): GeoWard[] => {
    return wards.filter(w => w.district_id === districtId);
  }, [wards]);

  const getSuburbsByDistrict = useCallback((districtId: string): GeoSuburb[] => {
    return suburbs.filter(s => s.district_id === districtId);
  }, [suburbs]);

  const getSuburbsByPostcode = useCallback((postcode: string): GeoSuburb[] => {
    return suburbs.filter(s => s.postcode === postcode);
  }, [suburbs]);

  const searchSuburbs = useCallback((query: string): GeoSuburb[] => {
    const lowerQuery = query.toLowerCase();
    return suburbs.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) || 
      s.postcode.includes(query)
    );
  }, [suburbs]);

  const getSuburbsForWard = useCallback((wardId: string): GeoSuburb[] => {
    const suburbIds = wardSuburbs
      .filter(ws => ws.ward_id === wardId)
      .map(ws => ws.suburb_id);
    return suburbs.filter(s => suburbIds.includes(s.id));
  }, [wardSuburbs, suburbs]);

  return {
    regions,
    districts,
    localMunicipalities,
    wards,
    suburbs,
    wardSuburbs,
    isLoading,
    error,
    getDistrictsByRegion,
    getLocalMunicipalitiesByDistrict,
    getWardsByDistrict,
    getSuburbsByDistrict,
    getSuburbsByPostcode,
    searchSuburbs,
    getSuburbsForWard,
    refresh: fetchAll
  };
}
