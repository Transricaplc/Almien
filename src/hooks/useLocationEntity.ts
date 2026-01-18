import { useCallback } from 'react';
import { useDashboard, EntityType, SelectedEntity } from '@/contexts/DashboardContext';
import { useSuburbIntelligence, SuburbIntelligence } from '@/hooks/useSuburbIntelligence';

/**
 * Location Entity Data Contract
 * Defines the structure for location-based entity data fetching
 */
export interface LocationEntityData {
  entityType: 'area' | 'suburb' | 'ward';
  entityId: string;
  source: 'search' | 'map' | 'list' | 'filter';
  module?: string;
}

export interface LocationEntityPayload {
  id: string;
  type: EntityType;
  name: string;
  coordinates?: { lat: number; lng: number };
  data: Record<string, unknown>;
}

/**
 * Hook for universal location entity selection
 * Ensures consistent panel expansion and data fetching across all modules
 */
export const useLocationEntity = () => {
  const { selectEntity, openContextPanel } = useDashboard();
  const { suburbs } = useSuburbIntelligence();

  /**
   * Select a suburb entity - triggers top-center panel expansion
   */
  const selectSuburb = useCallback((
    suburb: SuburbIntelligence,
    source: LocationEntityData['source'] = 'list',
    module?: string
  ) => {
    const payload: LocationEntityPayload = {
      id: suburb.id,
      type: 'suburb',
      name: suburb.suburb_name,
      data: {
        ward_id: suburb.ward_id,
        area_code: suburb.area_code,
        safety_score: suburb.safety_score,
        cctv_coverage: suburb.cctv_coverage,
        incidents_24h: suburb.incidents_24h,
        saps_station: suburb.saps_station,
        saps_contact: suburb.saps_contact,
        fire_station: suburb.fire_station,
        fire_contact: suburb.fire_contact,
        hospital_name: suburb.hospital_name,
        hospital_contact: suburb.hospital_contact,
        risk_type: suburb.risk_type,
        _source: source,
        _module: module,
      }
    };
    
    selectEntity(payload);
  }, [selectEntity]);

  /**
   * Select an area entity - triggers top-center panel expansion
   */
  const selectArea = useCallback((
    area: {
      id: string;
      name: string;
      areaCode: string;
      safetyScore: number;
      incidents24h: number;
      camerasCoverage: number;
      policeStation: string;
      policeNumber: string;
      nearestHospital: string;
      hospitalNumber: string;
      riskLevel: string;
    },
    source: LocationEntityData['source'] = 'list',
    module?: string
  ) => {
    const payload: LocationEntityPayload = {
      id: area.id,
      type: 'area',
      name: area.name,
      data: {
        area_code: area.areaCode,
        safety_score: area.safetyScore,
        incidents_24h: area.incidents24h,
        cctv_coverage: area.camerasCoverage,
        saps_station: area.policeStation,
        saps_contact: area.policeNumber,
        hospital_name: area.nearestHospital,
        hospital_contact: area.hospitalNumber,
        risk_type: area.riskLevel,
        _source: source,
        _module: module,
      }
    };
    
    selectEntity(payload);
  }, [selectEntity]);

  /**
   * Select a ward entity - triggers top-center panel expansion
   */
  const selectWard = useCallback((
    wardId: number,
    source: LocationEntityData['source'] = 'list',
    module?: string
  ) => {
    // Find suburbs in this ward to aggregate data
    const wardSuburbs = suburbs?.filter(s => s.ward_id === wardId) || [];
    
    // Aggregate ward-level metrics
    const avgSafetyScore = wardSuburbs.length > 0
      ? Math.round(wardSuburbs.reduce((sum, s) => sum + s.safety_score, 0) / wardSuburbs.length)
      : 0;
    
    const totalIncidents = wardSuburbs.reduce((sum, s) => sum + s.incidents_24h, 0);
    const avgCCTV = wardSuburbs.length > 0
      ? Math.round(wardSuburbs.reduce((sum, s) => sum + s.cctv_coverage, 0) / wardSuburbs.length)
      : 0;
    
    // Use first suburb's emergency contacts as ward default
    const primarySuburb = wardSuburbs[0];
    
    const payload: LocationEntityPayload = {
      id: `ward-${wardId}`,
      type: 'ward',
      name: `Ward ${wardId}`,
      data: {
        ward_id: wardId,
        safety_score: avgSafetyScore,
        incidents_24h: totalIncidents,
        cctv_coverage: avgCCTV,
        suburb_count: wardSuburbs.length,
        suburbs: wardSuburbs.map(s => s.suburb_name).slice(0, 5),
        saps_station: primarySuburb?.saps_station || 'N/A',
        saps_contact: primarySuburb?.saps_contact || 'N/A',
        fire_station: primarySuburb?.fire_station || 'N/A',
        fire_contact: primarySuburb?.fire_contact || 'N/A',
        hospital_name: primarySuburb?.hospital_name || 'N/A',
        hospital_contact: primarySuburb?.hospital_contact || 'N/A',
        _source: source,
        _module: module,
      }
    };
    
    selectEntity(payload);
  }, [selectEntity, suburbs]);

  /**
   * Select a rideshare-context entity
   */
  const selectRideshareEntity = useCallback((
    suburb: SuburbIntelligence,
    timeOfDay: string,
    source: LocationEntityData['source'] = 'list'
  ) => {
    const payload: LocationEntityPayload = {
      id: suburb.id,
      type: 'rideshare',
      name: suburb.suburb_name,
      data: {
        ward_id: suburb.ward_id,
        area_code: suburb.area_code,
        safety_score: suburb.safety_score,
        cctv_coverage: suburb.cctv_coverage,
        incidents_24h: suburb.incidents_24h,
        saps_station: suburb.saps_station,
        saps_contact: suburb.saps_contact,
        fire_station: suburb.fire_station,
        fire_contact: suburb.fire_contact,
        hospital_name: suburb.hospital_name,
        hospital_contact: suburb.hospital_contact,
        risk_type: suburb.risk_type,
        timeOfDay,
        _source: source,
        _module: 'rideshare',
      }
    };
    
    selectEntity(payload);
  }, [selectEntity]);

  return {
    selectSuburb,
    selectArea,
    selectWard,
    selectRideshareEntity,
  };
};

export default useLocationEntity;
