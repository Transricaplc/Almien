import { useState, useMemo } from 'react';
import { Search, MapPin, X, Mountain, Loader2, Waves, FileWarning, Radio } from 'lucide-react';
import { useSuburbIntelligence, SuburbIntelligence, getSafetyColor } from '@/hooks/useSuburbIntelligence';
import SectorReport from './SectorReport';
import TouristProtocolsPanel from './TouristProtocolsPanel';
import WaterUtilityPanel from './WaterUtilityPanel';
import WeatherPanel from './WeatherPanel';
import HikingTrailsPanel from './HikingTrailsPanel';
import CitizenReportModal from './CitizenReportModal';
import LiveReportFeed from './LiveReportFeed';
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
  const [reportModalOpen, setReportModalOpen] = useState(false);

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
    <div className="h-full flex flex-col space-y-2.5 overflow-hidden">
      {/* Report Button - Compact, 1-tap */}
      <button
        onClick={() => setReportModalOpen(true)}
        className="flex-shrink-0 flex items-center justify-center gap-2 w-full py-2 rounded-lg font-tactical text-xs font-bold tracking-wide bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 active:scale-[0.98] transition-all"
      >
        <FileWarning className="w-3.5 h-3.5" />
        REPORT
      </button>

      {/* Search Section - Compact */}
      <div className="flex-shrink-0 relative">
        <div className={cn(
          'relative bg-card/60 backdrop-blur-sm rounded-lg border transition-all duration-150',
          isFocused ? 'border-primary/60 shadow-md shadow-primary/10' : 'border-border/40'
        )}>
          <div className="flex items-center px-3 py-2">
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 text-primary animate-spin" />
            ) : (
              <Search className={cn(
                'w-4 h-4 mr-2 transition-colors',
                isFocused ? 'text-primary' : 'text-muted-foreground'
              )} />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Find suburb..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/70 outline-none text-xs font-mono"
              disabled={loading}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 rounded hover:bg-background/50 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown - Compact */}
        {isFocused && filteredSuburbs.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-lg rounded-lg border border-primary/25 shadow-xl overflow-hidden z-50 animate-fade-in">
            {filteredSuburbs.map(suburb => (
              <button
                key={suburb.id}
                onClick={() => handleSelectSuburb(suburb)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary/10 transition-colors text-left border-b border-border/20 last:border-b-0"
              >
                <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-xs truncate">{suburb.suburb_name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    W{suburb.ward_id} • {suburb.incidents_24h} today
                  </div>
                </div>
                <div 
                  className="text-sm font-black font-mono tabular-nums"
                  style={{ color: getSafetyColor(suburb.safety_score) }}
                >
                  {suburb.safety_score}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results - Compact */}
        {isFocused && searchQuery && filteredSuburbs.length === 0 && !loading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-lg rounded-lg border border-border/50 shadow-lg p-3 text-center z-50 animate-fade-in">
            <MapPin className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">No results for "{searchQuery}"</div>
          </div>
        )}
      </div>

      {/* Quick Access Pills - Compact */}
      {!selectedSuburb && !loading && (
        <div className="flex-shrink-0 flex flex-wrap gap-1.5">
          {quickAccessSuburbs.map(suburb => (
            <button
              key={suburb.id}
              onClick={() => handleSelectSuburb(suburb)}
              className="px-2 py-1 rounded text-[10px] font-mono font-medium bg-card/40 border border-border/40 hover:border-primary/40 hover:bg-primary/10 active:scale-95 transition-all"
            >
              {suburb.suburb_name}
            </button>
          ))}
        </div>
      )}

      {/* Loading State for Pills */}
      {!selectedSuburb && loading && (
        <div className="flex-shrink-0 flex flex-wrap gap-1.5">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="px-2 py-1 rounded bg-card/20 border border-border/20 animate-pulse w-16 h-5"
            />
          ))}
        </div>
      )}

      {/* Scrollable Content Area - Tighter spacing */}
      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pb-4">
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

        {/* Tourism & Reports Tabs - Compact */}
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="w-full h-8 bg-card/40 border border-border/40">
            <TabsTrigger value="reports" className="flex-1 text-[10px] h-6 data-[state=active]:bg-primary/20">
              <Radio className="w-2.5 h-2.5 mr-1" /> Feed
            </TabsTrigger>
            <TabsTrigger value="trails" className="flex-1 text-[10px] h-6 data-[state=active]:bg-primary/20">
              <Mountain className="w-2.5 h-2.5 mr-1" /> Trails
            </TabsTrigger>
            <TabsTrigger value="guidelines" className="flex-1 text-[10px] h-6 data-[state=active]:bg-primary/20">
              <Waves className="w-2.5 h-2.5 mr-1" /> Safety
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reports" className="mt-1.5">
            <LiveReportFeed />
          </TabsContent>
          <TabsContent value="trails" className="mt-1.5">
            <HikingTrailsPanel />
          </TabsContent>
          <TabsContent value="guidelines" className="mt-1.5">
            <TouristProtocolsPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* Citizen Report Modal */}
      <CitizenReportModal open={reportModalOpen} onOpenChange={setReportModalOpen} />
    </div>
  );
};

export default IntelligenceSidebar;
