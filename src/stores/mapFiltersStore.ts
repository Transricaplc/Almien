/**
 * Map filter store — Phase B
 *
 * Global, lightweight filter state shared by the search overlay,
 * sidebar filters, and any map layer that wants to honour them.
 * Layers read this store and decide what to render — store has zero
 * knowledge of map internals.
 */

import { create } from 'zustand';

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
export type SeverityLevel = 'all' | 'low' | 'medium' | 'high' | 'critical';
export type DataType = 'all' | 'incident' | 'infrastructure' | 'utility' | 'community';

interface MapFiltersState {
  query: string;
  timeRange: TimeRange;
  severity: SeverityLevel;
  dataType: DataType;
  setQuery: (q: string) => void;
  setTimeRange: (t: TimeRange) => void;
  setSeverity: (s: SeverityLevel) => void;
  setDataType: (d: DataType) => void;
  reset: () => void;
}

export const useMapFilters = create<MapFiltersState>((set) => ({
  query: '',
  timeRange: '24h',
  severity: 'all',
  dataType: 'all',
  setQuery: (query) => set({ query }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setSeverity: (severity) => set({ severity }),
  setDataType: (dataType) => set({ dataType }),
  reset: () => set({ query: '', timeRange: '24h', severity: 'all', dataType: 'all' }),
}));
