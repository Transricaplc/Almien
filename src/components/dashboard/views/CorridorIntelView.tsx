import { memo, useCallback, useMemo, useState } from 'react';
import { MapPin, Target, ArrowUpRight, Share2, ChevronRight } from 'lucide-react';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade?: (trigger?: string) => void;
  onNavigate?: (view: ViewId) => void;
}

type Risk = 'safe' | 'caution' | 'threat';
interface Segment { risk: Risk; weight: number }
interface Corridor {
  id: string;
  name: string;
  path: string;
  etaMin: number;
  riskBand: Risk;
  segments: Segment[];
  distanceKm: number;
  incidents: number;
  lighting: string;
  trustScore: number;
}
interface DarkZone {
  id: string;
  location: string;
  distanceM: number;
  incidentType: string;
  lastReported: string;
}

const RISK_COLOR: Record<Risk, string> = {
  safe: '#00FF85',
  caution: '#FF9500',
  threat: '#FF3B30',
};
const RISK_LABEL: Record<Risk, string> = {
  safe: 'CLEAR',
  caution: 'CAUTION',
  threat: 'AVOID',
};

const MOCK_CORRIDORS: Corridor[] = [
  {
    id: 'r1',
    name: 'Long Street Corridor',
    path: 'CBD → Gardens via Long St',
    etaMin: 18,
    riskBand: 'caution',
    segments: [
      { risk: 'safe', weight: 30 },
      { risk: 'caution', weight: 40 },
      { risk: 'safe', weight: 20 },
      { risk: 'threat', weight: 10 },
    ],
    distanceKm: 2.4,
    incidents: 3,
    lighting: 'GOOD',
    trustScore: 78,
  },
  {
    id: 'r2',
    name: 'Sea Point Promenade',
    path: 'Sea Point → V&A Waterfront',
    etaMin: 24,
    riskBand: 'safe',
    segments: [
      { risk: 'safe', weight: 60 },
      { risk: 'safe', weight: 30 },
      { risk: 'caution', weight: 10 },
    ],
    distanceKm: 3.1,
    incidents: 0,
    lighting: 'EXCELLENT',
    trustScore: 92,
  },
  {
    id: 'r3',
    name: 'Main Road Express',
    path: 'Woodstock → Observatory',
    etaMin: 12,
    riskBand: 'threat',
    segments: [
      { risk: 'threat', weight: 35 },
      { risk: 'caution', weight: 25 },
      { risk: 'threat', weight: 25 },
      { risk: 'caution', weight: 15 },
    ],
    distanceKm: 1.8,
    incidents: 7,
    lighting: 'POOR',
    trustScore: 41,
  },
];

const MOCK_DARK_ZONES: DarkZone[] = [
  { id: 'd1', location: 'Strand Street Underpass', distanceM: 320, incidentType: 'Robbery', lastReported: '14m ago' },
  { id: 'd2', location: 'Adderley Lower Bridge', distanceM: 580, incidentType: 'Mugging', lastReported: '1h ago' },
  { id: 'd3', location: 'Castle Square Lane', distanceM: 740, incidentType: 'Assault', lastReported: '3h ago' },
];

/* ─── Toggle ─────────────────────────────── */
const TacticalToggle = memo(({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="relative shrink-0 transition-colors"
    style={{
      width: 32,
      height: 18,
      background: active ? '#00FF85' : '#1A1A1A',
      border: '0.5px solid #2A2A2A',
    }}
    aria-pressed={active}
    aria-label="Toggle Commute Shield"
  >
    <span
      className="absolute top-[1px] transition-all"
      style={{
        left: active ? 16 : 1,
        width: 14,
        height: 14,
        background: active ? '#000' : '#555',
      }}
    />
  </button>
));
TacticalToggle.displayName = 'TacticalToggle';

/* ─── Risk gradient bar ─────────────────── */
const RiskBar = memo(({ segments }: { segments: Segment[] }) => {
  const total = segments.reduce((sum, s) => sum + s.weight, 0);
  return (
    <div className="flex w-full" style={{ height: 6 }}>
      {segments.map((seg, i) => (
        <div
          key={i}
          style={{
            flex: `${(seg.weight / total) * 100} 0 0`,
            background: RISK_COLOR[seg.risk],
          }}
        />
      ))}
    </div>
  );
});
RiskBar.displayName = 'RiskBar';

/* ─── Corridor card ─────────────────────── */
const CorridorCard = memo(({ route }: { route: Corridor }) => {
  const riskColor = RISK_COLOR[route.riskBand];
  return (
    <div className="mx-5 mb-3 transition-transform duration-100 active:scale-[0.99]"
      style={{ background: '#0A0A0A', border: '0.5px solid #1F1F1F' }}>
      {/* TOP ROW */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="min-w-0 flex-1 pr-3">
          <h3 className="text-white truncate"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600 }}>
            {route.name}
          </h3>
          <p className="text-[#555] truncate mt-0.5"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, maxWidth: 200 }}>
            {route.path}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13, fontWeight: 600, color: riskColor, letterSpacing: '0.02em',
          }}>
            ~{route.etaMin} MIN
          </div>
          <div className="mt-0.5"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9, color: riskColor, letterSpacing: '0.1em',
            }}>
            {RISK_LABEL[route.riskBand]}
          </div>
        </div>
      </div>

      {/* RISK GRADIENT BAR */}
      <RiskBar segments={route.segments} />

      {/* STATS ROW */}
      <div className="grid grid-cols-4 gap-2 px-4 py-3" style={{ borderTop: '1px solid #111' }}>
        {[
          { v: `${route.distanceKm}KM`, l: 'DISTANCE' },
          { v: String(route.incidents), l: 'INCIDENTS' },
          { v: route.lighting, l: 'LIGHTING' },
          { v: `${route.trustScore}`, l: 'TRUST' },
        ].map((s) => (
          <div key={s.l} className="flex flex-col items-center">
            <div className="text-white tabular-nums truncate max-w-full"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600 }}>
              {s.v}
            </div>
            <div className="mt-0.5"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#555', letterSpacing: '0.08em' }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* ACTION ROW */}
      <div className="flex items-center justify-between px-4 pb-3"
        style={{ borderTop: '1px solid #111', paddingTop: 10 }}>
        <button className="btn-ghost flex items-center gap-1" style={{ color: '#00FF85', padding: '8px 0' }}>
          NAVIGATE <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
        </button>
        <button className="btn-ghost flex items-center gap-1" style={{ color: '#555', padding: '8px 0' }}>
          <Share2 className="w-3 h-3" strokeWidth={2} /> SHARE ROUTE
        </button>
      </div>
    </div>
  );
});
CorridorCard.displayName = 'CorridorCard';

