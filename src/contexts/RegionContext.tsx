import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Region {
  id: string;
  name: string;
  province: string;
  coordinates: { lat: number; lng: number };
  enabled: boolean;
}

const defaultRegions: Region[] = [
  { id: 'cape-town', name: 'Cape Town', province: 'Western Cape', coordinates: { lat: -33.9249, lng: 18.4241 }, enabled: true },
  { id: 'johannesburg', name: 'Johannesburg', province: 'Gauteng', coordinates: { lat: -26.2041, lng: 28.0473 }, enabled: true },
  { id: 'durban', name: 'Durban', province: 'KwaZulu-Natal', coordinates: { lat: -29.8587, lng: 31.0218 }, enabled: true },
  { id: 'pretoria', name: 'Pretoria', province: 'Gauteng', coordinates: { lat: -25.7479, lng: 28.2293 }, enabled: false },
  { id: 'port-elizabeth', name: 'Gqeberha', province: 'Eastern Cape', coordinates: { lat: -33.9608, lng: 25.6022 }, enabled: false },
];

interface RegionContextValue {
  regions: Region[];
  activeRegion: Region;
  isNationalView: boolean;
  setActiveRegion: (id: string) => void;
  toggleNationalView: () => void;
}

const RegionContext = createContext<RegionContextValue | undefined>(undefined);

export const useRegion = () => {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error('useRegion must be used within RegionProvider');
  return ctx;
};

export const RegionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRegionId, setActiveRegionId] = useState('cape-town');
  const [isNationalView, setIsNationalView] = useState(false);

  const activeRegion = defaultRegions.find(r => r.id === activeRegionId) || defaultRegions[0];

  const setActiveRegion = useCallback((id: string) => {
    setActiveRegionId(id);
    setIsNationalView(false);
  }, []);

  const toggleNationalView = useCallback(() => {
    setIsNationalView(prev => !prev);
  }, []);

  return (
    <RegionContext.Provider value={{ regions: defaultRegions, activeRegion, isNationalView, setActiveRegion, toggleNationalView }}>
      {children}
    </RegionContext.Provider>
  );
};
