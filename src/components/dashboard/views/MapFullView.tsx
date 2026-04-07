import { memo, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Search, MapPin, Layers, Locate, Plus, Minus, Map, Clock, X, Shield, Flame, Phone, AlertTriangle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { ViewId } from '../GridifyDashboard';
import ZoneBottomSheet, { type ZoneData } from '../widgets/ZoneBottomSheet';
import { getHourlyRisk, getRiskAtSlot, getCurrentSlotIndex, getMapInsightText } from '@/data/timeAnalyticsData';
import { areasData, type AreaData } from '@/data/emergencyContacts';
import { getSafetyColor } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const crimeTypes = [
  { id: 'all', label: 'All' },
  { id: 'theft', label: 'Theft' },
  { id: 'robbery', label: 'Robbery' },
  { id: 'assault', label: 'Assault' },
  { id: 'gbv', label: 'GBV' },
  { id: 'drugs', label: 'Drugs' },
  { id: 'hijacking', label: 'Hijacking' },
];

const presets = [
  { label: 'Now', slot: -1 },
  { label: 'Morning Rush', slot: 14 },
  { label: 'Evening Risk', slot: 34 },
];

const mockZones: ZoneData[] = [
  {
    id: 'z1', name: 'Sea Point', precinct: 'Atlantic Seaboard',
    riskLevel: 'elevated',
    topCrimes: [
      { type: 'Theft', icon: '🔵', count: 34 },
      { type: 'Robbery', icon: '🔴', count: 18 },
      { type: 'Vehicle Crime', icon: '🟠', count: 12 },
    ],
    peakWindow: '17:00–21:00',
  },
  {
    id: 'z2', name: 'Cape Town CBD', precinct: 'City Centre',
    riskLevel: 'high',
    topCrimes: [
      { type: 'Robbery', icon: '🔴', count: 52 },
      { type: 'Theft', icon: '🔵', count: 41 },
      { type: 'Assault', icon: '🟡', count: 28 },
    ],
    peakWindow: '18:00–22:00',
  },
  {
    id: 'z3', name: 'Camps Bay', precinct: 'Atlantic Seaboard',
    riskLevel: 'low',
    topCrimes: [
      { type: 'Theft', icon: '🔵', count: 8 },
      { type: 'Vehicle Crime', icon: '🟠', count: 4 },
      { type: 'Property', icon: '⚫', count: 3 },
    ],
    peakWindow: '20:00–23:00',
  },
];

const zoneRiskFill: Record<string, string> = {
  low: 'bg-safety-green/10 border-safety-green/30',
  elevated: 'bg-safety-yellow/10 border-safety-yellow/30',
  high: 'bg-safety-orange/10 border-safety-orange/30',
  critical: 'bg-safety-red/20 border-safety-red/40',
};

function scoreColor(s: number) {
  if (s >= 7) return 'text-safety-green';
  if (s >= 5) return 'text-safety-yellow';
  return 'text-safety-red';
}

/* ═══════════════════════════════════════════
   SOS BUTTONS — prominent emergency dialler
   ═══════════════════════════════════════════ */
const sosButtons = [
  { label: 'SAPS', number: '10111', display: '10111', color: 'bg-blue-600', icon: Shield },
  { label: 'FIRE', number: '0214807700', display: '021 480 7700', color: 'bg-red-600', icon: Flame },
  { label: 'AMBULANCE', number: '10177', display: '10177', color: 'bg-emerald-600', icon: Phone },
] as const;

const MapSOSDock = memo(() => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "absolute z-30 left-1/2 -translate-x-1/2 pointer-events-auto",
        "bottom-[270px] md:bottom-[240px]"
      )}
    >
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-2xl",
        "bg-gradient-to-r from-red-600/95 via-orange-600/95 to-red-600/95",
        "backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(239,68,68,0.4)]",
        "animate-pulse-subtle"
      )}>
        {/* SOS label */}
        <div className="flex flex-col items-center justify-center px-2 border-r border-white/20">
          <AlertTriangle className="w-5 h-5 text-white mb-0.5" />
          <span className="text-[9px] font-black text-white tracking-widest">SOS</span>
        </div>

        {/* Emergency buttons */}
        {sosButtons.map(btn => {
          const Icon = btn.icon;
          return (
            <a
              key={btn.label}
              href={`tel:${btn.number}`}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl transition-transform active:scale-90",
                btn.color,
                isMobile ? "min-w-[72px] min-h-[60px] px-3 py-2" : "min-w-[64px] min-h-[52px] px-2.5 py-1.5"
              )}
              aria-label={`Call ${btn.label} at ${btn.display || btn.number}`}
              onClick={() => navigator.vibrate?.([100, 50, 200])}
            >
              <Icon className="w-4 h-4 text-white mb-0.5" strokeWidth={2.5} />
              <span className="text-[10px] font-black text-white tracking-wide">{btn.label}</span>
              <span className="text-[8px] font-mono text-white/80">{btn.display || btn.number}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
});
MapSOSDock.displayName = 'MapSOSDock';

