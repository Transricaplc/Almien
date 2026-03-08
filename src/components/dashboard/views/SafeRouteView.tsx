import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Navigation, MapPin, Clock, Shield, AlertTriangle, ChevronDown, ChevronUp,
  Footprints, Car, Bus, Bike, Share2, Check, X, Locate, Search
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

type TravelMode = 'foot' | 'car' | 'taxi' | 'cycling';
type TimeOption = 'now' | 'custom';

interface RouteOption {
  id: string;
  name: string;
  travelTime: string;
  distanceKm: number;
  safetyScore: number;
  highRiskIntersections: number;
  activeIncidents: number;
  threats: string[];
  isSafest: boolean;
}

const travelModes: { id: TravelMode; label: string; icon: typeof Footprints }[] = [
  { id: 'foot', label: 'On Foot', icon: Footprints },
  { id: 'car', label: 'Private Car', icon: Car },
  { id: 'taxi', label: 'Taxi / Minibus', icon: Bus },
  { id: 'cycling', label: 'Cycling', icon: Bike },
];

const capeTownLocations = [
  'Cape Town CBD', 'Sea Point', 'Camps Bay', 'Woodstock', 'Observatory',
  'Claremont', 'Newlands', 'Rondebosch', 'Khayelitsha', 'Mitchells Plain',
  'Muizenberg', 'Fish Hoek', 'Simon\'s Town', 'Stellenbosch', 'Paarl',
  'V&A Waterfront', 'Green Point', 'Bellville', 'Tyger Valley', 'Nyanga',
  'Gugulethu', 'Langa', 'Wynberg', 'Constantia', 'Hout Bay',
];

function generateMockRoutes(origin: string, destination: string, mode: TravelMode): RouteOption[] {
  const baseTimes: Record<TravelMode, number> = { foot: 45, car: 18, taxi: 25, cycling: 30 };
  const base = baseTimes[mode];
  
  const routes: RouteOption[] = [
    {
      id: 'safest',
      name: 'Safest Route (Recommended)',
      travelTime: `${base + 5} min`,
      distanceKm: +(Math.random() * 4 + 3).toFixed(1),
      safetyScore: +(Math.random() * 2 + 8).toFixed(1) as number,
      highRiskIntersections: Math.floor(Math.random() * 2),
      activeIncidents: Math.floor(Math.random() * 2),
      threats: ['Moderate foot traffic area after 20:00'],
      isSafest: true,
    },
    {
      id: 'fastest',
      name: 'Fastest Route',
      travelTime: `${base} min`,
      distanceKm: +(Math.random() * 3 + 2).toFixed(1),
      safetyScore: +(Math.random() * 3 + 4).toFixed(1) as number,
      highRiskIntersections: Math.floor(Math.random() * 4 + 2),
      activeIncidents: Math.floor(Math.random() * 5 + 1),
      threats: [
        'Passes through high-incident zone near Long Street',
        'Limited CCTV coverage on Buitenkant St',
        `${Math.floor(Math.random() * 3 + 1)} robbery reports in last 4 hours`,
      ],
      isSafest: false,
    },
    {
      id: 'alternate',
      name: 'Alternate Route',
      travelTime: `${base + 12} min`,
      distanceKm: +(Math.random() * 5 + 4).toFixed(1),
      safetyScore: +(Math.random() * 2 + 6).toFixed(1) as number,
      highRiskIntersections: Math.floor(Math.random() * 3 + 1),
      activeIncidents: Math.floor(Math.random() * 3),
      threats: [
        'Low street lighting on sections of Main Road',
        'Construction detour near Salt River',
      ],
      isSafest: false,
    },
  ];

  return routes;
}

function scoreColor(score: number) {
  if (score >= 8) return 'text-safety-green';
  if (score >= 5) return 'text-safety-yellow';
  return 'text-safety-red';
}

