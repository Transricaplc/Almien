import { useState, useCallback, memo, lazy, Suspense } from 'react';
import { 
  Search, MapPin, Bookmark, Crown, ChevronLeft, ChevronRight,
  Filter, X, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import GridifyHeader from './GridifyHeader';
import MapFirstView from './MapFirstView';
import AreaDetailPanel from './AreaDetailPanel';
import ExploreTabs from './ExploreTabs';
import TimeOfDayToggle from './TimeOfDayToggle';
import SafetyScoreBadge from './SafetyScoreBadge';
import UpgradeModal from './UpgradeModal';
import AlertsFeed from './AlertsFeed';
import ControlHub, { LayerConfig } from './ControlHub';
import { useDashboard } from '@/contexts/DashboardContext';
import { capeTownAreas, searchAreas, type AreaSafetyData, type TimeOfDay } from '@/data/capeTownSafetyData';
import { AlertTriangle, Shield, Grid3X3, Camera, Flame, Bike, Mountain, MapPin as MapPinIcon, TrafficCone, Users } from 'lucide-react';

const AreaIntelligenceDrawer = lazy(() => import('./AreaIntelligenceDrawer'));
const SOSActionDock = lazy(() => import('./SOSActionDock'));

/**
 * GridifyDashboard — Freemium map-first layout.
 * 
 * ┌──────────────────────────────────────────────┐
 * │ HEADER (h-16, z-50)                          │
 * ├──────────┬─────────────────────┬──────────────┤
 * │ LEFT     │                     │ RIGHT        │
 * │ Sidebar  │   MAP (60%)         │ Detail Panel │
 * │ 25%      │   + Time Toggle     │ 300px        │
 * │ Search   │   + Explore Tabs    │ (on select)  │
 * │ Filters  │                     │              │
 * │ Saved    │                     │              │
 * └──────────┴─────────────────────┴──────────────┘
 */

const GridifyDashboard = memo(() => {
  const { selectedEntity, clearSelection } = useDashboard();
  const isMobile = useIsMobile();

  // State
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [selectedArea, setSelectedArea] = useState<AreaSafetyData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; trigger?: string }>({ open: false });
  const [savedLocations, setSavedLocations] = useState<string[]>([]);

  // Layer config
  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: 'heatmap', name: 'Crime Heatmap', icon: AlertTriangle, color: '#ef4444', enabled: true, category: 'safety' },
    { id: 'safezones', name: 'Safe Zones', icon: Shield, color: '#10b981', enabled: true, category: 'safety' },
    { id: 'reports', name: 'Citizen Reports', icon: Users, color: '#f97316', enabled: true, category: 'safety' },
    { id: 'risk', name: 'Pickpocket Zones', icon: AlertTriangle, color: '#f97316', enabled: false, category: 'safety' },
    { id: 'wards', name: 'Ward Boundaries', icon: Grid3X3, color: '#6366f1', enabled: true, category: 'infrastructure' },
    { id: 'cctv', name: 'CCTV Cameras', icon: Camera, color: '#3b82f6', enabled: false, category: 'infrastructure' },
    { id: 'traffic', name: 'Traffic Signals', icon: TrafficCone, color: '#22c55e', enabled: false, category: 'infrastructure' },
    { id: 'wildfire', name: 'Wildfire (AFIS)', icon: Flame, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst'] },
  ]);

  const handleToggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l));
  }, []);

  const handleSelectArea = useCallback((area: AreaSafetyData) => {
    setSelectedArea(area);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedArea(null);
  }, []);

  const handleSaveLocation = useCallback((areaId: string) => {
    if (savedLocations.length >= 3) {
      setUpgradeModal({ open: true, trigger: 'Save unlimited locations with Gridify Elite' });
      return;
    }
    setSavedLocations(prev => prev.includes(areaId) ? prev.filter(id => id !== areaId) : [...prev, areaId]);
  }, [savedLocations]);

  const searchResults = searchQuery ? searchAreas(searchQuery) : [];
  const showRightPanel = selectedArea && !isMobile;
  const showLeftSidebar = !isMobile;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <GridifyHeader />

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex relative">
        {/* LEFT SIDEBAR */}
        {showLeftSidebar && (
          <aside className={cn(
            "relative z-30 flex flex-col bg-card border-r border-border shrink-0",
            "transition-all duration-300 ease-out",
            leftCollapsed ? "w-12" : "w-[280px] xl:w-[320px]"
          )}>
            {/* Collapse toggle */}
            <button
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className="absolute top-3 -right-3 z-40 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
            >
              {leftCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            {leftCollapsed ? (
              <div className="flex flex-col items-center gap-3 pt-6 p-2">
                <button onClick={() => setLeftCollapsed(false)} className="p-2 rounded-lg hover:bg-secondary" title="Search">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => setLeftCollapsed(false)} className="p-2 rounded-lg hover:bg-secondary" title="Layers">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => setLeftCollapsed(false)} className="p-2 rounded-lg hover:bg-secondary" title="Saved">
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-5">
                  {/* Search */}
                  <div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search by area or address"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-secondary/50 border-border"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>

                    {/* Search results */}
                    {searchResults.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {searchResults.slice(0, 5).map(area => (
                          <button
                            key={area.id}
                            onClick={() => { handleSelectArea(area); setSearchQuery(''); }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                          >
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">{area.name}</div>
                            </div>
                            <SafetyScoreBadge score={area.safetyScore} size="sm" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Time of Day */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Time of Day
                    </h3>
                    <TimeOfDayToggle value={timeOfDay} onChange={setTimeOfDay} className="w-full" />
                  </div>

                  {/* Layer Controls */}
                  <ControlHub
                    layers={layers}
                    onToggleLayer={handleToggleLayer}
                    searchQuery=""
                    onSearchChange={() => {}}
                    timeRange="24h"
                    onTimeRangeChange={() => {}}
                    severity="all"
                    onSeverityChange={() => {}}
                    isExpanded={true}
                    onToggleExpand={() => {}}
                    onCollapseAll={() => {}}
                    className="relative static w-full"
                  />

                  {/* Saved Locations */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Saved Locations
                      </h3>
                      <span className="text-[10px] text-muted-foreground">{savedLocations.length}/3 free</span>
                    </div>
                    {savedLocations.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No saved locations yet</p>
                    ) : (
                      <div className="space-y-1">
                        {savedLocations.map(id => {
                          const area = capeTownAreas.find(a => a.id === id);
                          if (!area) return null;
                          return (
                            <button
                              key={id}
                              onClick={() => handleSelectArea(area)}
                              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                            >
                              <Bookmark className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-sm text-foreground truncate">{area.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Upgrade CTA */}
                  <button
                    onClick={() => setUpgradeModal({ open: true })}
                    className="w-full p-4 rounded-xl bg-elite-gradient text-white text-left hover:opacity-90 transition-opacity"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-bold">Upgrade to Elite</span>
                    </div>
                    <p className="text-xs text-white/80">
                      Real-time alerts, 5-year data, unlimited locations
                    </p>
                  </button>
                </div>
              </ScrollArea>
            )}
          </aside>
        )}

        {/* CENTER — Map */}
        <main className="flex-1 relative overflow-hidden">
          {/* Time of Day toggle — floating on map (mobile) */}
          {isMobile && (
            <div className="absolute top-3 left-3 right-3 z-[1001]">
              <TimeOfDayToggle value={timeOfDay} onChange={setTimeOfDay} />
            </div>
          )}

          {/* Map */}
          <div className="absolute inset-0">
            <MapFirstView fullHeight onMapInteraction={handleCloseDetail} />
          </div>

          {/* Bottom Explore Tabs */}
          <ExploreTabs
            timeOfDay={timeOfDay}
            onSelectArea={handleSelectArea}
          />
        </main>

        {/* RIGHT PANEL — Area detail or alerts */}
        {showRightPanel && (
          <aside className="w-[300px] xl:w-[340px] shrink-0 z-20 overflow-hidden">
            <AreaDetailPanel
              area={selectedArea}
              timeOfDay={timeOfDay}
              onClose={handleCloseDetail}
            />
          </aside>
        )}

        {/* Mobile: Bottom sheet for area detail */}
        {selectedArea && isMobile && (
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] bg-card rounded-t-2xl shadow-xl border-t border-border overflow-y-auto animate-slide-up">
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mt-2 mb-1" />
            <AreaDetailPanel
              area={selectedArea}
              timeOfDay={timeOfDay}
              onClose={handleCloseDetail}
            />
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal.open}
        onClose={() => setUpgradeModal({ open: false })}
        trigger={upgradeModal.trigger}
      />

      {/* Area Intelligence Drawer */}
      <Suspense fallback={null}>
        <AreaIntelligenceDrawer
          isOpen={selectedEntity?.type === 'area'}
          onClose={clearSelection}
        />
      </Suspense>
    </div>
  );
});

GridifyDashboard.displayName = 'GridifyDashboard';

export default GridifyDashboard;
