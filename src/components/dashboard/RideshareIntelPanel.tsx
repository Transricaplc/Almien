import { useState, useMemo } from 'react';
import { 
  Search, MapPin, Phone, Hospital, Shield, X, AlertTriangle, CheckCircle, Info, 
  Clock, Sun, Moon, Sunset, Car, CreditCard, Eye, Navigation, Users, Radio,
  MapPinOff, Lightbulb, ShieldAlert, Route, TrendingUp, Building, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSuburbIntelligence, getRiskLevel, getSafetyColor, estimateFunctioningCCTV } from '@/hooks/useSuburbIntelligence';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface TimeRiskModifier {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  modifier: number;
  description: string;
}

const TIME_RISK_MODIFIERS: Record<TimeOfDay, TimeRiskModifier> = {
  morning: { label: 'Morning', icon: Sun, modifier: 0, description: '06:00 - 12:00' },
  afternoon: { label: 'Afternoon', icon: Sun, modifier: 5, description: '12:00 - 18:00' },
  evening: { label: 'Evening', icon: Sunset, modifier: -10, description: '18:00 - 22:00' },
  night: { label: 'Night', icon: Moon, modifier: -25, description: '22:00 - 06:00' },
};

// Generate street-level risk data based on suburb safety score
const generateStreetRiskData = (suburb: { suburb_name: string; safety_score: number; ward_id: number }) => {
  const baseScore = suburb.safety_score;
  const streetPatterns = [
    { suffix: 'Main Road', modifier: 15, type: 'arterial' },
    { suffix: 'Avenue', modifier: 10, type: 'residential' },
    { suffix: 'Street', modifier: 0, type: 'residential' },
    { suffix: 'Lane', modifier: -10, type: 'side-street' },
    { suffix: 'Drive', modifier: 5, type: 'residential' },
    { suffix: 'Industrial Road', modifier: -15, type: 'industrial' },
  ];

  return streetPatterns.map((pattern, idx) => ({
    name: `${suburb.suburb_name} ${pattern.suffix}`,
    score: Math.max(0, Math.min(100, baseScore + pattern.modifier + (idx % 2 === 0 ? 5 : -5))),
    type: pattern.type,
    incidents: Math.max(0, Math.floor((100 - baseScore) / 20) + (pattern.modifier < 0 ? 2 : 0)),
    peakRiskTime: pattern.modifier < 0 ? 'night' : baseScore < 60 ? 'evening' : 'afternoon',
  }));
};

// Generate pickup/dropoff recommendations
const generatePickupGuidance = (suburb: { suburb_name: string; safety_score: number }) => {
  const recommended = [
    { location: `${suburb.suburb_name} Shopping Centre`, reason: 'Well-lit, high visibility', type: 'hub' },
    { location: 'Main road intersections', reason: 'CCTV coverage, traffic presence', type: 'road' },
    { location: '24-hour petrol stations', reason: 'Security personnel, lighting', type: 'commercial' },
    { location: 'Transport interchange', reason: 'Public presence, emergency access', type: 'hub' },
  ];

  const discouraged = suburb.safety_score < 70 ? [
    { location: 'Residential side streets', reason: 'Limited visibility after dark', risk: 'moderate' },
    { location: 'Industrial zones', reason: 'Low foot traffic, poor lighting', risk: 'high' },
    { location: 'Unlicensed taxi ranks', reason: 'Territorial disputes reported', risk: 'high' },
    { location: 'Isolated parking areas', reason: 'No CCTV coverage', risk: 'elevated' },
  ] : [
    { location: 'Poorly lit side streets', reason: 'Limited visibility', risk: 'moderate' },
    { location: 'Isolated areas after 22:00', reason: 'Reduced public presence', risk: 'moderate' },
  ];

  return { recommended, discouraged };
};

// Driver safety checklist
const DRIVER_SAFETY_CHECKLIST = [
  { id: 'lighting', icon: Lightbulb, text: 'Poor lighting or limited visibility', severity: 'high' },
  { id: 'location', icon: MapPinOff, text: 'Unusual changes to pick-up location', severity: 'high' },
  { id: 'isolated', icon: Building, text: 'Requests to stop in isolated areas', severity: 'critical' },
  { id: 'details', icon: Route, text: 'Inconsistent or vague trip details', severity: 'moderate' },
  { id: 'changes', icon: Navigation, text: 'Repeated last-minute destination changes', severity: 'high' },
  { id: 'payment', icon: CreditCard, text: 'Insistence on cash payment in high-risk areas', severity: 'elevated' },
];

