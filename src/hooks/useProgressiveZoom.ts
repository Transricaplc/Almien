import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Progressive Zoom Hook
 * Manages zoom-based visibility for different map layers
 * 
 * Zoom Levels:
 * - City (8-10): Heatmaps and aggregate safety scores
 * - Ward (11-13): Crime score bands, emergency coverage, safe-zone density
 * - Suburb/Area (14+): Tappable polygons, pins for emergency info
 */

export type ZoomLevel = 'city' | 'ward' | 'suburb';

interface ProgressiveZoomConfig {
  cityZoomRange: [number, number];
  wardZoomRange: [number, number];
  suburbZoomRange: [number, number];
}

const DEFAULT_CONFIG: ProgressiveZoomConfig = {
  cityZoomRange: [8, 10],
  wardZoomRange: [11, 13],
  suburbZoomRange: [14, 20],
};

interface UseProgressiveZoomResult {
  currentZoom: number;
  zoomLevel: ZoomLevel;
  setZoom: (zoom: number) => void;
  
  // Layer visibility based on zoom
  showHeatmaps: boolean;
  showAggregateScores: boolean;
  showWardBoundaries: boolean;
  showCrimeScoreBands: boolean;
  showEmergencyCoverage: boolean;
  showSafeZoneDensity: boolean;
  showSuburbPolygons: boolean;
  showEmergencyPins: boolean;
  showDetailedMarkers: boolean;
  
  // Helper functions
  shouldShowLayer: (layerType: string) => boolean;
  getMarkerSize: () => 'small' | 'medium' | 'large';
  getLabelVisibility: () => boolean;
}

export const useProgressiveZoom = (
  initialZoom: number = 12,
  config: ProgressiveZoomConfig = DEFAULT_CONFIG
): UseProgressiveZoomResult => {
  const [currentZoom, setCurrentZoom] = useState(initialZoom);

  // Determine current zoom level category
  const zoomLevel = useMemo((): ZoomLevel => {
    if (currentZoom >= config.suburbZoomRange[0]) return 'suburb';
    if (currentZoom >= config.wardZoomRange[0]) return 'ward';
    return 'city';
  }, [currentZoom, config]);

  // Layer visibility based on zoom level
  const layerVisibility = useMemo(() => {
    const isCity = zoomLevel === 'city';
    const isWard = zoomLevel === 'ward';
    const isSuburb = zoomLevel === 'suburb';

    return {
      // City level (8-10): Overview
      showHeatmaps: isCity || isWard,
      showAggregateScores: isCity,
      
      // Ward level (11-13): Mid-detail
      showWardBoundaries: isWard || isSuburb,
      showCrimeScoreBands: isWard || isSuburb,
      showEmergencyCoverage: isWard || isSuburb,
      showSafeZoneDensity: isWard,
      
      // Suburb level (14+): Full detail
      showSuburbPolygons: isSuburb,
      showEmergencyPins: isSuburb,
      showDetailedMarkers: isSuburb,
    };
  }, [zoomLevel]);

  // Helper: Should show specific layer type
  const shouldShowLayer = useCallback((layerType: string): boolean => {
    switch (layerType) {
      case 'heatmap':
      case 'crimeHeatmap':
        return layerVisibility.showHeatmaps;
      
      case 'wardBoundaries':
      case 'wards':
        return layerVisibility.showWardBoundaries;
      
      case 'safeZones':
      case 'emergencyPins':
        return zoomLevel === 'suburb' || zoomLevel === 'ward';
      
      case 'cctv':
      case 'traffic':
      case 'markers':
        return zoomLevel === 'suburb';
      
      case 'citizenReports':
      case 'reports':
        return zoomLevel === 'ward' || zoomLevel === 'suburb';
      
      default:
        return true;
    }
  }, [zoomLevel, layerVisibility]);

  // Helper: Get appropriate marker size based on zoom
  const getMarkerSize = useCallback((): 'small' | 'medium' | 'large' => {
    if (zoomLevel === 'city') return 'small';
    if (zoomLevel === 'ward') return 'medium';
    return 'large';
  }, [zoomLevel]);

  // Helper: Whether to show text labels
  const getLabelVisibility = useCallback((): boolean => {
    return zoomLevel === 'suburb';
  }, [zoomLevel]);

  const setZoom = useCallback((zoom: number) => {
    setCurrentZoom(Math.max(8, Math.min(20, zoom)));
  }, []);

  return {
    currentZoom,
    zoomLevel,
    setZoom,
    ...layerVisibility,
    shouldShowLayer,
    getMarkerSize,
    getLabelVisibility,
  };
};

export default useProgressiveZoom;
