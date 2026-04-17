import { memo, useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, MapPin, Layers, Locate, Plus, Minus, Map, Clock, X, Shield, Flame, Phone, AlertTriangle, Share2, FileWarning, Navigation, WifiOff, Info, LogIn, User } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import SuburbSearchInput from '../SuburbSearchInput';
import SOSActionDock from '../SOSActionDock';
import type { ViewId } from '../AlmienDashboard';
import ZoneBottomSheet, { type ZoneData } from '../widgets/ZoneBottomSheet';
import { getHourlyRisk, getRiskAtSlot, getCurrentSlotIndex, getMapInsightText } from '@/data/timeAnalyticsData';
import { areasData, type AreaData } from '@/data/emergencyContacts';
import { getSafetyColor } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
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
   FIRST VISIT MODAL
   ═══════════════════════════════════════════ */
const FirstVisitModal = memo(({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-[hsl(var(--surface-01))] border border-border-subtle rounded-2xl max-w-sm w-full p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent-safe/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-accent-safe" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Welcome to Almien</h2>
          <p className="text-xs text-muted-foreground">Urban Safety Intelligence</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        Almien helps you navigate safer in South African cities — powered by 
        <span className="text-foreground font-semibold"> SAPS crime statistics</span> and 
        <span className="text-foreground font-semibold"> verified community reports</span>.
      </p>
      <div className="space-y-2 mb-5">
        {[
          { icon: MapPin, text: 'Real-time safety scores for any suburb' },
          { icon: AlertTriangle, text: 'One-tap SOS emergency calls' },
          { icon: Navigation, text: 'Safe route planning & live alerts' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 text-xs text-foreground">
            <item.icon className="w-4 h-4 text-accent-safe shrink-0" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-accent-safe text-text-inverse font-bold text-sm active:scale-95 transition-transform min-h-[48px]"
      >
        Get Started
      </button>
    </div>
  </div>
));
FirstVisitModal.displayName = 'FirstVisitModal';

/* ═══════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════ */
const MapLoadingSkeleton = memo(() => (
  <div className="absolute inset-0 z-40 bg-background/80 backdrop-blur flex flex-col items-center justify-center gap-4 animate-fade-in">
    <div className="space-y-3 w-64">
      <Skeleton className="h-4 w-48 mx-auto" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1 rounded-lg" />
        <Skeleton className="h-8 flex-1 rounded-lg" />
        <Skeleton className="h-8 flex-1 rounded-lg" />
      </div>
      <Skeleton className="h-3 w-40 mx-auto" />
    </div>
    <p className="text-xs text-muted-foreground font-mono animate-pulse">Loading safety data…</p>
  </div>
));
MapLoadingSkeleton.displayName = 'MapLoadingSkeleton';

/* ═══════════════════════════════════════════
   OFFLINE BANNER
   ═══════════════════════════════════════════ */
const OfflineBanner = memo(() => (
  <div className="absolute top-16 left-3 right-3 z-35 animate-fade-in">
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-safety-orange/20 border border-safety-orange/40 backdrop-blur-xl">
      <WifiOff className="w-4 h-4 text-safety-orange shrink-0" />
      <span className="text-xs font-semibold text-foreground">You're offline — showing cached data</span>
    </div>
  </div>
));
OfflineBanner.displayName = 'OfflineBanner';

/* ═══════════════════════════════════════════
   GUEST LOGIN BAR
   ═══════════════════════════════════════════ */
const GuestBar = memo(({ onLogin }: { onLogin: () => void }) => (
  <div className="absolute top-[68px] left-3 right-3 z-25 animate-fade-in">
    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[hsl(var(--surface-01))]/90 backdrop-blur-xl border border-border-subtle">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Guest mode — limited features</span>
      </div>
      <button
        onClick={onLogin}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-safe text-text-inverse text-xs font-bold min-h-[32px] active:scale-95 transition-transform"
      >
        <LogIn className="w-3 h-3" /> Sign In
      </button>
    </div>
  </div>
));
GuestBar.displayName = 'GuestBar';

/* ═══════════════════════════════════════════
   LOCATE ME RISK POPUP
   ═══════════════════════════════════════════ */
const RiskPopup = memo(({ area, onClose }: { area: AreaData; onClose: () => void }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 animate-fade-in">
    <div className="bg-[hsl(var(--surface-01))]/95 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-2xl p-4 w-64">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Locate className="w-4 h-4 text-accent-safe" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">Your Location</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-02 min-w-[28px] min-h-[28px] flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <div className="text-center py-3">
        <div className="text-4xl font-black tabular-nums mb-1" style={{ color: getSafetyColor(area.safetyScore) }}>
          {area.safetyScore}
        </div>
        <div className="text-sm font-bold text-foreground">{area.name}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {area.riskLevel === 'critical' ? '⚠️ High risk — stay alert' :
           area.riskLevel === 'high' ? '⚠️ Elevated risk area' :
           area.riskLevel === 'moderate' ? 'Moderate — normal caution' :
           '✅ Low risk area'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mt-1">
        <div className="bg-surface-02 rounded-lg p-2 text-center">
          <div className="text-muted-foreground">Incidents</div>
          <div className="font-bold text-foreground">{area.incidents24h}</div>
        </div>
        <div className="bg-surface-02 rounded-lg p-2 text-center">
          <div className="text-muted-foreground">CCTV</div>
          <div className="font-bold text-foreground">{area.camerasCoverage}%</div>
        </div>
      </div>
    </div>
  </div>
));
RiskPopup.displayName = 'RiskPopup';

/* ═══════════════════════════════════════════
   ENHANCED SOS DOCK
   ═══════════════════════════════════════════ */
const enhancedSosButtons = [
  { label: 'SAPS', number: '10111', display: '10111', color: 'bg-blue-600', icon: Shield, action: 'call' as const },
  { label: 'FIRE', number: '0214807700', display: '021 480 7700', color: 'bg-red-600', icon: Flame, action: 'call' as const },
  { label: 'AMBULANCE', number: '10177', display: '10177', color: 'bg-emerald-600', icon: Phone, action: 'call' as const },
] as const;

const MapSOSDock = memo(({ onReport, onSafeRoute }: { onReport: () => void; onSafeRoute: () => void }) => {
  const isMobile = useIsMobile();

  const handleShareLocation = useCallback(() => {
    navigator.vibrate?.([50]);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
          if (navigator.share) {
            navigator.share({ title: 'My Live Location — Almien SOS', url });
          } else {
            navigator.clipboard.writeText(url);
            toast.success('Location link copied to clipboard');
          }
        },
        () => toast.error('Could not get location')
      );
    }
  }, []);

  return (
    <div className={cn(
      "absolute z-30 left-1/2 -translate-x-1/2 pointer-events-auto",
      "bottom-[270px] md:bottom-[240px]"
    )}>
      <div className={cn(
        "flex flex-col items-center gap-2 px-3 py-3 rounded-2xl",
        "bg-gradient-to-b from-red-600/95 via-orange-600/95 to-red-700/95",
        "backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(239,68,68,0.4)]",
        "animate-pulse-subtle"
      )}>
        {/* SOS label */}
        <div className="flex items-center gap-2 w-full justify-center border-b border-white/15 pb-1.5">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span className="text-[10px] font-black text-white tracking-[0.2em]">SOS EMERGENCY</span>
        </div>

        {/* Call buttons row */}
        <div className="flex items-center gap-2">
          {enhancedSosButtons.map(btn => {
            const Icon = btn.icon;
            return (
              <a
                key={btn.label}
                href={`tel:${btn.number}`}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl transition-transform active:scale-90",
                  btn.color,
                  isMobile ? "min-w-[68px] min-h-[60px] px-2.5 py-2" : "min-w-[60px] min-h-[50px] px-2 py-1.5"
                )}
                aria-label={`Call ${btn.label} at ${btn.display}`}
                onClick={() => navigator.vibrate?.([100, 50, 200])}
              >
                <Icon className="w-4 h-4 text-white mb-0.5" strokeWidth={2.5} />
                <span className="text-[9px] font-black text-white tracking-wide">{btn.label}</span>
                <span className="text-[7px] font-mono text-white/80">{btn.display}</span>
              </a>
            );
          })}
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-1.5 w-full">
          <button
            onClick={handleShareLocation}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/15 border border-white/20 active:scale-95 transition-transform min-h-[40px]"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span className="text-[9px] font-bold text-white">Share Location</span>
          </button>
          <button
            onClick={() => { navigator.vibrate?.([15]); onReport(); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/15 border border-white/20 active:scale-95 transition-transform min-h-[40px]"
          >
            <FileWarning className="w-3.5 h-3.5 text-white" />
            <span className="text-[9px] font-bold text-white">Report</span>
          </button>
          <button
            onClick={() => { navigator.vibrate?.([15]); onSafeRoute(); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/15 border border-white/20 active:scale-95 transition-transform min-h-[40px]"
          >
            <Navigation className="w-3.5 h-3.5 text-white" />
            <span className="text-[9px] font-bold text-white">Safe Route</span>
          </button>
        </div>
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
        <div className="mt-2 rounded-2xl bg-[hsl(var(--surface-01))]/95 backdrop-blur-xl border border-border-subtle shadow-2xl overflow-hidden animate-fade-in max-h-[50vh] overflow-y-auto">
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
   SELECTED AREA CARD — compact safety summary with trend
   ═══════════════════════════════════════════ */
const SelectedAreaOverlay = memo(({ area, onClose }: { area: AreaData; onClose: () => void }) => {
  // Mock trend data
  const trend = area.safetyScore > 60 ? 'improving' : area.safetyScore > 40 ? 'stable' : 'worsening';
  const trendArrow = trend === 'improving' ? '↑' : trend === 'worsening' ? '↓' : '→';
  const trendColor = trend === 'improving' ? 'text-safety-green' : trend === 'worsening' ? 'text-safety-red' : 'text-safety-yellow';

  return (
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
          <div className="text-center">
            <div className="text-3xl font-black tabular-nums" style={{ color: getSafetyColor(area.safetyScore) }}>
              {area.safetyScore}
            </div>
            <div className={cn("text-xs font-bold", trendColor)}>
              {trendArrow} {trend}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Incidents:</span> <span className="font-bold text-foreground">{area.incidents24h}</span></div>
            <div><span className="text-muted-foreground">CCTV:</span> <span className="font-bold text-foreground">{area.camerasCoverage}%</span></div>
            <a href={`tel:${area.policeNumber.replace(/\s/g, '')}`} className="text-accent-safe font-mono font-bold truncate col-span-2 min-h-[32px] flex items-center">
              🛡 {area.policeStation} — {area.policeNumber}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
SelectedAreaOverlay.displayName = 'SelectedAreaOverlay';

/* ═══════════════════════════════════════════
   DATA SOURCES FOOTER
   ═══════════════════════════════════════════ */
const DataSourcesFooter = memo(() => (
  <div className="flex items-center justify-center gap-1.5 py-1.5 px-3">
    <Info className="w-3 h-3 text-muted-foreground/50 shrink-0" />
    <span className="text-[8px] text-muted-foreground/60 font-mono">
      Data: SAPS crime stats + verified community reports | Privacy protected | © Almien {new Date().getFullYear()}
    </span>
  </div>
));
DataSourcesFooter.displayName = 'DataSourcesFooter';

/* ═══════════════════════════════════════════
   MAIN VIEW
   ═══════════════════════════════════════════ */
const MapFullView = memo(({ onNavigate }: Props) => {
  const { selectEntity } = useDashboard();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showLegend, setShowLegend] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const [sliderValue, setSliderValue] = useState([getCurrentSlotIndex()]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [riskPopupArea, setRiskPopupArea] = useState<AreaData | null>(null);
  const [showFirstVisit, setShowFirstVisit] = useState(() => {
    return !localStorage.getItem('almien-map-visited');
  });

  // Simulate map data loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

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

  const handleLocateMe = useCallback(() => {
    navigator.vibrate?.([20]);
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    toast.loading('Detecting location…');
    navigator.geolocation.getCurrentPosition(
      () => {
        toast.dismiss();
        // Find nearest area (mock: pick based on random for demo, or first moderate+)
        const nearest = areasData.find(a => a.riskLevel === 'moderate') || areasData[0];
        setRiskPopupArea(nearest);
        toast.success(`Located near ${nearest.name}`);
      },
      () => {
        toast.dismiss();
        toast.error('Could not detect location');
      },
      { timeout: 8000 }
    );
  }, []);

  const handleCloseFirstVisit = useCallback(() => {
    localStorage.setItem('almien-map-visited', 'true');
    setShowFirstVisit(false);
  }, []);

  return (
    <div className="relative -mx-4 -my-6 sm:-mx-12 sm:-my-10" style={{ height: 'calc(100vh - 100px)' }}>
      {/* First visit modal */}
      {showFirstVisit && <FirstVisitModal onClose={handleCloseFirstVisit} />}

      {/* Loading skeleton */}
      {isLoading && <MapLoadingSkeleton />}

      {/* Map background with heatmap overlay */}
      <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{
          background: 'radial-gradient(circle at 45% 45%, hsl(var(--primary) / 0.4), transparent 50%)'
        }} />
        {/* Dynamic heatmap gradient based on time */}
        <div className="absolute inset-0 opacity-20 transition-all duration-300" style={{
          background: riskAtSlot.score < 5
            ? 'radial-gradient(circle at 50% 45%, hsl(var(--safety-red) / 0.5), transparent 55%)'
            : riskAtSlot.score < 7
              ? 'radial-gradient(circle at 50% 45%, hsl(var(--safety-yellow) / 0.4), transparent 55%)'
              : 'radial-gradient(circle at 50% 45%, hsl(var(--safety-green) / 0.3), transparent 55%)'
        }} />

        {/* Safety heatmap grid overlay — placeholder zones */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Red zone — high risk */}
          <div className="absolute rounded-full opacity-25 bg-safety-red blur-2xl" style={{ top: '20%', left: '30%', width: '20%', height: '20%' }} />
          {/* Yellow zone — moderate */}
          <div className="absolute rounded-full opacity-20 bg-safety-yellow blur-2xl" style={{ top: '40%', left: '55%', width: '25%', height: '18%' }} />
          {/* Green zone — safe */}
          <div className="absolute rounded-full opacity-15 bg-safety-green blur-2xl" style={{ top: '60%', left: '20%', width: '22%', height: '22%' }} />
          {/* Another red zone */}
          <div className="absolute rounded-full opacity-20 bg-safety-red blur-3xl" style={{ top: '55%', right: '10%', width: '18%', height: '15%' }} />
        </div>

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

      {/* ═══ SEARCH BAR ═══ */}
      <div className="absolute top-3 left-3 right-3 z-30">
        <SuburbSearchInput
          placeholder="Search suburb, ward or area..."
          onSelect={(r) => {
            const matched = areasData.find(a => a.name.toLowerCase() === r.name.toLowerCase());
            if (matched) handleSelectArea(matched);
            else if (r.areaData) handleSelectArea(r.areaData as unknown as AreaData);
          }}
        />
      </div>

      {/* ═══ OFFLINE BANNER ═══ */}
      {isOffline && <OfflineBanner />}

      {/* ═══ GUEST BAR (no auth) ═══ */}
      {!user && !selectedArea && !isOffline && !isLoading && (
        <GuestBar onLogin={() => onNavigate('settings')} />
      )}

      {/* ═══ SELECTED AREA OVERLAY ═══ */}
      {selectedArea && (
        <SelectedAreaOverlay area={selectedArea} onClose={() => setSelectedArea(null)} />
      )}

      {/* ═══ RISK POPUP (locate me) ═══ */}
      {riskPopupArea && (
        <RiskPopup area={riskPopupArea} onClose={() => setRiskPopupArea(null)} />
      )}

      {/* Map controls — zoom/locate */}
      <div className="absolute top-16 right-3 z-20 flex flex-col gap-2">
        <button className="w-10 h-10 rounded-xl bg-[hsl(var(--surface-01))]/90 backdrop-blur border border-border-subtle flex items-center justify-center hover:bg-surface-02 transition-colors">
          <Plus className="w-4 h-4 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-[hsl(var(--surface-01))]/90 backdrop-blur border border-border-subtle flex items-center justify-center hover:bg-surface-02 transition-colors">
          <Minus className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={handleLocateMe}
          className="w-10 h-10 rounded-xl bg-[hsl(var(--surface-01))]/90 backdrop-blur border border-accent-safe/40 flex items-center justify-center hover:bg-surface-02 transition-colors active:scale-90"
          aria-label="Detect my location"
        >
          <Locate className="w-4 h-4 text-accent-safe" />
        </button>
      </div>

      {/* ═══ SOS DOCK — collapsible FAB on map ═══ */}
      <SOSActionDock mapMode />

      {/* Tap-to-report shortcut (small, tucked above SOS) */}
      <button
        onClick={() => onNavigate('community')}
        className="fixed z-[87] right-4 w-10 h-10 rounded-full bg-[hsl(var(--surface-01))]/90 backdrop-blur border border-border-subtle flex items-center justify-center"
        style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom, 0px) + 84px)' }}
        aria-label="Report incident"
      >
        <FileWarning className="w-4 h-4 text-accent-warning" />
      </button>

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

      {/* Bottom panel — time scrubber + filters + footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {selectedZone && (
          <ZoneBottomSheet
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
            onNavigate={onNavigate}
            onSaveZone={handleSaveZone}
          />
        )}

        <div className="bg-[hsl(var(--surface-01))]/95 backdrop-blur-xl border-t border-border-subtle rounded-t-2xl px-4 pt-3 pb-2 space-y-3">
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

          {/* Data sources footer */}
          <DataSourcesFooter />
        </div>
      </div>
    </div>
  );
});

MapFullView.displayName = 'MapFullView';
export default MapFullView;
