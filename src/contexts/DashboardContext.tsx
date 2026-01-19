import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// =============================================
// TYPES
// =============================================

// All supported entity types for the ontology - includes location and fixed asset types
export type EntityType = 
  // Location entities
  | 'suburb' | 'ward' | 'area' | 'street' | 'rideshare'
  // Fixed asset entities (with address support)
  | 'cctv' | 'traffic_signal' | 'hospital' | 'police_station' | 'fire_station'
  | 'taxi_rank' | 'bus_stop' | 'clinic'
  // Event/status entities
  | 'incident' | 'alert' | 'infrastructure'
  | null;
export type TimeFilter = 'live' | '24h' | '7d' | '30d';

export interface SelectedEntity {
  id: string;
  type: EntityType;
  name: string;
  coordinates?: { lat: number; lng: number };
  data?: Record<string, unknown>;
}

export interface MapFilter {
  cctv: boolean;
  traffic: boolean;
  incidents: boolean;
  infrastructure: boolean;
  riskZones: boolean;
  cycling: boolean;
  hiking: boolean;
  pedestrian: boolean;
}

export interface DashboardState {
  // Selection State
  selectedEntity: SelectedEntity | null;
  hoveredEntity: SelectedEntity | null;
  
  // Filter State
  mapFilters: MapFilter;
  timeFilter: TimeFilter;
  searchQuery: string;
  
  // Panel State
  contextPanelOpen: boolean;
  detailPanelOpen: boolean;
  
  // View State
  isTravelerMode: boolean;
  mobilityTrayExpanded: boolean;
}

interface DashboardContextValue extends DashboardState {
  // Selection Actions
  selectEntity: (entity: SelectedEntity | null) => void;
  hoverEntity: (entity: SelectedEntity | null) => void;
  clearSelection: () => void;
  
  // Filter Actions
  toggleMapFilter: (filter: keyof MapFilter) => void;
  setTimeFilter: (filter: TimeFilter) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  
  // Panel Actions
  openContextPanel: () => void;
  closeContextPanel: () => void;
  toggleDetailPanel: () => void;
  
  // View Actions
  setTravelerMode: (enabled: boolean) => void;
  setMobilityTrayExpanded: (expanded: boolean) => void;
}

// =============================================
// DEFAULT STATE
// =============================================

const defaultMapFilters: MapFilter = {
  cctv: true,
  traffic: true,
  incidents: true,
  infrastructure: true,
  riskZones: true,
  cycling: true,
  hiking: true,
  pedestrian: true,
};

const defaultState: DashboardState = {
  selectedEntity: null,
  hoveredEntity: null,
  mapFilters: defaultMapFilters,
  timeFilter: 'live',
  searchQuery: '',
  contextPanelOpen: false,
  detailPanelOpen: false,
  isTravelerMode: false,
  mobilityTrayExpanded: false,
};

// =============================================
// CONTEXT
// =============================================

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const useDashboard = (): DashboardContextValue => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// =============================================
// PROVIDER
// =============================================

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [state, setState] = useState<DashboardState>(defaultState);

  // Selection Actions
  const selectEntity = useCallback((entity: SelectedEntity | null) => {
    setState(prev => ({
      ...prev,
      selectedEntity: entity,
      contextPanelOpen: entity !== null,
    }));
  }, []);

  const hoverEntity = useCallback((entity: SelectedEntity | null) => {
    setState(prev => ({ ...prev, hoveredEntity: entity }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedEntity: null,
      contextPanelOpen: false,
    }));
  }, []);

  // Filter Actions
  const toggleMapFilter = useCallback((filter: keyof MapFilter) => {
    setState(prev => ({
      ...prev,
      mapFilters: {
        ...prev.mapFilters,
        [filter]: !prev.mapFilters[filter],
      },
    }));
  }, []);

  const setTimeFilter = useCallback((filter: TimeFilter) => {
    setState(prev => ({ ...prev, timeFilter: filter }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      mapFilters: defaultMapFilters,
      timeFilter: 'live',
      searchQuery: '',
    }));
  }, []);

  // Panel Actions
  const openContextPanel = useCallback(() => {
    setState(prev => ({ ...prev, contextPanelOpen: true }));
  }, []);

  const closeContextPanel = useCallback(() => {
    setState(prev => ({ ...prev, contextPanelOpen: false }));
  }, []);

  const toggleDetailPanel = useCallback(() => {
    setState(prev => ({ ...prev, detailPanelOpen: !prev.detailPanelOpen }));
  }, []);

  // View Actions
  const setTravelerMode = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, isTravelerMode: enabled }));
  }, []);

  const setMobilityTrayExpanded = useCallback((expanded: boolean) => {
    setState(prev => ({ ...prev, mobilityTrayExpanded: expanded }));
  }, []);

  const value: DashboardContextValue = {
    ...state,
    selectEntity,
    hoverEntity,
    clearSelection,
    toggleMapFilter,
    setTimeFilter,
    setSearchQuery,
    resetFilters,
    openContextPanel,
    closeContextPanel,
    toggleDetailPanel,
    setTravelerMode,
    setMobilityTrayExpanded,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
