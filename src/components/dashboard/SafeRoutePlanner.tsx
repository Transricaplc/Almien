import { useState, useMemo } from 'react';
import { 
  Navigation, MapPin, Shield, AlertTriangle, Clock, 
  Route, Car, PersonStanding, Bike, ChevronDown, ChevronUp,
  Phone, Building, ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNeighborhoodRatings, getSafetyScoreColor, getSafetyScoreLabel, getCrimeRateColor } from '@/hooks/useNeighborhoodRatings';
import { useSafeZones } from '@/hooks/useSafeZones';
import { CardSkeleton } from './LoadingStates';

interface RouteSegment {
  neighborhood: string;
  safetyScore: number;
  crimeRate: string;
  distance: string;
  warning?: string;
}

const SafeRoutePlanner = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [showRoute, setShowRoute] = useState(false);
  const [transportMode, setTransportMode] = useState<'car' | 'walk' | 'bike'>('car');
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);
  const [tacticalRouting, setTacticalRouting] = useState(false);

  const { data: neighborhoods, isLoading: loadingNeighborhoods } = useNeighborhoodRatings();
  const { data: safeZones, isLoading: loadingZones } = useSafeZones();

  // Generate mock route based on start/end neighborhoods
  const routeSegments = useMemo((): RouteSegment[] => {
    if (!showRoute || !neighborhoods || !startLocation || !endLocation) return [];
    
    // Find matching neighborhoods
    const startMatch = neighborhoods.find(n => 
      n.neighborhood.toLowerCase().includes(startLocation.toLowerCase())
    );
    const endMatch = neighborhoods.find(n => 
      n.neighborhood.toLowerCase().includes(endLocation.toLowerCase())
    );

    if (!startMatch || !endMatch) {
      return [];
    }

    // Create a simplified route (in real app, would use OpenRouteService)
    const segments: RouteSegment[] = [
      {
        neighborhood: startMatch.neighborhood,
        safetyScore: Number(startMatch.safety_score),
        crimeRate: startMatch.crime_rate,
        distance: '0 km',
      }
    ];

    // Add intermediate neighborhoods based on safety score difference
    const middleNeighborhoods = neighborhoods
      .filter(n => n.neighborhood !== startMatch.neighborhood && n.neighborhood !== endMatch.neighborhood)
      .sort((a, b) => {
        if (tacticalRouting) {
          // Tactical: prefer highest safety scores (near police, low crime)
          return Number(b.safety_score) - Number(a.safety_score);
        }
        return Number(b.safety_score) - Number(a.safety_score);
      })
      .slice(0, tacticalRouting ? 3 : 2);

    middleNeighborhoods.forEach((n, i) => {
      segments.push({
        neighborhood: n.neighborhood,
        safetyScore: Number(n.safety_score),
        crimeRate: n.crime_rate,
        distance: `${(i + 1) * 2.5} km`,
        warning: Number(n.safety_score) < 2.5 ? 'High crime area - exercise caution' : undefined
      });
    });

    segments.push({
      neighborhood: endMatch.neighborhood,
      safetyScore: Number(endMatch.safety_score),
      crimeRate: endMatch.crime_rate,
      distance: `${(middleNeighborhoods.length + 1) * 2.5} km`,
    });

    return segments;
  }, [showRoute, neighborhoods, startLocation, endLocation, tacticalRouting]);

  const routeStats = useMemo(() => {
    if (routeSegments.length === 0) return null;
    
    const avgSafety = routeSegments.reduce((sum, s) => sum + s.safetyScore, 0) / routeSegments.length;
    const dangerZones = routeSegments.filter(s => s.safetyScore < 2.5).length;
    const totalDistance = parseFloat(routeSegments[routeSegments.length - 1]?.distance || '0');
    const estimatedTime = transportMode === 'car' 
      ? Math.ceil(totalDistance * 3) 
      : transportMode === 'bike'
        ? Math.ceil(totalDistance * 5)
        : Math.ceil(totalDistance * 12);

    return { avgSafety, dangerZones, totalDistance, estimatedTime };
  }, [routeSegments, transportMode]);

  // Get safe zones along route
  const routeSafeZones = useMemo(() => {
    if (!safeZones || routeSegments.length === 0) return [];
    const routeNeighborhoods = routeSegments.map(s => s.neighborhood);
    return safeZones.filter(z => routeNeighborhoods.includes(z.neighborhood || ''));
  }, [safeZones, routeSegments]);

  const handlePlanRoute = () => {
    if (startLocation && endLocation) {
      setShowRoute(true);
    }
  };

  if (loadingNeighborhoods || loadingZones) {
    return <CardSkeleton className="h-96" />;
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-transparent px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-foreground">Safe Route Planner</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Plan routes avoiding high-crime areas
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Transport Mode */}
        <div className="flex gap-2">
          {[
            { mode: 'car', icon: Car, label: 'Drive' },
            { mode: 'walk', icon: PersonStanding, label: 'Walk' },
            { mode: 'bike', icon: Bike, label: 'Cycle' },
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setTransportMode(mode as 'car' | 'walk' | 'bike')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                transportMode === mode 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tactical Routing Toggle */}
        <button
          onClick={() => { setTacticalRouting(!tacticalRouting); setShowRoute(false); }}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border',
            tacticalRouting
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Tactical Routing</span>
          <span className="ml-auto text-[10px] opacity-70">
            {tacticalRouting ? 'ON — Safest path' : 'OFF'}
          </span>
        </button>

        {/* Location Inputs */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full" />
            <Input
              placeholder="Start location (e.g., Sea Point)"
              value={startLocation}
              onChange={(e) => { setStartLocation(e.target.value); setShowRoute(false); }}
              className="pl-8"
              list="neighborhoods-start"
            />
            <datalist id="neighborhoods-start">
              {neighborhoods?.map(n => (
                <option key={n.id} value={n.neighborhood} />
              ))}
            </datalist>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
            <Input
              placeholder="End location (e.g., CBD)"
              value={endLocation}
              onChange={(e) => { setEndLocation(e.target.value); setShowRoute(false); }}
              className="pl-8"
              list="neighborhoods-end"
            />
            <datalist id="neighborhoods-end">
              {neighborhoods?.map(n => (
                <option key={n.id} value={n.neighborhood} />
              ))}
            </datalist>
          </div>
        </div>

        <Button 
          onClick={handlePlanRoute}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={!startLocation || !endLocation}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Calculate Safe Route
        </Button>

        {/* Route Results */}
        {showRoute && routeStats && (
          <div className="space-y-3 pt-2 border-t border-border">
            {/* Route Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background/50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-muted-foreground">Distance</div>
                <div className="text-sm font-bold">{routeStats.totalDistance} km</div>
              </div>
              <div className="bg-background/50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-muted-foreground">Est. Time</div>
                <div className="text-sm font-bold">{routeStats.estimatedTime} min</div>
              </div>
              <div className="bg-background/50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-muted-foreground">Safety</div>
                <div 
                  className="text-sm font-bold"
                  style={{ color: getSafetyScoreColor(routeStats.avgSafety) }}
                >
                  {routeStats.avgSafety.toFixed(1)}/5
                </div>
              </div>
            </div>

            {/* Danger Warning */}
            {routeStats.dangerZones > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-500">
                    {routeStats.dangerZones} high-risk area{routeStats.dangerZones > 1 ? 's' : ''} on route
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Consider alternative routes or travel during daylight hours
                  </div>
                </div>
              </div>
            )}

            {/* Route Segments */}
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Route Segments
              </h4>
              {routeSegments.map((segment, idx) => (
                <div key={idx} className="bg-background/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSegment(expandedSegment === idx ? null : idx)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getSafetyScoreColor(segment.safetyScore) }}
                      />
                      <span className="text-sm font-medium">{segment.neighborhood}</span>
                      {segment.warning && (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ 
                          backgroundColor: `${getSafetyScoreColor(segment.safetyScore)}20`,
                          color: getSafetyScoreColor(segment.safetyScore)
                        }}
                      >
                        {segment.safetyScore.toFixed(1)}
                      </span>
                      {expandedSegment === idx ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  {expandedSegment === idx && (
                    <div className="px-3 pb-2 space-y-2 animate-fade-in">
                      <div className="text-xs text-muted-foreground">
                        <span 
                          className="px-1.5 py-0.5 rounded mr-2"
                          style={{ 
                            backgroundColor: `${getCrimeRateColor(segment.crimeRate)}20`,
                            color: getCrimeRateColor(segment.crimeRate)
                          }}
                        >
                          {segment.crimeRate.replace('_', ' ')} crime
                        </span>
                        {segment.distance} from start
                      </div>
                      {segment.warning && (
                        <div className="text-xs text-amber-500">
                          ⚠️ {segment.warning}
                        </div>
                      )}
                      {/* Safe zones in this area */}
                      {routeSafeZones.filter(z => z.neighborhood === segment.neighborhood).length > 0 && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Safe zones: </span>
                          {routeSafeZones
                            .filter(z => z.neighborhood === segment.neighborhood)
                            .slice(0, 2)
                            .map(z => z.name)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Emergency Contacts Along Route */}
            {routeSafeZones.filter(z => z.zone_type === 'police_station').length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <h5 className="text-xs font-medium text-blue-400 mb-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Police Stations Along Route
                </h5>
                <div className="space-y-1">
                  {routeSafeZones
                    .filter(z => z.zone_type === 'police_station')
                    .slice(0, 3)
                    .map(z => (
                      <div key={z.id} className="flex items-center justify-between text-xs">
                        <span>{z.name}</span>
                        <a 
                          href={`tel:${z.contact_number?.replace(/\s/g, '')}`}
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {z.contact_number}
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafeRoutePlanner;