/* ═══════════════════════════════════════════
   MAP SEARCH — functional suburb autocomplete
   ═══════════════════════════════════════════ */
const MapSearchBar = memo(({ onSelectArea }: { onSelectArea: (area: AreaData) => void }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return areasData.filter(a =>
      a.name.toLowerCase().includes(q) || a.id.includes(q)
    ).slice(0, 6);
  }, [query]);

  const handleSelect = useCallback((area: AreaData) => {
    onSelectArea(area);
    setQuery(area.name);
    setFocused(false);
  }, [onSelectArea]);

  return (
    <div className="absolute top-3 left-3 right-3 z-30">
      <div className={cn(
        "relative rounded-2xl transition-all duration-200",
        "bg-[hsl(var(--surface-01))]/95 backdrop-blur-xl border",
        focused ? "border-accent-safe shadow-lg shadow-accent-safe/10" : "border-border-subtle"
      )}>
        <div className="flex items-center px-4 h-12 md:h-11">
          <MapPin className={cn(
            "w-5 h-5 mr-3 shrink-0 transition-colors",
            focused ? "text-accent-safe" : "text-muted-foreground"
          )} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search suburb, area, address or landmark..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm font-medium"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setFocused(true); }}
              className="p-1.5 rounded-lg hover:bg-surface-02 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete dropdown */}
      {focused && results.length > 0 && (
        <div className="mt-2 rounded-2xl bg-[hsl(var(--surface-01))]/95 backdrop-blur-xl border border-border-subtle shadow-2xl overflow-hidden animate-fade-in">
          {results.map(area => (
            <button
              key={area.id}
              onClick={() => handleSelect(area)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-02 transition-colors text-left min-h-[52px]"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-02 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground text-sm truncate">{area.name}</div>
                <div className="text-xs text-muted-foreground">
                  {area.incidents24h} incidents today · {area.camerasCoverage}% CCTV
                </div>
              </div>
              <div
                className="text-lg font-black tabular-nums shrink-0"
                style={{ color: getSafetyColor(area.safetyScore) }}
              >
                {area.safetyScore}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {focused && query.length > 1 && results.length === 0 && (
        <div className="mt-2 rounded-2xl bg-[hsl(var(--surface-01))]/95 backdrop-blur-xl border border-border-subtle shadow-2xl p-4 text-center animate-fade-in">
          <MapPin className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
          <div className="text-sm text-muted-foreground">No areas found for "{query}"</div>
        </div>
      )}
    </div>
  );
});
MapSearchBar.displayName = 'MapSearchBar';

/* ═══════════════════════════════════════════
   SELECTED AREA CARD — compact safety summary
   ═══════════════════════════════════════════ */
const SelectedAreaOverlay = memo(({ area, onClose }: { area: AreaData; onClose: () => void }) => (
  <div className="absolute top-[68px] left-3 right-3 z-25 animate-fade-in">
    <div className="rounded-2xl bg-[hsl(var(--surface-01))]/95 backdrop-blur-xl border border-border-subtle shadow-2xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent-safe" />
          <span className="font-bold text-foreground text-sm">{area.name}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-02 min-w-[32px] min-h-[32px] flex items-center justify-center">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-3xl font-black tabular-nums" style={{ color: getSafetyColor(area.safetyScore) }}>
          {area.safetyScore}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-muted-foreground">Incidents:</span> <span className="font-bold text-foreground">{area.incidents24h}</span></div>
          <div><span className="text-muted-foreground">CCTV:</span> <span className="font-bold text-foreground">{area.camerasCoverage}%</span></div>
          <a href={`tel:${area.policeNumber.replace(/\s/g, '')}`} className="text-accent-safe font-mono font-bold truncate col-span-2">
            🛡 {area.policeStation} — {area.policeNumber}
          </a>
        </div>
      </div>
    </div>
  </div>
));
SelectedAreaOverlay.displayName = 'SelectedAreaOverlay';

/* ═══════════════════════════════════════════
   MAIN VIEW
   ═══════════════════════════════════════════ */
const MapFullView = memo(({ onNavigate }: Props) => {
  const { selectEntity } = useDashboard();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showLegend, setShowLegend] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const [sliderValue, setSliderValue] = useState([getCurrentSlotIndex()]);

  const currentSlot = sliderValue[0];
  const riskAtSlot = useMemo(() => getRiskAtSlot(currentSlot), [currentSlot]);
  const insightText = useMemo(() => getMapInsightText(currentSlot), [currentSlot]);
  const hourlyRisk = useMemo(() => getHourlyRisk(), []);

  const handlePreset = useCallback((slot: number) => {
    setSliderValue([slot === -1 ? getCurrentSlotIndex() : slot]);
  }, []);

  const handleSaveZone = useCallback((zone: ZoneData) => {
    toast.success(`${zone.name} saved to your areas`);
  }, []);

  const handleSelectArea = useCallback((area: AreaData) => {
    setSelectedArea(area);
    selectEntity({
      id: area.id,
      type: 'area',
      name: area.name,
      data: {
        safety_score: area.safetyScore,
        incidents_24h: area.incidents24h,
        cctv_coverage: area.camerasCoverage,
        saps_station: area.policeStation,
        saps_contact: area.policeNumber,
        hospital_name: area.nearestHospital,
        hospital_contact: area.hospitalNumber,
        risk_type: area.riskLevel,
      }
    });
    toast.success(`Viewing ${area.name} — Safety ${area.safetyScore}/100`);
  }, [selectEntity]);

  return (
    <div className="relative -mx-4 -my-6 sm:-mx-12 sm:-my-10" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Map background */}
      <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{
          background: 'radial-gradient(circle at 45% 45%, hsl(var(--primary) / 0.4), transparent 50%)'
        }} />
        <div className="absolute inset-0 opacity-20 transition-all duration-300" style={{
          background: riskAtSlot.score < 5
            ? 'radial-gradient(circle at 50% 45%, hsl(var(--safety-red) / 0.5), transparent 55%)'
            : riskAtSlot.score < 7
              ? 'radial-gradient(circle at 50% 45%, hsl(var(--safety-yellow) / 0.4), transparent 55%)'
              : 'radial-gradient(circle at 50% 45%, hsl(var(--safety-green) / 0.3), transparent 55%)'
        }} />

        {/* Zone polygon overlays */}
        {showZones && (
          <div className="absolute inset-0 pointer-events-auto">
            <button
              onClick={() => setSelectedZone(mockZones[0])}
              className={cn("absolute rounded-xl border-2 transition-all cursor-pointer hover:opacity-80", zoneRiskFill[mockZones[0].riskLevel])}
              style={{ top: '25%', left: '15%', width: '28%', height: '30%' }}
              title={mockZones[0].name}
            >
              <span className="absolute top-1 left-2 text-[9px] font-bold text-foreground/60">{mockZones[0].name}</span>
            </button>
            <button
              onClick={() => setSelectedZone(mockZones[1])}
              className={cn("absolute rounded-xl border-2 transition-all cursor-pointer hover:opacity-80", zoneRiskFill[mockZones[1].riskLevel])}
              style={{ top: '20%', left: '45%', width: '30%', height: '35%' }}
              title={mockZones[1].name}
            >
              <span className="absolute top-1 left-2 text-[9px] font-bold text-foreground/60">{mockZones[1].name}</span>
            </button>
            <button
              onClick={() => setSelectedZone(mockZones[2])}
              className={cn("absolute rounded-xl border-2 transition-all cursor-pointer hover:opacity-80", zoneRiskFill[mockZones[2].riskLevel])}
              style={{ top: '55%', left: '10%', width: '25%', height: '25%' }}
              title={mockZones[2].name}
            >
              <span className="absolute top-1 left-2 text-[9px] font-bold text-foreground/60">{mockZones[2].name}</span>
            </button>
          </div>
        )}

        <div className="text-center z-10 pointer-events-none">
          <Map className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Full-screen crime map</p>
          <p className="text-xs text-muted-foreground mt-1">
            {showZones ? 'Tap a zone for details' : 'Heatmap updates with time slider below'}
          </p>
        </div>
      </div>

      {/* ═══ SEARCH BAR — single functional search ═══ */}
      <MapSearchBar onSelectArea={handleSelectArea} />

      {/* ═══ SELECTED AREA OVERLAY ═══ */}
      {selectedArea && (
        <SelectedAreaOverlay area={selectedArea} onClose={() => setSelectedArea(null)} />
      )}

      {/* Map controls — zoom/locate */}
      <div className="absolute top-16 right-3 z-20 flex flex-col gap-2">
        <button className="w-10 h-10 rounded-xl bg-[hsl(var(--surface-01))]/90 backdrop-blur border border-border-subtle flex items-center justify-center hover:bg-surface-02 transition-colors">
          <Plus className="w-4 h-4 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-[hsl(var(--surface-01))]/90 backdrop-blur border border-border-subtle flex items-center justify-center hover:bg-surface-02 transition-colors">
          <Minus className="w-4 h-4 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-[hsl(var(--surface-01))]/90 backdrop-blur border border-border-subtle flex items-center justify-center hover:bg-surface-02 transition-colors">
          <Locate className="w-4 h-4 text-accent-safe" />
        </button>
      </div>

      {/* ═══ SOS DOCK — centered, floating, prominent ═══ */}
      <MapSOSDock />

      {/* Legend pill */}
      <button
        onClick={() => setShowLegend(!showLegend)}
        className={cn(
          "absolute left-3 z-20 px-3 py-1.5 rounded-full bg-[hsl(var(--surface-01))]/90 backdrop-blur border border-border-subtle text-xs font-medium text-foreground hover:bg-surface-02 transition-colors",
          selectedZone ? "bottom-[400px]" : "bottom-[280px]"
        )}
      >
        <MapPin className="w-3 h-3 inline mr-1.5" />
        Crime Types
      </button>

      {showLegend && (
        <div className={cn(
          "absolute left-3 z-20 p-3 rounded-xl bg-[hsl(var(--surface-01))]/95 backdrop-blur border border-border-subtle animate-fade-in w-48",
          selectedZone ? "bottom-[430px]" : "bottom-[310px]"
        )}>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Legend</p>
          <div className="space-y-1.5">
            {[
              { label: 'Theft', color: 'bg-safety-yellow' },
              { label: 'Robbery', color: 'bg-safety-orange' },
              { label: 'Assault', color: 'bg-safety-red' },
              { label: 'GBV', color: 'bg-[hsl(270,95%,75%)]' },
              { label: 'Drugs', color: 'bg-muted-foreground' },
              { label: 'Hijacking', color: 'bg-destructive' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                <span className="text-xs text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom panel — time scrubber + filters */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {selectedZone && (
          <ZoneBottomSheet
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
            onNavigate={onNavigate}
            onSaveZone={handleSaveZone}
          />
        )}

        <div className="bg-[hsl(var(--surface-01))]/95 backdrop-blur-xl border-t border-border-subtle rounded-t-2xl px-4 pt-3 pb-4 space-y-3">
          <div className="w-10 h-1 rounded-full bg-border-subtle mx-auto" />

          {/* Time scrubber */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent-safe" />
                <span className="text-xs font-bold text-foreground">Time Scrubber</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tabular-nums text-foreground">{riskAtSlot.label}</span>
                <span className={cn("text-xs font-bold tabular-nums", scoreColor(riskAtSlot.score))}>
                  {riskAtSlot.score}/10
                </span>
              </div>
            </div>

            <div className="relative mb-1">
              <div className="flex h-4 gap-px rounded overflow-hidden">
                {hourlyRisk.map((h, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 transition-opacity duration-150",
                      i === currentSlot ? "opacity-100" : "opacity-40",
                      h.score >= 7 ? "bg-safety-green" :
                      h.score >= 5 ? "bg-safety-yellow" :
                      h.score >= 3.5 ? "bg-safety-orange" : "bg-safety-red"
                    )}
                  />
                ))}
              </div>
            </div>

            <Slider value={sliderValue} onValueChange={setSliderValue} min={0} max={47} step={1} className="w-full" />

            <div className="flex justify-between text-[9px] text-muted-foreground mt-1 tabular-nums">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:30</span>
            </div>

            <div className="flex gap-2 mt-2">
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p.slot)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[32px]",
                    (p.slot === -1 && currentSlot === getCurrentSlotIndex()) ||
                    (p.slot !== -1 && currentSlot === p.slot)
                      ? "bg-accent-safe text-text-inverse"
                      : "bg-surface-02 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              <span className={cn("font-semibold", scoreColor(riskAtSlot.score))}>●</span>{' '}
              {insightText}
            </p>
          </div>

          {/* Crime type + Zones filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {crimeTypes.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 min-h-[32px]",
                  activeFilter === f.id
                    ? "bg-accent-safe text-text-inverse"
                    : "bg-surface-02 text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={() => { setShowZones(!showZones); if (showZones) setSelectedZone(null); }}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 border min-h-[32px]",
                showZones
                  ? "bg-accent-safe text-text-inverse border-accent-safe"
                  : "bg-surface-02 text-muted-foreground hover:text-foreground border-border-subtle"
              )}
            >
              Zones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

MapFullView.displayName = 'MapFullView';
export default MapFullView;
