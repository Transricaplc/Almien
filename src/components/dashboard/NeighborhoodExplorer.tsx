import { useState, useMemo } from 'react';
import { 
  Search, MapPin, Shield, AlertTriangle, TrendingDown, TrendingUp,
  ChevronRight, Users, Eye, Building, Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNeighborhoodRatings, getCrimeRateColor, getCrimeRateLabel, getSafetyScoreColor, getSafetyScoreLabel } from '@/hooks/useNeighborhoodRatings';
import { useSafeZones } from '@/hooks/useSafeZones';
import { CardSkeleton } from './LoadingStates';
import { Progress } from '@/components/ui/progress';

interface NeighborhoodExplorerProps {
  onSelectNeighborhood?: (neighborhood: string) => void;
}

const NeighborhoodExplorer = ({ onSelectNeighborhood }: NeighborhoodExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  
  const { data: neighborhoods, isLoading } = useNeighborhoodRatings();
  const { data: safeZones } = useSafeZones();

  const filteredNeighborhoods = useMemo(() => {
    if (!neighborhoods) return [];
    if (!searchQuery) return neighborhoods;
    return neighborhoods.filter(n => 
      n.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [neighborhoods, searchQuery]);

  const selected = useMemo(() => {
    if (!selectedNeighborhood || !neighborhoods) return null;
    return neighborhoods.find(n => n.neighborhood === selectedNeighborhood);
  }, [selectedNeighborhood, neighborhoods]);

  const neighborhoodSafeZones = useMemo(() => {
    if (!selected || !safeZones) return [];
    return safeZones.filter(z => z.neighborhood === selected.neighborhood);
  }, [selected, safeZones]);

  const handleSelect = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    onSelectNeighborhood?.(neighborhood);
  };

  if (isLoading) {
    return <CardSkeleton className="h-96" />;
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Neighborhood Explorer</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Search and explore Cape Town neighborhoods with safety data
        </p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search neighborhoods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Neighborhood List */}
        <div className="w-1/2 border-r border-border overflow-auto">
          <div className="divide-y divide-border">
            {filteredNeighborhoods.map((n) => (
              <button
                key={n.id}
                onClick={() => handleSelect(n.neighborhood)}
                className={cn(
                  'w-full px-3 py-2.5 text-left transition-colors hover:bg-muted/50',
                  selectedNeighborhood === n.neighborhood && 'bg-primary/10 border-l-2 border-l-primary'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getSafetyScoreColor(Number(n.safety_score)) }}
                    />
                    <span className="font-medium text-sm truncate">{n.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-mono px-1.5 py-0.5 rounded"
                      style={{ 
                        backgroundColor: `${getSafetyScoreColor(Number(n.safety_score))}20`,
                        color: getSafetyScoreColor(Number(n.safety_score))
                      }}
                    >
                      {Number(n.safety_score).toFixed(1)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ 
                      backgroundColor: `${getCrimeRateColor(n.crime_rate)}20`,
                      color: getCrimeRateColor(n.crime_rate)
                    }}
                  >
                    {getCrimeRateLabel(n.crime_rate)} Crime
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {n.crime_count_30d} incidents/30d
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-1/2 overflow-auto p-3">
          {selected ? (
            <div className="space-y-4">
              {/* Header */}
              <div>
                <h4 className="text-lg font-bold">{selected.neighborhood}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="text-sm font-semibold px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${getSafetyScoreColor(Number(selected.safety_score))}20`,
                      color: getSafetyScoreColor(Number(selected.safety_score))
                    }}
                  >
                    {getSafetyScoreLabel(Number(selected.safety_score))}
                  </span>
                </div>
              </div>

              {/* Safety Score */}
              <div className="bg-background/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Safety Score
                  </span>
                  <span 
                    className="text-2xl font-black"
                    style={{ color: getSafetyScoreColor(Number(selected.safety_score)) }}
                  >
                    {Number(selected.safety_score).toFixed(1)}/5
                  </span>
                </div>
                <Progress 
                  value={Number(selected.safety_score) * 20} 
                  className="h-2"
                />
              </div>

              {/* Crime Stats */}
              <div className="bg-background/50 rounded-lg p-3">
                <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Crime Statistics (30 days)
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-card/50 rounded-lg p-2">
                    <div className="text-[10px] text-muted-foreground">Total Incidents</div>
                    <div className="text-lg font-bold">{selected.crime_count_30d}</div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-2">
                    <div className="text-[10px] text-muted-foreground">Robbery</div>
                    <div className="text-lg font-bold text-orange-500">{selected.robbery_count}</div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-2">
                    <div className="text-[10px] text-muted-foreground">Assault</div>
                    <div className="text-lg font-bold text-red-500">{selected.assault_count}</div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-2">
                    <div className="text-[10px] text-muted-foreground">Burglary</div>
                    <div className="text-lg font-bold text-amber-500">{selected.burglary_count}</div>
                  </div>
                </div>
              </div>

              {/* Nearby Safe Zones */}
              {neighborhoodSafeZones.length > 0 && (
                <div className="bg-background/50 rounded-lg p-3">
                  <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Safe Zones Nearby
                  </h5>
                  <div className="space-y-1.5">
                    {neighborhoodSafeZones.slice(0, 4).map(zone => (
                      <div key={zone.id} className="flex items-center justify-between text-xs">
                        <span className="truncate">{zone.name}</span>
                        <span className="text-muted-foreground capitalize">
                          {zone.zone_type.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select a neighborhood to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodExplorer;
