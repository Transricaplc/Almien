import { useState, useMemo } from 'react';
import { Search, MapPin, X, Mountain, Loader2, Waves, Radio, Network, Activity, Maximize2 } from 'lucide-react';
import { useSuburbIntelligence, SuburbIntelligence, getSafetyColor } from '@/hooks/useSuburbIntelligence';
import SectorReport from './SectorReport';
import TouristProtocolsPanel from './TouristProtocolsPanel';
import WaterUtilityPanel from './WaterUtilityPanel';
import WeatherPanel from './WeatherPanel';
import HikingTrailsPanel from './HikingTrailsPanel';
import CitizenReportModal from './CitizenReportModal';
import LiveReportFeed from './LiveReportFeed';
import OntologyViewer from './OntologyViewer';
import ExecutiveSummary from './ExecutiveSummary';
import ExpandablePanel from './ExpandablePanel';
import EnvironmentalCluster from './EnvironmentalCluster';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IntelligenceSidebarProps {
  onSuburbSelect?: (suburb: SuburbIntelligence | null) => void;
}

type TabType = 'executive' | 'ontology' | 'reports' | 'trails';

const IntelligenceSidebar = ({ onSuburbSelect }: IntelligenceSidebarProps) => {
  const { suburbs, loading, error, searchSuburbs } = useSuburbIntelligence();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbIntelligence | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [expandedTab, setExpandedTab] = useState<TabType | null>(null);

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

  const quickAccessSuburbs = useMemo(() => {
    return [
      suburbs.find(s => s.id === 'ottery'),
      suburbs.find(s => s.id === 'sea-point'),
      suburbs.find(s => s.id === 'claremont'),
      suburbs.find(s => s.id === 'khayelitsha'),
      suburbs.find(s => s.id === 'camps-bay'),
    ].filter(Boolean) as SuburbIntelligence[];
  }, [suburbs]);

  const tabConfig = {
    executive: { icon: <Activity className="w-4 h-4 text-primary" />, title: 'City KPIs & Executive Summary', component: <ExecutiveSummary /> },
    ontology: { icon: <Network className="w-4 h-4 text-primary" />, title: 'Entity Graph & Relationships', component: <OntologyViewer /> },
    reports: { icon: <Radio className="w-4 h-4 text-primary" />, title: 'Live Report Feed', component: <LiveReportFeed /> },
    trails: { icon: <Mountain className="w-4 h-4 text-primary" />, title: 'Hiking Trails & Outdoor Safety', component: <HikingTrailsPanel /> },
  };

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
      {/* Search Section - Report button removed (exists in global nav) */}
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

        {/* Search Results Dropdown */}
        {isFocused && filteredSuburbs.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-lg rounded-lg border border-primary/25 shadow-xl overflow-hidden z-50 animate-fade-in max-h-64 overflow-y-auto scrollbar-visible">
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

        {/* No Results */}
        {isFocused && searchQuery && filteredSuburbs.length === 0 && !loading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-lg rounded-lg border border-border/50 shadow-lg p-3 text-center z-50 animate-fade-in">
            <MapPin className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">No results for "{searchQuery}"</div>
          </div>
        )}
      </div>

      {/* Quick Access Pills */}
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

      {/* Intelligence Tabs - Click to expand full screen */}
      <div 
        className="flex-shrink-0 bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-1"
        role="navigation"
        aria-label="Intelligence panels - click to expand"
      >
        <div className="grid grid-cols-4 gap-1">
          {(Object.keys(tabConfig) as TabType[]).map((tab) => {
            const config = tabConfig[tab];
            const icons = {
              executive: <Activity className="w-3.5 h-3.5" />,
              ontology: <Network className="w-3.5 h-3.5" />,
              reports: <Radio className="w-3.5 h-3.5" />,
              trails: <Mountain className="w-3.5 h-3.5" />,
            };
            const labels = {
              executive: 'KPIs',
              ontology: 'Graph',
              reports: 'Feed',
              trails: 'Trails',
            };
            
            return (
              <button
                key={tab}
                onClick={() => setExpandedTab(tab)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-all",
                  "bg-background/50 border border-border/30 hover:border-primary/50 hover:bg-primary/10",
                  "focus:ring-2 focus:ring-primary/50 focus:outline-none",
                  "group"
                )}
                aria-label={`Expand ${labels[tab]} panel`}
              >
                <div className="flex items-center gap-1">
                  {icons[tab]}
                  <Maximize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </div>
                <span className="text-[10px] font-medium">{labels[tab]}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[9px] text-center text-muted-foreground mt-1.5 font-mono">
          Click to expand full view
        </p>
      </div>

      {/* Environmental Context Cluster */}
      <div className="flex-shrink-0">
        <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Environmental Context
        </h3>
        <EnvironmentalCluster className="mb-3" />
      </div>

      {/* Scrollable Content Area - always visible scrollbar */}
      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-visible pb-4">
        <SectorReport 
          suburb={selectedSuburb} 
          onClose={handleCloseSuburb}
          loading={loading && !!searchQuery}
        />
        <WaterUtilityPanel />
      </div>

      {/* Citizen Report Modal */}
      <CitizenReportModal open={reportModalOpen} onOpenChange={setReportModalOpen} />

      {/* Expanded Panel Modals */}
      {expandedTab && (
        <ExpandablePanel
          title={tabConfig[expandedTab].title}
          icon={tabConfig[expandedTab].icon}
          isOpen={!!expandedTab}
          onClose={() => setExpandedTab(null)}
        >
          <div className="h-full">
            {tabConfig[expandedTab].component}
          </div>
        </ExpandablePanel>
      )}
    </div>
  );
};

export default IntelligenceSidebar;