/* ─── Dark zone row ─────────────────────── */
const DarkZoneRow = memo(({ zone }: { zone: DarkZone }) => (
  <div className="t-card threat mx-5 transition-transform duration-100 active:scale-[0.99]"
    style={{ marginBottom: 1, borderLeftColor: '#FF3B30' }}>
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1 pr-3">
        <div className="text-white truncate"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500 }}>
          {zone.location}
        </div>
        <div className="text-[#555] truncate mt-0.5"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}>
          {zone.incidentType} · {zone.lastReported}
        </div>
      </div>
      <div className="shrink-0 tabular-nums"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#FF3B30' }}>
        {zone.distanceM}m
      </div>
    </div>
  </div>
));
DarkZoneRow.displayName = 'DarkZoneRow';

/* ─── Main view ─────────────────────────── */
const CorridorIntelView = memo(({ }: Props) => {
  const [shieldActive, setShieldActive] = useState(true);
  const [origin, setOrigin] = useState('Current location');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<Corridor[]>(MOCK_CORRIDORS);
  const [scanning, setScanning] = useState(false);

  const handleScan = useCallback(() => {
    if (!destination.trim()) return;
    setScanning(true);
    setTimeout(() => {
      setRoutes(MOCK_CORRIDORS);
      setScanning(false);
    }, 600);
  }, [destination]);

  const routeCount = useMemo(() => routes.length, [routes]);

  return (
    <div className="page-animate min-h-dvh bg-black" style={{ paddingBottom: 136 }}>
      {/* ── HEADER ─────────────────────────── */}
      <div
        className="sticky top-0 z-20 px-5 pb-3 bg-black"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          borderBottom: '1px solid #1A1A1A',
          ...(shieldActive ? { borderTop: '1px solid #00FF85' } : {}),
        }}
      >
        <h1 className="text-white"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>
          CORRIDORS
        </h1>
        <p className="text-[#555] mt-0.5"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}>
          Safe routes · Commute Shield · Dark Zones
        </p>

        {/* Commute Shield */}
        <div className="mt-3 flex items-center justify-between">
          <span className="label-micro">COMMUTE SHIELD</span>
          <TacticalToggle active={shieldActive} onToggle={() => setShieldActive((v) => !v)} />
        </div>
      </div>

      {/* ── ROUTE INPUTS ──────────────────── */}
      <div className="mx-5 mt-4 relative">
        {/* Vertical connector */}
        <div className="absolute left-[18px] top-[28px] bottom-[28px] w-px"
          style={{ background: '#1A1A1A', zIndex: 0 }} />
        <div className="absolute left-[14px] top-[42px] w-[10px] h-[10px]"
          style={{ background: '#0A0A0A', border: '1px solid #2A2A2A', zIndex: 1 }} />

        {/* FROM */}
        <div className="relative flex items-center gap-3 mb-[1px]"
          style={{ background: '#0A0A0A', border: '0.5px solid #2A2A2A', borderBottom: '1px solid #555', padding: '14px 16px' }}>
          <MapPin className="w-[18px] h-[18px] text-[#00FF85] shrink-0" strokeWidth={1.5} />
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="From"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-[#333]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </div>

        {/* TO */}
        <div className="relative flex items-center gap-3"
          style={{ background: '#0A0A0A', border: '0.5px solid #2A2A2A', borderBottom: '1px solid #555', padding: '14px 16px' }}>
          <Target className="w-[18px] h-[18px] text-[#FF3B30] shrink-0" strokeWidth={1.5} />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-[#333]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </div>

        <button
          onClick={handleScan}
          disabled={scanning}
          className="btn-primary mt-3 flex items-center justify-center gap-2"
        >
          {scanning ? 'SCANNING...' : <>SCAN ROUTE <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} /></>}
        </button>
      </div>

      {/* ── SCANNED CORRIDORS ─────────────── */}
      <div className="mt-5">
        <div className="px-5 mb-3 flex items-center justify-between">
          <span className="label-micro">SCANNED CORRIDORS</span>
          <span className="tabular-nums"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#555' }}>
            {String(routeCount).padStart(2, '0')} ROUTES
          </span>
        </div>
        {routes.map((r) => (
          <CorridorCard key={r.id} route={r} />
        ))}
      </div>

      {/* ── DARK ZONES ────────────────────── */}
      <div className="mt-5 mb-6">
        <div className="px-5 mb-3 flex items-center justify-between">
          <span className="label-micro">DARK ZONES NEARBY</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#555]" />
        </div>
        {MOCK_DARK_ZONES.map((z) => (
          <DarkZoneRow key={z.id} zone={z} />
        ))}
      </div>
    </div>
  );
});

CorridorIntelView.displayName = 'CorridorIntelView';
export default CorridorIntelView;
