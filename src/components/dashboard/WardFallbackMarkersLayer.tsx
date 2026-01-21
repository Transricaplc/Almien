import { useMemo, useState } from 'react';
import { Marker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { wardData } from '@/data/mapData';
import { useWardCentroids } from '@/hooks/useWardCentroids';

interface WardFallbackMarkersLayerProps {
  visible?: boolean;
  minZoom?: number;
  onWardClick?: (wardNumber: number) => void;
  highlightedWards?: Set<number>;
  comparisonMode?: boolean;
}

const COMPARISON_COLORS = [
  { fill: '#3b82f6', border: '#60a5fa' },
  { fill: '#10b981', border: '#34d399' },
  { fill: '#f59e0b', border: '#fbbf24' },
  { fill: '#8b5cf6', border: '#a78bfa' },
  { fill: '#ef4444', border: '#f87171' },
  { fill: '#ec4899', border: '#f472b6' },
];

const getWardStatsByNumber = (wardNumber: number) => {
  return wardData.find((w) => {
    const match = w.id.match(/\d+/);
    const num = match ? parseInt(match[0], 10) : 0;
    return num === wardNumber;
  });
};

export default function WardFallbackMarkersLayer({
  visible = true,
  minZoom = 11,
  onWardClick,
  highlightedWards,
  comparisonMode = false,
}: WardFallbackMarkersLayerProps) {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());
  const { centroids } = useWardCentroids();

  useMapEvents({
    zoomend: () => setCurrentZoom(map.getZoom()),
  });

  const wardColorMap = useMemo(() => {
    const colorMap = new Map<number, typeof COMPARISON_COLORS[0]>();
    if (highlightedWards) {
      const sorted = Array.from(highlightedWards).sort((a, b) => a - b);
      sorted.forEach((w, idx) => colorMap.set(w, COMPARISON_COLORS[idx % COMPARISON_COLORS.length]));
    }
    return colorMap;
  }, [highlightedWards]);

  const markers = useMemo(() => {
    return centroids
      .filter((c) => !c.hasBoundary && !!c.center)
      .map((c) => ({ wardNumber: c.wardNumber, center: c.center! }));
  }, [centroids]);

  if (!visible || currentZoom < minZoom) return null;

  return (
    <>
      {markers.map(({ wardNumber, center }) => {
        const isHighlighted = comparisonMode && highlightedWards?.has(wardNumber);
        const wardColor = wardColorMap.get(wardNumber);

        const fill = isHighlighted && wardColor ? wardColor.fill : '#64748b';
        const border = isHighlighted && wardColor ? wardColor.border : '#94a3b8';

        const icon = L.divIcon({
          className: 'ward-fallback-marker',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          html: `
            <div style="
              width: 18px;
              height: 18px;
              border-radius: 9999px;
              border: 2px solid ${border};
              background: ${fill};
              opacity: 0.95;
              box-shadow: 0 0 10px ${fill}55;
            "></div>
          `,
        });

        const stats = getWardStatsByNumber(wardNumber);
        const label = stats?.name ?? `Ward ${wardNumber}`;

        return (
          <Marker
            key={`ward-fallback-${wardNumber}`}
            position={[center.lat, center.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onWardClick?.(wardNumber),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 700 }}>{label}</div>
                {stats ? (
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                    <div>Safety: {stats.safetyScore} • CCTV: {stats.cctvCount}</div>
                    <div>Population: {stats.population.toLocaleString()}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                    No ward stats loaded.
                  </div>
                )}
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                  Boundary polygon missing — showing centroid.
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
