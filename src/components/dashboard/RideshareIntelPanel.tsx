import { useState, useMemo } from 'react';
import { Search, MapPin, Phone, Hospital, Shield, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSuburbIntelligence, getRiskLevel, getSafetyColor } from '@/hooks/useSuburbIntelligence';

interface SuburbStatsCardProps {
  suburb: {
    suburb_name: string;
    ward_id: number;
    saps_station: string;
    saps_contact: string;
    hospital_name: string;
    hospital_contact: string;
    safety_score: number;
    incidents_24h: number;
  };
  onClose: () => void;
}

const SuburbStatsCard = ({ suburb, onClose }: SuburbStatsCardProps) => {
  const riskLevel = getRiskLevel(suburb.safety_score);
  const safetyColor = getSafetyColor(suburb.safety_score);

  const riskStyles = {
    low: { bg: 'bg-safety-good/20', border: 'border-safety-good/50', badge: 'bg-safety-good text-background' },
    moderate: { bg: 'bg-safety-moderate/20', border: 'border-safety-moderate/50', badge: 'bg-safety-moderate text-background' },
    high: { bg: 'bg-safety-poor/20', border: 'border-safety-poor/50', badge: 'bg-safety-poor text-foreground' },
    critical: { bg: 'bg-destructive/20', border: 'border-destructive/50', badge: 'bg-destructive text-destructive-foreground' },
  };

  const style = riskStyles[riskLevel];

  return (
    <div className={cn('rounded-xl border-2 p-4 animate-fade-in', style.bg, style.border)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{suburb.suburb_name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Ward {suburb.ward_id}</span>
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', style.badge)}>
              {riskLevel} Risk
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-background/50 transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Safety Score */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-background/50">
        <div 
          className="text-3xl font-black"
          style={{ color: safetyColor }}
        >
          {suburb.safety_score}
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">Safety Score</div>
          <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${suburb.safety_score}%`, backgroundColor: safetyColor }}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{suburb.incidents_24h}</div>
          <div className="text-[10px] text-muted-foreground">Incidents 24h</div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* SAPS Contact */}
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

        {/* Hospital Contact */}
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
      </div>

      {/* Rideshare Tip */}
      <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-foreground">
            <span className="font-semibold">E-hailing Tip:</span> Always share your trip with a trusted contact. 
            Verify driver details before entering the vehicle.
          </div>
        </div>
      </div>
    </div>
  );
};

// Generate rideshare zones based on safety score
const generateRideshareZones = (suburb: { suburb_name: string; safety_score: number; ward_id: number }) => {
  const safeZones: string[] = [];
  const highRiskZones: string[] = [];
  
  if (suburb.safety_score >= 70) {
    safeZones.push(`${suburb.suburb_name} Main Road`, `${suburb.suburb_name} Shopping Centre`, 'Well-lit Intersections');
    highRiskZones.push('Isolated side streets after dark');
  } else if (suburb.safety_score >= 50) {
    safeZones.push('Major petrol stations', 'Shopping centres', 'Police station vicinity');
    highRiskZones.push('Residential backroads', 'Unlit parking areas', 'Industrial zones');
  } else {
    safeZones.push('Police station only', 'Hospital entrance', '24h petrol stations');
    highRiskZones.push('Most residential areas', 'After sunset pickups', 'Isolated locations', 'Unlicensed taxi ranks');
  }
  
  return { safeZones, highRiskZones };
};

interface RideshareZonesProps {
  suburb: {
    suburb_name: string;
    safety_score: number;
    ward_id: number;
  };
}

const RideshareZones = ({ suburb }: RideshareZonesProps) => {
  const { safeZones, highRiskZones } = generateRideshareZones(suburb);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {/* Safe Zones */}
      <div className="p-3 rounded-lg bg-safety-good/10 border border-safety-good/30">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-safety-good" />
          <span className="text-xs font-bold text-safety-good uppercase">Safe Pick-up Zones</span>
        </div>
        <ul className="space-y-1">
          {safeZones.map((zone, idx) => (
            <li key={idx} className="text-xs text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-safety-good" />
              {zone}
            </li>
          ))}
        </ul>
      </div>

      {/* High Risk Zones */}
      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-xs font-bold text-destructive uppercase">High-Risk Zones</span>
        </div>
        <ul className="space-y-1">
          {highRiskZones.map((zone, idx) => (
            <li key={idx} className="text-xs text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              {zone}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RideshareIntelPanel = () => {
  const { suburbs, loading, error } = useSuburbIntelligence();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState<typeof suburbs[0] | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuburbs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return suburbs.filter(suburb =>
      suburb.suburb_name.toLowerCase().includes(query) ||
      suburb.ward_id.toString().includes(query) ||
      suburb.area_code.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery, suburbs]);

  const quickAccessSuburbs = useMemo(() => {
    return suburbs
      .sort((a, b) => a.safety_score - b.safety_score)
      .slice(0, 6);
  }, [suburbs]);

  const handleSelectSuburb = (suburb: typeof suburbs[0]) => {
    setSelectedSuburb(suburb);
    setSearchQuery('');
    setIsFocused(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive text-sm">
        Failed to load suburb data
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className={cn(
          'relative bg-card rounded-xl border-2 transition-all duration-200',
          isFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
        )}>
          <div className="flex items-center px-3 py-2.5">
            <Search className={cn(
              'w-4 h-4 mr-2 transition-colors',
              isFocused ? 'text-primary' : 'text-muted-foreground'
            )} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search by suburb or ward number..."
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

        {/* Search Results Dropdown */}
        {isFocused && filteredSuburbs.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-2xl overflow-hidden z-50 animate-fade-in max-h-64 overflow-y-auto">
            {filteredSuburbs.map(suburb => (
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
                  style={{ color: getSafetyColor(suburb.safety_score) }}
                >
                  {suburb.safety_score}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isFocused && searchQuery && filteredSuburbs.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-2xl p-4 text-center z-50 animate-fade-in">
            <MapPin className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <div className="text-xs text-muted-foreground">No suburbs found for "{searchQuery}"</div>
          </div>
        )}
      </div>

      {/* Selected Suburb Card */}
      {selectedSuburb && (
        <>
          <SuburbStatsCard 
            suburb={selectedSuburb} 
            onClose={() => setSelectedSuburb(null)} 
          />
          <RideshareZones suburb={selectedSuburb} />
        </>
      )}

      {/* Quick Access Pills */}
      {!selectedSuburb && (
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">
            High-Risk Areas (Quick Access)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickAccessSuburbs.map(suburb => (
              <button
                key={suburb.id}
                onClick={() => handleSelectSuburb(suburb)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105',
                  suburb.safety_score < 40 
                    ? 'bg-destructive/20 text-destructive border border-destructive/30'
                    : suburb.safety_score < 60
                    ? 'bg-safety-poor/20 text-safety-poor border border-safety-poor/30'
                    : 'bg-safety-moderate/20 text-foreground border border-safety-moderate/30'
                )}
              >
                {suburb.suburb_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Banner */}
      {!selectedSuburb && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Why this matters:</span> E-hailing safety data helps 
              drivers and passengers make informed decisions. Always verify driver credentials and share trip details 
              with trusted contacts.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideshareIntelPanel;
