import React, { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface WildfireViewerState {
  enabled: boolean;
  showHotspots: boolean;
  showPerimeters: boolean;
  showHeat: boolean;
}

interface WildfireContextValue extends WildfireViewerState {
  setEnabled: (enabled: boolean) => void;
  setShowHotspots: (show: boolean) => void;
  setShowPerimeters: (show: boolean) => void;
  setShowHeat: (show: boolean) => void;
  setAll: (next: Partial<WildfireViewerState>) => void;
}

const WildfireContext = createContext<WildfireContextValue | undefined>(undefined);

export function useWildfireViewer(): WildfireContextValue {
  const ctx = useContext(WildfireContext);
  if (!ctx) throw new Error("useWildfireViewer must be used within a WildfireProvider");
  return ctx;
}

export function WildfireProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showPerimeters, setShowPerimeters] = useState(true);
  const [showHeat, setShowHeat] = useState(false);

  const value = useMemo<WildfireContextValue>(
    () => ({
      enabled,
      showHotspots,
      showPerimeters,
      showHeat,
      setEnabled,
      setShowHotspots,
      setShowPerimeters,
      setShowHeat,
      setAll: (next) => {
        if (typeof next.enabled === "boolean") setEnabled(next.enabled);
        if (typeof next.showHotspots === "boolean") setShowHotspots(next.showHotspots);
        if (typeof next.showPerimeters === "boolean") setShowPerimeters(next.showPerimeters);
        if (typeof next.showHeat === "boolean") setShowHeat(next.showHeat);
      },
    }),
    [enabled, showHotspots, showPerimeters, showHeat]
  );

  return <WildfireContext.Provider value={value}>{children}</WildfireContext.Provider>;
}