function scoreBg(score: number) {
  if (score >= 8) return 'bg-safety-green/10 border-safety-green/30';
  if (score >= 5) return 'bg-safety-yellow/10 border-safety-yellow/30';
  return 'bg-safety-red/10 border-safety-red/30';
}

const SafeRouteView = memo(({ onNavigate }: Props) => {
  // Planning state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<TravelMode>('car');
  const [timeOption, setTimeOption] = useState<TimeOption>('now');
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [customTime, setCustomTime] = useState('18:00');
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Results state
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  // Journey sharing state
  const [journeyActive, setJourneyActive] = useState(false);
  const [journeyElapsed, setJourneyElapsed] = useState(0);
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [deviationAlert, setDeviationAlert] = useState(false);
  const journeyInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-fill origin with "Current Location"
  useEffect(() => {
    if (navigator.geolocation) {
      setOrigin('📍 Current Location');
    }
  }, []);

  const filterLocations = (query: string) =>
    capeTownLocations.filter(l => l.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  const handleOriginChange = (val: string) => {
    setOrigin(val);
    if (val.length > 1) {
      setOriginSuggestions(filterLocations(val));
      setShowOriginSuggestions(true);
    } else {
      setShowOriginSuggestions(false);
    }
  };

  const handleDestChange = (val: string) => {
    setDestination(val);
    if (val.length > 1) {
      setDestSuggestions(filterLocations(val));
      setShowDestSuggestions(true);
    } else {
      setShowDestSuggestions(false);
    }
  };

  const calculateRoutes = () => {
    if (!origin.trim() || !destination.trim()) {
      toast.error('Please enter both origin and destination');
      return;
    }
    setCalculating(true);
    setRoutes(null);
    setTimeout(() => {
      setRoutes(generateMockRoutes(origin, destination, mode));
      setCalculating(false);
    }, 1500);
  };

  const startJourney = useCallback((routeId: string) => {
    setJourneyActive(true);
    setJourneyElapsed(0);
    setSharingEnabled(true);
    toast.success('Journey started — your Safety Network will be notified');

    journeyInterval.current = setInterval(() => {
      setJourneyElapsed(prev => {
        // Simulate deviation alert after ~50 seconds
        if (prev === 50 && !deviationAlert) {
          setDeviationAlert(true);
          toast.error('⚠️ Route deviation detected — alert sent to contacts', { duration: 6000 });
        }
        return prev + 1;
      });
    }, 1000);
  }, [deviationAlert]);

  const stopJourney = useCallback(() => {
    setJourneyActive(false);
    setJourneyElapsed(0);
    setSharingEnabled(false);
    setDeviationAlert(false);
    if (journeyInterval.current) clearInterval(journeyInterval.current);
    toast.success('Journey ended safely');
  }, []);

  useEffect(() => {
    return () => {
      if (journeyInterval.current) clearInterval(journeyInterval.current);
    };
  }, []);

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Active journey overlay
  if (journeyActive) {
    const activeRoute = routes?.find(r => r.isSafest) || routes?.[0];
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Journey header */}
        <div className={cn(
          "p-5 rounded-xl border",
          deviationAlert
            ? "bg-destructive/10 border-destructive/40"
            : "bg-primary/10 border-primary/30"
        )}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Journey in Progress
            </h2>
            <Badge variant="outline" className="text-xs font-mono">
              {formatElapsed(journeyElapsed)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Route</p>
              <p className="text-sm font-semibold text-foreground">{activeRoute?.name}</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">ETA</p>
              <p className="text-sm font-semibold text-foreground">{activeRoute?.travelTime}</p>
            </div>
          </div>

          {/* Sharing status */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
            <Share2 className="w-4 h-4 text-primary" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">Live Tracking Shared</p>
              <p className="text-[10px] text-muted-foreground">3 contacts can see your live position</p>
            </div>
            <Check className="w-4 h-4 text-safety-green" />
          </div>

          {/* Deviation alert */}
          {deviationAlert && (
            <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <div>
                  <p className="text-xs font-bold text-destructive">Route Deviation Detected</p>
                  <p className="text-[10px] text-muted-foreground">
                    Alert sent to all Safety Network contacts with your last known coordinates.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simulated map area */}
        <div className="relative rounded-xl border border-border overflow-hidden h-64 bg-secondary/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="w-8 h-8 text-primary mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-medium text-muted-foreground">Live map tracking active</p>
              <p className="text-xs text-muted-foreground mt-1">
                {origin} → {destination}
              </p>
            </div>
          </div>
          {/* Route line visualization */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 256">
            <path
              d="M 40 200 C 100 180, 150 80, 200 100 S 300 60, 360 56"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="8 4"
              opacity="0.6"
            />
            {deviationAlert && (
              <circle cx="240" cy="90" r="6" fill="hsl(var(--destructive))" className="animate-pulse" />
            )}
            <circle cx="40" cy="200" r="5" fill="hsl(var(--primary))" />
            <circle cx="360" cy="56" r="5" fill="hsl(var(--safety-green))" />
          </svg>
        </div>

        {/* End journey */}
        <Button
          variant="destructive"
          className="w-full h-12"
          onClick={stopJourney}
        >
          <X className="w-4 h-4 mr-2" /> End Journey
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Navigation className="w-8 h-8 text-primary" />
          Plan Safe Route
        </h1>
        <p className="text-muted-foreground mt-1">
          Find the safest path between two points in the Western Cape
        </p>
      </div>

      {/* Route planner form */}
      <div className="p-6 rounded-xl border border-border bg-card space-y-4">
        {/* Origin */}
        <div className="relative">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Origin</label>
          <div className="relative">
            <Locate className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <Input
              value={origin}
              onChange={e => handleOriginChange(e.target.value)}
              onFocus={() => origin.length > 1 && setShowOriginSuggestions(true)}
              onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
              placeholder="Current location or search..."
              className="pl-10"
            />
          </div>
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {originSuggestions.map(s => (
                <button key={s} className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors text-foreground"
                  onMouseDown={() => { setOrigin(s); setShowOriginSuggestions(false); }}>
                  <MapPin className="w-3.5 h-3.5 inline mr-2 text-muted-foreground" />{s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Destination</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={destination}
              onChange={e => handleDestChange(e.target.value)}
              onFocus={() => destination.length > 1 && setShowDestSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
              placeholder="Search destination..."
              className="pl-10"
            />
          </div>
          {showDestSuggestions && destSuggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {destSuggestions.map(s => (
                <button key={s} className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors text-foreground"
                  onMouseDown={() => { setDestination(s); setShowDestSuggestions(false); }}>
                  <MapPin className="w-3.5 h-3.5 inline mr-2 text-muted-foreground" />{s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Travel mode */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Travel Mode</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {travelModes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  mode === m.id
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <m.icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time of travel */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">When</label>
          <div className="flex gap-2 mb-3">
            {(['now', 'custom'] as TimeOption[]).map(opt => (
              <button
                key={opt}
                onClick={() => setTimeOption(opt)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  timeOption === opt
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {opt === 'now' ? '🕐 Now' : '📅 Custom Time'}
              </button>
            ))}
          </div>
          {timeOption === 'custom' && (
            <div className="flex gap-3 items-end animate-fade-in">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      {customDate ? format(customDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customDate}
                      onSelect={setCustomDate}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Input
                type="time"
                value={customTime}
                onChange={e => setCustomTime(e.target.value)}
                className="w-32"
              />
            </div>
          )}
        </div>

        {/* Calculate button */}
        <Button
          className="w-full h-12 text-sm font-bold"
          onClick={calculateRoutes}
          disabled={calculating}
        >
          {calculating ? (
            <><Clock className="w-4 h-4 mr-2 animate-spin" /> Analyzing safety data...</>
          ) : (
            <><Shield className="w-4 h-4 mr-2" /> Calculate Safe Routes</>
          )}
        </Button>
      </div>

      {/* Route results */}
      {routes && (
        <div className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-bold text-foreground">
            {routes.length} Routes Found
          </h2>

          {/* Simulated map */}
          <div className="relative rounded-xl border border-border overflow-hidden h-48 bg-secondary/30">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 192">
              {/* Safest route - green */}
              <path
                d="M 30 160 C 80 140, 120 60, 200 80 S 320 40, 370 32"
                fill="none"
                stroke="hsl(var(--safety-green))"
                strokeWidth="4"
                opacity="0.8"
              />
              {/* Fastest route - red segments */}
              <path
                d="M 30 160 C 100 150, 140 100, 200 110 S 300 80, 370 32"
                fill="none"
                stroke="hsl(var(--safety-red))"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                opacity="0.6"
              />
              {/* Alternate route */}
              <path
                d="M 30 160 C 60 120, 100 140, 160 100 S 280 110, 370 32"
                fill="none"
                stroke="hsl(var(--safety-yellow))"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              {/* Warning icons on risky segments */}
              <circle cx="170" cy="105" r="8" fill="hsl(var(--destructive))" opacity="0.7" />
              <text x="170" y="109" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">!</text>
              {/* Origin / destination markers */}
              <circle cx="30" cy="160" r="6" fill="hsl(var(--primary))" />
              <circle cx="370" cy="32" r="6" fill="hsl(var(--safety-green))" />
            </svg>
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Badge variant="outline" className="text-[9px] bg-card/90 border-safety-green/40 text-safety-green">● Safest</Badge>
              <Badge variant="outline" className="text-[9px] bg-card/90 border-safety-red/40 text-safety-red">● Fastest</Badge>
              <Badge variant="outline" className="text-[9px] bg-card/90 border-safety-yellow/40 text-safety-yellow">● Alternate</Badge>
            </div>
          </div>

          {/* Route cards */}
          {routes.map(route => (
            <div
              key={route.id}
              className={cn(
                "p-4 rounded-xl border transition-all",
                route.isSafest
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border hover:border-border"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{route.name}</h3>
                    {route.isSafest && (
                      <Badge className="text-[9px] bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
                        SAFEST
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {route.distanceKm} km · {route.travelTime}
                  </p>
                </div>
                {/* Safety score */}
                <div className={cn("px-3 py-2 rounded-lg border text-center", scoreBg(route.safetyScore))}>
                  <p className={cn("text-lg font-black", scoreColor(route.safetyScore))}>
                    {route.safetyScore}
                  </p>
                  <p className="text-[9px] text-muted-foreground">/10</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                  <AlertTriangle className="w-3.5 h-3.5 text-safety-orange shrink-0" />
                  <span className="text-xs text-foreground">
                    <strong>{route.highRiskIntersections}</strong> high-risk intersections
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                  <MapPin className="w-3.5 h-3.5 text-safety-red shrink-0" />
                  <span className="text-xs text-foreground">
                    <strong>{route.activeIncidents}</strong> incidents nearby (4h)
                  </span>
                </div>
              </div>

              {/* Expandable threats */}
              <button
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
              >
                {expandedRoute === route.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Why is this {route.safetyScore < 7 ? 'risky' : 'safe'}?
              </button>
              {expandedRoute === route.id && (
                <div className="mt-2 space-y-1.5 animate-fade-in">
                  {route.threats.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                      <span className="text-xs text-foreground">{t}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigate button */}
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className={cn("flex-1 text-xs", route.isSafest ? "" : "variant-outline")}
                  variant={route.isSafest ? "default" : "outline"}
                  onClick={() => startJourney(route.id)}
                >
                  <Navigation className="w-3.5 h-3.5 mr-1" />
                  Start Navigation
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    toast.success('Journey sharing link copied', {
                      description: 'Share this link with anyone to let them track your route.',
                    });
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SafeRouteView.displayName = 'SafeRouteView';
export default SafeRouteView;
