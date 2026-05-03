import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import SuburbSearchInput from '@/components/dashboard/SuburbSearchInput';
import type { UnifiedSuburbResult } from '@/utils/suburbSearch';

interface Props {
  /** Optional callback after a result is selected (in addition to flying the map). */
  onSelect?: (result: UnifiedSuburbResult) => void;
  className?: string;
}

/**
 * Floating tactical search overlay anchored to the top of the map canvas.
 * Lives INSIDE <MapContainer> so it has access to `useMap()` for fly-to.
 *
 * Obsidian Tactical: signal-green focus, JetBrains Mono micro-label,
 * true-black surface, sharp corners.
 */
const MapSearchOverlay = ({ onSelect, className }: Props) => {
  const map = useMap();

  // Stop Leaflet from hijacking pointer/scroll events on the overlay
  useEffect(() => {
    const el = document.querySelector<HTMLDivElement>('[data-map-search-overlay]');
    if (!el) return;
    const L = (window as any).L;
    if (L?.DomEvent) {
      L.DomEvent.disableClickPropagation(el);
      L.DomEvent.disableScrollPropagation(el);
    }
  }, []);

  const handleSelect = (r: UnifiedSuburbResult) => {
    if (r.coordinates) {
      map.flyTo([r.coordinates.lat, r.coordinates.lng], 14, { duration: 0.8 });
    }
    onSelect?.(r);
  };

  return (
    <div
      data-map-search-overlay
      className={
        'absolute top-3 left-1/2 -translate-x-1/2 z-[1000] w-[min(420px,calc(100%-96px))] ' +
        (className ?? '')
      }
      role="search"
    >
      <div className="bg-black/85 backdrop-blur border border-[#1A1A1A] hover:border-[#00FF85]/40 focus-within:border-[#00FF85]/60 transition-colors">
        <div className="flex items-center justify-between px-2 pt-1.5">
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#00FF85]/80">
            SEARCH_AREA
          </span>
          <span className="font-mono text-[8px] tracking-[0.2em] text-[#555]">
            SUBURB · WARD · COORDS
          </span>
        </div>
        <SuburbSearchInput
          onSelect={handleSelect}
          placeholder="Type suburb, ward number, or coordinates…"
          className="px-1 pb-1"
        />
      </div>
    </div>
  );
};

export default MapSearchOverlay;