// Trip acceptance guidance
const TRIP_ACCEPTANCE_TIPS = [
  { icon: CreditCard, title: 'Prefer In-App Payments', description: 'Digital payments provide transaction records and platform support access' },
  { icon: Users, title: 'Review User Ratings', description: 'Check passenger history and ratings before accepting trips in elevated-risk areas' },
  { icon: Radio, title: 'Share Trip Status', description: 'Enable trip sharing with platform safety tools and trusted contacts' },
  { icon: Eye, title: 'Verify Trip Details', description: 'Confirm pickup location matches in-app details before arrival' },
];

interface SuburbDetailCardProps {
  suburb: {
    id: string;
    suburb_name: string;
    ward_id: number;
    area_code: string;
    saps_station: string;
    saps_contact: string;
    hospital_name: string;
    hospital_contact: string;
    safety_score: number;
    cctv_coverage: number;
    incidents_24h: number;
    risk_type: string | null;
  };
  timeOfDay: TimeOfDay;
  onClose: () => void;
}

const SuburbDetailCard = ({ suburb, timeOfDay, onClose }: SuburbDetailCardProps) => {
  const timeModifier = TIME_RISK_MODIFIERS[timeOfDay];
  const adjustedScore = Math.max(0, Math.min(100, suburb.safety_score + timeModifier.modifier));
  const riskLevel = getRiskLevel(adjustedScore);
  const safetyColor = getSafetyColor(adjustedScore);
  const functioningCCTV = estimateFunctioningCCTV(suburb.cctv_coverage, suburb.safety_score);
  const streetData = generateStreetRiskData(suburb);
  const { recommended, discouraged } = generatePickupGuidance(suburb);

  const riskStyles = {
    low: { bg: 'bg-safety-good/10', border: 'border-safety-good/40', badge: 'bg-safety-good text-background' },
    moderate: { bg: 'bg-safety-moderate/10', border: 'border-safety-moderate/40', badge: 'bg-safety-moderate text-background' },
    high: { bg: 'bg-safety-poor/10', border: 'border-safety-poor/40', badge: 'bg-safety-poor text-foreground' },
    critical: { bg: 'bg-destructive/10', border: 'border-destructive/40', badge: 'bg-destructive text-destructive-foreground' },
  };

  const style = riskStyles[riskLevel];

  return (
    <div className={cn('rounded-xl border-2 overflow-hidden animate-fade-in', style.bg, style.border)}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {suburb.suburb_name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-muted-foreground">Ward {suburb.ward_id}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{suburb.area_code}</span>
              <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', style.badge)}>
                {riskLevel} Risk
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background/50 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-2xl font-black" style={{ color: safetyColor }}>{adjustedScore}</div>
            <div className="text-[10px] text-muted-foreground">Safety Score</div>
            {timeModifier.modifier !== 0 && (
              <div className={cn('text-[9px] font-medium', timeModifier.modifier > 0 ? 'text-safety-good' : 'text-destructive')}>
                {timeModifier.modifier > 0 ? '+' : ''}{timeModifier.modifier} ({timeOfDay})
              </div>
            )}
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-2xl font-black text-foreground">{suburb.incidents_24h}</div>
            <div className="text-[10px] text-muted-foreground">Incidents 24h</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-2xl font-black text-primary">{functioningCCTV}%</div>
            <div className="text-[10px] text-muted-foreground">CCTV Coverage</div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="streets" className="w-full">
        <TabsList className="w-full grid grid-cols-4 rounded-none bg-background/30 border-b border-border/30">
          <TabsTrigger value="streets" className="text-xs data-[state=active]:bg-background">Streets</TabsTrigger>
          <TabsTrigger value="pickup" className="text-xs data-[state=active]:bg-background">Pick-up</TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs data-[state=active]:bg-background">Contacts</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs data-[state=active]:bg-background">Trends</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[280px]">
          {/* Streets Tab */}
          <TabsContent value="streets" className="p-3 space-y-2 m-0">
            <div className="text-xs text-muted-foreground mb-2">Street-level risk assessment</div>
            {streetData.map((street, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getSafetyColor(street.score) }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">{street.name}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{street.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold" style={{ color: getSafetyColor(street.score) }}>{street.score}</div>
                    <div className="text-[9px] text-muted-foreground">{street.incidents} incidents</div>
                  </div>
                  <div className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                    Peak: {street.peakRiskTime}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Pickup Tab */}
          <TabsContent value="pickup" className="p-3 space-y-3 m-0">
            {/* Recommended */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-safety-good" />
                <span className="text-xs font-semibold text-safety-good uppercase">Recommended Pick-up Zones</span>
              </div>
              <div className="space-y-1.5">
                {recommended.map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-safety-good/10 border border-safety-good/20">
                    <div className="w-6 h-6 rounded bg-safety-good/20 flex items-center justify-center flex-shrink-0">
                      {loc.type === 'hub' ? <Building className="w-3 h-3 text-safety-good" /> :
                       loc.type === 'road' ? <Route className="w-3 h-3 text-safety-good" /> :
                       <Car className="w-3 h-3 text-safety-good" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground">{loc.location}</div>
                      <div className="text-[10px] text-muted-foreground">{loc.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discouraged */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-xs font-semibold text-destructive uppercase">Discouraged Zones</span>
              </div>
              <div className="space-y-1.5">
                {discouraged.map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="w-6 h-6 rounded bg-destructive/20 flex items-center justify-center flex-shrink-0">
                      <MapPinOff className="w-3 h-3 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground">{loc.location}</div>
                      <div className="text-[10px] text-muted-foreground">{loc.reason}</div>
                    </div>
                    <span className={cn(
                      'text-[9px] px-1.5 py-0.5 rounded uppercase font-medium',
                      loc.risk === 'high' || loc.risk === 'critical' ? 'bg-destructive/30 text-destructive' : 'bg-safety-poor/30 text-safety-poor'
                    )}>
                      {loc.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="p-3 space-y-2 m-0">
            <a
              href={`tel:${suburb.saps_contact}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/70 hover:bg-background transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">{suburb.saps_station}</div>
                <div className="text-[10px] text-muted-foreground">SAPS Station</div>
              </div>
              <div className="flex items-center gap-1 text-primary group-hover:scale-105 transition-transform">
                <Phone className="w-3 h-3" />
                <span className="text-xs font-mono font-bold">{suburb.saps_contact}</span>
              </div>
            </a>

            <a
              href={`tel:${suburb.hospital_contact}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/70 hover:bg-background transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Hospital className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">{suburb.hospital_name}</div>
                <div className="text-[10px] text-muted-foreground">Nearest Hospital</div>
              </div>
              <div className="flex items-center gap-1 text-destructive group-hover:scale-105 transition-transform">
                <Phone className="w-3 h-3" />
                <span className="text-xs font-mono font-bold">{suburb.hospital_contact}</span>
              </div>
            </a>

            <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Emergency:</span> Dial <span className="font-mono font-bold text-destructive">10111</span> for SAPS 
                or <span className="font-mono font-bold text-destructive">10177</span> for ambulance services.
              </div>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="p-3 space-y-3 m-0">
            <div className="text-xs text-muted-foreground mb-2">Incident trends and patterns</div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold text-foreground">{Math.round(suburb.incidents_24h * 7.2)}</div>
                <div className="text-[10px] text-muted-foreground">Weekly Avg</div>
              </div>
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <Clock className="w-4 h-4 mx-auto mb-1 text-safety-moderate" />
                <div className="text-lg font-bold text-foreground">18:00-22:00</div>
                <div className="text-[10px] text-muted-foreground">Peak Risk Hours</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-foreground">
                  <span className="font-semibold">Risk Pattern:</span> {suburb.risk_type || 'General urban risk patterns'}. 
                  Higher incident rates observed during evening hours and weekends.
                </div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

// Driver Safety Indicators Panel
const DriverSafetyIndicators = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-1">
      <ShieldAlert className="w-4 h-4 text-safety-moderate" />
      <span className="text-xs font-bold text-foreground uppercase">How to Spot Risk</span>
    </div>
    <div className="text-[11px] text-muted-foreground mb-3">
      Situational awareness indicators — not suspicion, but safety awareness.
    </div>
    <div className="space-y-2">
      {DRIVER_SAFETY_CHECKLIST.map((item) => {
        const Icon = item.icon;
        return (
          <div 
            key={item.id}
            className={cn(
              'flex items-center gap-3 p-2.5 rounded-lg border transition-colors',
              item.severity === 'critical' ? 'bg-destructive/10 border-destructive/30' :
              item.severity === 'high' ? 'bg-safety-poor/10 border-safety-poor/30' :
              item.severity === 'elevated' ? 'bg-safety-moderate/10 border-safety-moderate/30' :
              'bg-muted/50 border-border'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              item.severity === 'critical' ? 'bg-destructive/20' :
              item.severity === 'high' ? 'bg-safety-poor/20' :
              item.severity === 'elevated' ? 'bg-safety-moderate/20' :
              'bg-muted'
            )}>
              <Icon className={cn(
                'w-4 h-4',
                item.severity === 'critical' ? 'text-destructive' :
                item.severity === 'high' ? 'text-safety-poor' :
                item.severity === 'elevated' ? 'text-safety-moderate' :
                'text-muted-foreground'
              )} />
            </div>
            <span className="text-xs text-foreground">{item.text}</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto flex-shrink-0" />
          </div>
        );
      })}
    </div>
  </div>
);

// Trip Acceptance Guidance Panel
const TripAcceptanceGuidance = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-1">
      <CreditCard className="w-4 h-4 text-primary" />
      <span className="text-xs font-bold text-foreground uppercase">Trip Acceptance Best Practices</span>
    </div>
    <div className="text-[11px] text-muted-foreground mb-3">
      Guidance for informed decisions — information only, never enforcement.
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {TRIP_ACCEPTANCE_TIPS.map((tip, idx) => {
        const Icon = tip.icon;
        return (
          <div 
            key={idx}
            className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{tip.title}</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{tip.description}</p>
          </div>
        );
      })}
    </div>

    <div className="p-3 rounded-lg bg-safety-good/10 border border-safety-good/30 mt-3">
      <div className="flex items-start gap-2">
        <CheckCircle className="w-4 h-4 text-safety-good mt-0.5 flex-shrink-0" />
        <div className="text-xs text-foreground">
          <span className="font-semibold">Remember:</span> Your safety comes first. 
          Trust your instincts and don't hesitate to decline trips that feel unsafe.
        </div>
      </div>
    </div>
  </div>
);

// Main Component
const RideshareIntelPanel = () => {
  const { suburbs, loading, error } = useSuburbIntelligence();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState<typeof suburbs[0] | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [activeTab, setActiveTab] = useState('map');

  const filteredSuburbs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return suburbs.filter(suburb =>
      suburb.suburb_name.toLowerCase().includes(query) ||
      suburb.ward_id.toString().includes(query) ||
      suburb.area_code.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery, suburbs]);

  // Group suburbs by risk level
  const suburbsByRisk = useMemo(() => {
    const timeModifier = TIME_RISK_MODIFIERS[timeOfDay].modifier;
    return {
      critical: suburbs.filter(s => getRiskLevel(Math.max(0, Math.min(100, s.safety_score + timeModifier))) === 'critical'),
      high: suburbs.filter(s => getRiskLevel(Math.max(0, Math.min(100, s.safety_score + timeModifier))) === 'high'),
      moderate: suburbs.filter(s => getRiskLevel(Math.max(0, Math.min(100, s.safety_score + timeModifier))) === 'moderate'),
      low: suburbs.filter(s => getRiskLevel(Math.max(0, Math.min(100, s.safety_score + timeModifier))) === 'low'),
    };
  }, [suburbs, timeOfDay]);

  const handleSelectSuburb = (suburb: typeof suburbs[0]) => {
    setSelectedSuburb(suburb);
    setSearchQuery('');
    setIsFocused(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
          <div className="text-xs text-muted-foreground">Loading suburb intelligence...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
        <div className="text-sm text-destructive">Failed to load suburb data</div>
        <div className="text-xs text-muted-foreground mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Time Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className={cn(
            'relative bg-card rounded-xl border-2 transition-all duration-200',
            isFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
          )}>
            <div className="flex items-center px-3 py-2.5">
              <Search className={cn(
                'w-4 h-4 mr-2 transition-colors flex-shrink-0',
                isFocused ? 'text-primary' : 'text-muted-foreground'
              )} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Search suburb, ward, or area code..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded hover:bg-background transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Search Dropdown */}
          {isFocused && filteredSuburbs.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-2xl overflow-hidden z-50 animate-fade-in max-h-64 overflow-y-auto">
              {filteredSuburbs.map(suburb => {
                const adjustedScore = Math.max(0, Math.min(100, suburb.safety_score + TIME_RISK_MODIFIERS[timeOfDay].modifier));
                return (
                  <button
                    key={suburb.id}
                    onClick={() => handleSelectSuburb(suburb)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-background transition-colors text-left border-b border-border/30 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">{suburb.suburb_name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        Ward {suburb.ward_id} • {suburb.area_code}
                      </div>
                    </div>
                    <div 
                      className="text-lg font-bold"
                      style={{ color: getSafetyColor(adjustedScore) }}
                    >
                      {adjustedScore}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {isFocused && searchQuery && filteredSuburbs.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-2xl p-4 text-center z-50 animate-fade-in">
              <MapPin className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">No suburbs found for "{searchQuery}"</div>
            </div>
          )}
        </div>

        {/* Time of Day Toggle */}
        <div className="flex items-center gap-1 p-1 bg-card rounded-xl border border-border">
          {(Object.entries(TIME_RISK_MODIFIERS) as [TimeOfDay, TimeRiskModifier][]).map(([key, value]) => {
            const Icon = value.icon;
            return (
              <button
                key={key}
                onClick={() => setTimeOfDay(key)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                  timeOfDay === key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background'
                )}
                title={value.description}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{value.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-card border border-border">
          <TabsTrigger value="map" className="text-xs">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            Areas
          </TabsTrigger>
          <TabsTrigger value="guidance" className="text-xs">
            <Navigation className="w-3.5 h-3.5 mr-1.5" />
            Guidance
          </TabsTrigger>
          <TabsTrigger value="safety" className="text-xs">
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
            Safety
          </TabsTrigger>
          <TabsTrigger value="tips" className="text-xs">
            <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
            Tips
          </TabsTrigger>
        </TabsList>

        {/* Areas Tab */}
        <TabsContent value="map" className="mt-4 space-y-4">
          {selectedSuburb ? (
            <SuburbDetailCard 
              suburb={selectedSuburb} 
              timeOfDay={timeOfDay}
              onClose={() => setSelectedSuburb(null)} 
            />
          ) : (
            <>
              {/* Risk Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
                  <div className="text-2xl font-black text-destructive">{suburbsByRisk.critical.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Critical</div>
                </div>
                <div className="p-3 rounded-lg bg-safety-poor/10 border border-safety-poor/30 text-center">
                  <div className="text-2xl font-black text-safety-poor">{suburbsByRisk.high.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">High Risk</div>
                </div>
                <div className="p-3 rounded-lg bg-safety-moderate/10 border border-safety-moderate/30 text-center">
                  <div className="text-2xl font-black text-safety-moderate">{suburbsByRisk.moderate.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Moderate</div>
                </div>
                <div className="p-3 rounded-lg bg-safety-good/10 border border-safety-good/30 text-center">
                  <div className="text-2xl font-black text-safety-good">{suburbsByRisk.low.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Low Risk</div>
                </div>
              </div>

              {/* High Risk Areas Quick Access */}
              {suburbsByRisk.critical.length > 0 && (
                <div>
                  <div className="text-[10px] text-destructive uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    Critical Risk Areas
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suburbsByRisk.critical.slice(0, 8).map(suburb => (
                      <button
                        key={suburb.id}
                        onClick={() => handleSelectSuburb(suburb)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-all"
                      >
                        {suburb.suburb_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suburbsByRisk.high.length > 0 && (
                <div>
                  <div className="text-[10px] text-safety-poor uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    High Risk Areas
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suburbsByRisk.high.slice(0, 8).map(suburb => (
                      <button
                        key={suburb.id}
                        onClick={() => handleSelectSuburb(suburb)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-safety-poor/20 text-safety-poor border border-safety-poor/30 hover:bg-safety-poor/30 transition-all"
                      >
                        {suburb.suburb_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ward Summary */}
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Geographic Coverage:</span> {suburbs.length} suburbs across {
                      new Set(suburbs.map(s => s.ward_id)).size
                    } wards. Risk scores adjusted for {TIME_RISK_MODIFIERS[timeOfDay].label.toLowerCase()} ({TIME_RISK_MODIFIERS[timeOfDay].description}).
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Guidance Tab */}
        <TabsContent value="guidance" className="mt-4">
          <TripAcceptanceGuidance />
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="mt-4">
          <DriverSafetyIndicators />
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="mt-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-safety-moderate" />
            <span className="text-xs font-bold text-foreground uppercase">General Safety Tips</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-xs font-semibold text-foreground mb-1">Before the Trip</div>
              <ul className="text-[11px] text-muted-foreground space-y-1">
                <li>• Verify passenger details match app information</li>
                <li>• Confirm pickup location is safe and well-lit</li>
                <li>• Share trip details with trusted contacts</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-xs font-semibold text-foreground mb-1">During the Trip</div>
              <ul className="text-[11px] text-muted-foreground space-y-1">
                <li>• Keep doors locked at all times</li>
                <li>• Use navigation apps for route guidance</li>
                <li>• Stay alert to passenger behavior changes</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-xs font-semibold text-foreground mb-1">Payment & Drop-off</div>
              <ul className="text-[11px] text-muted-foreground space-y-1">
                <li>• Prefer in-app digital payments</li>
                <li>• Drop off in well-lit, visible areas</li>
                <li>• Complete trip in app before passenger exits</li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border mt-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Platform Resources:</span> Most e-hailing platforms offer 
                emergency buttons, trip sharing, and 24/7 support. Familiarize yourself with these features.
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RideshareIntelPanel;
