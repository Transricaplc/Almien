import { memo, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, SlidersHorizontal } from 'lucide-react';
import { areasData } from '@/data/emergencyContacts';
import 'leaflet/dist/leaflet.css';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade?: (trigger?: string) => void;
  onNavigate?: (view: ViewId) => void;
}

type FilterId = 'all' | 'crime' | 'gbv' | 'hijack' | 'fire' | 'saps' | 'hospital';

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'crime', label: 'CRIME' },
  { id: 'gbv', label: 'GBV' },
  { id: 'hijack', label: 'HIJACK' },
  { id: 'fire', label: 'FIRE' },
  { id: 'saps', label: 'SAPS' },
  { id: 'hospital', label: 'HOSPITAL' },
];

const CT_CENTER: [number, number] = [-33.9249, 18.4241];

/* ─── Tactical pin factory ─────────────── */
const tacticalPin = (color: string, size = 8) =>
  L.divIcon({
    className: 'tactical-pin',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      box-shadow:0 0 0 1px ${color}4D;
      outline:1px solid ${color}66;
      outline-offset:2px;
    "></div>`,
    iconSize: [size + 6, size + 6],
    iconAnchor: [(size + 6) / 2, (size + 6) / 2],
  });

const userPin = L.divIcon({
  className: 'tactical-pin-user',
  html: `<div style="position:relative;width:24px;height:24px;">
    <div style="position:absolute;inset:0;border-radius:50%;background:#00FF8533;animation:tactical-pulse 1.6s infinite;"></div>
    <div style="position:absolute;left:6px;top:6px;width:12px;height:12px;border-radius:50%;background:#00FF85;box-shadow:0 0 0 1.5px #000;"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

/* Sample tactical incidents (would come from hooks in production) */
const SAMPLE_PINS: { id: string; lat: number; lng: number; type: 'crime' | 'gbv' | 'saps' | 'hospital' | 'fire' | 'hijack' }[] = [
  { id: 'p1', lat: -33.9215, lng: 18.4239, type: 'crime' },
  { id: 'p2', lat: -33.9180, lng: 18.4250, type: 'crime' },
  { id: 'p3', lat: -33.9320, lng: 18.4530, type: 'gbv' },
  { id: 'p4', lat: -33.9290, lng: 18.4180, type: 'saps' },
  { id: 'p5', lat: -33.9170, lng: 18.4290, type: 'hospital' },
  { id: 'p6', lat: -33.9420, lng: 18.4070, type: 'fire' },
  { id: 'p7', lat: -33.9350, lng: 18.4400, type: 'hijack' },
  { id: 'p8', lat: -33.9120, lng: 18.4180, type: 'crime' },
  { id: 'p9', lat: -33.9270, lng: 18.4630, type: 'crime' },
  { id: 'p10', lat: -33.9450, lng: 18.4360, type: 'gbv' },
];

const PIN_COLORS: Record<string, string> = {
  crime: '#FF3B30',
  gbv: '#FF6B30',
  hijack: '#FF3B30',
  fire: '#FF9500',
  saps: '#00B4D8',
  hospital: '#00B4D8',
  safe: '#00FF85',
};

/* ─── Inner map wiring ─────────────────── */
const MapWiring = memo(({ onMove }: { onMove: (lat: number, lng: number) => void }) => {
  const map = useMap();
  useMapEvents({
    move: () => {
      const c = map.getCenter();
      onMove(c.lat, c.lng);
    },
  });
  return null;
});
MapWiring.displayName = 'MapWiring';

/* ─── Main view ────────────────────────── */
const TacticalMapView = memo(({ }: Props) => {
  const [filter, setFilter] = useState<FilterId>('all');
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: CT_CENTER[0], lng: CT_CENTER[1] });
  const [activeAlerts] = useState(3);
  const zoneScore = 84;

  const visiblePins = useMemo(() => {
    if (filter === 'all') return SAMPLE_PINS;
    return SAMPLE_PINS.filter((p) => p.type === filter);
  }, [filter]);

  const riskLabel = useMemo(() => {
    if (zoneScore >= 80) return { text: 'RISK: LOW', cls: 'sig-badge safe' };
    if (zoneScore >= 60) return { text: 'RISK: MOD', cls: 'sig-badge warn' };
    return { text: 'RISK: HIGH', cls: 'sig-badge threat' };
  }, [zoneScore]);

  // inject pulse keyframe once
  useEffect(() => {
    const id = 'tactical-pulse-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `@keyframes tactical-pulse{0%{transform:scale(1);opacity:.6}70%{transform:scale(2);opacity:0}100%{transform:scale(2);opacity:0}}`;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black">
      {/* FULL-BLEED MAP */}
      <MapContainer
        center={CT_CENTER}
        zoom={13}
        zoomControl={false}
        attributionControl={false}
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
          subdomains={['a', 'b', 'c', 'd']}
        />
        <MapWiring onMove={(lat, lng) => setCoords({ lat, lng })} />

        {/* User location */}
        <Marker position={CT_CENTER} icon={userPin} />

        {/* Threat pins */}
        {visiblePins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={tacticalPin(PIN_COLORS[pin.type] || '#fff', 8)}
          />
        ))}
      </MapContainer>

      {/* ── TOP HUD STRIP ─────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-10 px-4 pb-3"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 12px)',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          minHeight: 80,
        }}
      >
        <div className="flex items-start justify-between pt-2">
          <div className="mono text-[10px] text-text-muted leading-tight">
            {coords.lat.toFixed(4)}° {coords.lat < 0 ? 'S' : 'N'}
            <br />
            {Math.abs(coords.lng).toFixed(4)}° {coords.lng < 0 ? 'W' : 'E'}
          </div>

          <div className="label-micro" style={{ color: '#2A2A2A' }}>ALMIEN</div>

          <div className={riskLabel.cls}>{riskLabel.text}</div>
        </div>
      </div>

      {/* ── SEARCH PILL ───────────────────── */}
      <div className="absolute left-4 right-4 z-10" style={{ top: 'calc(max(env(safe-area-inset-top), 12px) + 56px)' }}>
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: 'rgba(0,0,0,0.85)',
            border: '0.5px solid #2A2A2A',
          }}
        >
          <Search className="w-[18px] h-[18px] text-text-muted shrink-0" strokeWidth={1.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search area, ward, street..."
            className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-[#333]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          <SlidersHorizontal className="w-[18px] h-[18px] text-text-muted shrink-0" strokeWidth={1.5} />
        </div>
      </div>

      {/* ── FILTER TABS ───────────────────── */}
      <div
        className="absolute left-4 right-4 z-10"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 224px)' }}
      >
        <div
          className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto"
          style={{
            background: 'rgba(0,0,0,0.75)',
            border: '0.5px solid #2A2A2A',
            scrollbarWidth: 'none',
          }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="shrink-0 px-3 py-1.5 text-xs whitespace-nowrap transition-colors"
                style={{
                  background: active ? '#00FF85' : 'transparent',
                  color: active ? '#000' : '#A0A0A0',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: active ? 600 : 500,
                  letterSpacing: '0.05em',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM STATS STRIP ────────────── */}
      <div
        className="absolute left-0 right-0 z-10"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + 136px)',
          background: 'rgba(0,0,0,0.92)',
          borderTop: '1px solid #1A1A1A',
        }}
      >
        <div className="grid grid-cols-3 px-5 py-3">
          {[
            { value: String(activeAlerts), label: 'ACTIVE ALERTS' },
            { value: String(zoneScore), label: 'ZONE SCORE' },
            { value: '12m', label: 'LAST INCIDENT' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center"
              style={{
                borderRight: i < 2 ? '0.5px solid #1F1F1F' : 'none',
              }}
            >
              <div
                className="text-white tabular-nums"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {s.value}
              </div>
              <div
                className="mt-0.5"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 10,
                  color: '#555',
                  letterSpacing: '0.08em',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

TacticalMapView.displayName = 'TacticalMapView';
export default TacticalMapView;
