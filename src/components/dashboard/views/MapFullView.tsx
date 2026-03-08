import { memo, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Search, MapPin, Layers, Locate, Plus, Minus, Map, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { ViewId } from '../GridifyDashboard';
import AreaIntelCard from '../widgets/AreaIntelCard';
import ZoneBottomSheet, { type ZoneData } from '../widgets/ZoneBottomSheet';
import { getHourlyRisk, getRiskAtSlot, getCurrentSlotIndex, getMapInsightText } from '@/data/timeAnalyticsData';
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

// Mock zone polygons shown on map
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

const MapFullView = memo(({ onNavigate }: Props) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showLegend, setShowLegend] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
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

  return (
    <div className="relative -mx-4 -my-6 sm:-mx-12 sm:-my-10" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Map area */}
      <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{
          background: 'radial-gradient(circle at 45% 45%, hsl(var(--primary) / 0.4), transparent 50%)'
        }} />
        {/* Heatmap intensity — shifts with slider */}
        <div className="absolute inset-0 opacity-20 transition-all duration-300" style={{
          background: riskAtSlot.score < 5
            ? 'radial-gradient(circle at 50% 45%, hsl(var(--safety-red) / 0.5), transparent 55%)'
            : riskAtSlot.score < 7
              ? 'radial-gradient(circle at 50% 45%, hsl(var(--safety-yellow) / 0.4), transparent 55%)'
              : 'radial-gradient(circle at 50% 45%, hsl(var(--safety-green) / 0.3), transparent 55%)'
        }} />

        {/* Zone polygon overlays — visible when Zones toggle active */}
        {showZones && (
          <div className="absolute inset-0 pointer-events-auto">
            {/* Simulated zone polygons as positioned divs */}
            <button
              onClick={() => setSelectedZone(mockZones[0])}
              className={cn(
                "absolute rounded-xl border-2 transition-all cursor-pointer hover:opacity-80",
                zoneRiskFill[mockZones[0].riskLevel]
              )}
              style={{ top: '25%', left: '15%', width: '28%', height: '30%' }}
              title={mockZones[0].name}
            >
              <span className="absolute top-1 left-2 text-[9px] font-bold text-foreground/60">{mockZones[0].name}</span>
            </button>
            <button
              onClick={() => setSelectedZone(mockZones[1])}
              className={cn(
                "absolute rounded-xl border-2 transition-all cursor-pointer hover:opacity-80",
                zoneRiskFill[mockZones[1].riskLevel]
              )}
              style={{ top: '20%', left: '45%', width: '30%', height: '35%' }}
              title={mockZones[1].name}
            >
              <span className="absolute top-1 left-2 text-[9px] font-bold text-foreground/60">{mockZones[1].name}</span>
            </button>
            <button
              onClick={() => setSelectedZone(mockZones[2])}
              className={cn(
                "absolute rounded-xl border-2 transition-all cursor-pointer hover:opacity-80",
                zoneRiskFill[mockZones[2].riskLevel]
              )}
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

      {/* Top search bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search suburb..." className="pl-10 bg-card/90 backdrop-blur border-border rounded-xl h-10" />
        </div>
        <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors">
          <Layers className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Map controls */}
      <div className="absolute top-16 right-3 z-20 flex flex-col gap-2">
        <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors">
          <Plus className="w-4 h-4 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors">
          <Minus className="w-4 h-4 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors">
          <Locate className="w-4 h-4 text-primary" />
        </button>
      </div>

      {/* Legend pill */}
      <button
        onClick={() => setShowLegend(!showLegend)}
        className={cn(
          "absolute left-3 z-20 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur border border-border text-xs font-medium text-foreground hover:bg-card transition-colors",
          selectedZone ? "bottom-[400px]" : "bottom-[280px]"
        )}
      >
        <MapPin className="w-3 h-3 inline mr-1.5" />
        Crime Types
      </button>

      {showLegend && (
        <div className={cn(
          "absolute left-3 z-20 p-3 rounded-xl bg-card/95 backdrop-blur border border-border animate-fade-in w-48",
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

      {/* Bottom panel — time scrubber + filters + zone toggle */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Zone bottom sheet — slides up when a zone is tapped */}
        {selectedZone && (
          <ZoneBottomSheet
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
            onNavigate={onNavigate}
            onSaveZone={handleSaveZone}
          />
        )}

        <div className="bg-card/95 backdrop-blur border-t border-border rounded-t-2xl px-4 pt-3 pb-4 space-y-3">
          <div className="w-10 h-1 rounded-full bg-border mx-auto" />

          {/* ═══ TIME SCRUBBER SLIDER ═══ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-foreground">Time Scrubber</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tabular-nums text-foreground">{riskAtSlot.label}</span>
                <span className={cn("text-xs font-bold tabular-nums", scoreColor(riskAtSlot.score))}>
                  {riskAtSlot.score}/10
                </span>
              </div>
            </div>

            {/* Density bars behind slider */}
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

            {/* Time labels */}
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1 tabular-nums">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:30</span>
            </div>

            {/* Preset buttons */}
            <div className="flex gap-2 mt-2">
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p.slot)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[32px]",
                    (p.slot === -1 && currentSlot === getCurrentSlotIndex()) ||
                    (p.slot !== -1 && currentSlot === p.slot)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Contextual insight */}
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
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                  activeFilter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
            {/* Zones toggle */}
            <button
              onClick={() => { setShowZones(!showZones); if (showZones) setSelectedZone(null); }}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 border",
                showZones
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground border-border"
              )}
            >
              Zones
            </button>
          </div>

          {/* Area intelligence search — only when no zone is selected */}
          {!selectedZone && (
            <div className="border-t border-border pt-2">
              <AreaIntelCard variant="popover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MapFullView.displayName = 'MapFullView';
export default MapFullView;
