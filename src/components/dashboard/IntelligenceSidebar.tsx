import { useState, useMemo } from 'react';
import { Search, MapPin, X, ChevronDown, ChevronUp, Mountain, Loader2, Droplet, Zap, Cloud, Plane, Waves } from 'lucide-react';
import { useSuburbIntelligence, SuburbIntelligence, getSafetyColor } from '@/hooks/useSuburbIntelligence';
import SectorReport from './SectorReport';
import TouristProtocolsPanel from './TouristProtocolsPanel';
import WaterUtilityPanel from './WaterUtilityPanel';
import WeatherPanel from './WeatherPanel';
import HikingTrailsPanel from './HikingTrailsPanel';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface IntelligenceSidebarProps {
  onSuburbSelect?: (suburb: SuburbIntelligence | null) => void;
}

const IntelligenceSidebar = ({ onSuburbSelect }: IntelligenceSidebarProps) => {
  const { suburbs, loading, error, searchSuburbs } = useSuburbIntelligence();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbIntelligence | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const filteredSuburbs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchSuburbs(searchQuery);
  }, [searchQuery, searchSuburbs]);

  const handleSelectSuburb = (suburb: SuburbIntelligence) => {
    setSelectedSuburb(suburb);
    setSearchQuery('');
    setIsFocused(false);
    onSuburbSelect?.(suburb);
  };

  const handleCloseSuburb = () => {
    setSelectedSuburb(null);
    onSuburbSelect?.(null);
  };

  // Quick access suburbs - mix of high and low safety areas
  const quickAccessSuburbs = useMemo(() => {
    return [
      suburbs.find(s => s.id === 'ottery'),
      suburbs.find(s => s.id === 'sea-point'),
      suburbs.find(s => s.id === 'claremont'),
      suburbs.find(s => s.id === 'khayelitsha'),
      suburbs.find(s => s.id === 'camps-bay'),
    ].filter(Boolean) as SuburbIntelligence[];
  }, [suburbs]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-destructive text-sm font-mono mb-2">DATABASE ERROR</div>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Search Section */}
      <div className="flex-shrink-0 relative">
        <div className={cn(
          'relative bg-card/80 backdrop-blur-md rounded-xl border-2 transition-all duration-200',
          isFocused ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/50'
        )}>
          <div className="flex items-center px-4 py-3">
            {loading ? (
              <Loader2 className="w-5 h-5 mr-3 text-primary animate-spin" />
            ) : (
              <Search className={cn(
                'w-5 h-5 mr-3 transition-colors',
                isFocused ? 'text-primary' : 'text-muted-foreground'
              )} />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search suburb (e.g., Ottery, Claremont...)"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm font-mono"
              disabled={loading}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded hover:bg-background transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isFocused && filteredSuburbs.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl rounded-xl border-2 border-primary/30 shadow-2xl overflow-hidden z-50 animate-fade-in">
            {filteredSuburbs.map(suburb => (
              <button
                key={suburb.id}
                onClick={() => handleSelectSuburb(suburb)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left border-b border-border/30 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">{suburb.suburb_name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Ward {suburb.ward_id} • {suburb.incidents_24h} incidents today
                  </div>
                </div>
                <div 
                  className="text-xl font-black font-mono tabular-nums"
                  style={{ color: getSafetyColor(suburb.safety_score) }}
                >
                  {suburb.safety_score}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isFocused && searchQuery && filteredSuburbs.length === 0 && !loading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl rounded-xl border-2 border-border shadow-2xl p-4 text-center z-50 animate-fade-in">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">No suburbs found for "{searchQuery}"</div>
          </div>
        )}
      </div>

      {/* Quick Access Pills */}
      {!selectedSuburb && !loading && (
        <div className="flex-shrink-0 flex flex-wrap gap-2">
          {quickAccessSuburbs.map(suburb => (
            <button
              key={suburb.id}
              onClick={() => handleSelectSuburb(suburb)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all',
                'bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/10',
                'hover:scale-105 active:scale-95'
              )}
            >
              {suburb.suburb_name}
            </button>
          ))}
        </div>
      )}

      {/* Loading State for Pills */}
      {!selectedSuburb && loading && (
        <div className="flex-shrink-0 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="px-3 py-1.5 rounded-lg bg-card/30 border border-border/30 animate-pulse w-20 h-7"
            />
          ))}
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pb-4">
        {/* Sector Report Card (connected to Supabase) */}
        <SectorReport 
          suburb={selectedSuburb} 
          onClose={handleCloseSuburb}
          loading={loading && !!searchQuery}
        />

        {/* Weather Panel */}
        <WeatherPanel />

        {/* Water Utility Panel */}
        <WaterUtilityPanel />

        {/* Tourism Tabs */}
        <Tabs defaultValue="trails" className="w-full">
          <TabsList className="w-full bg-card/50 border border-border/50">
            <TabsTrigger value="trails" className="flex-1 text-xs data-[state=active]:bg-primary/20">
              <Mountain className="w-3 h-3 mr-1" /> Trails
            </TabsTrigger>
            <TabsTrigger value="guidelines" className="flex-1 text-xs data-[state=active]:bg-primary/20">
              <Waves className="w-3 h-3 mr-1" /> Safety
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trails" className="mt-2">
            <HikingTrailsPanel />
          </TabsContent>
          <TabsContent value="guidelines" className="mt-2">
            <TouristProtocolsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntelligenceSidebar;
