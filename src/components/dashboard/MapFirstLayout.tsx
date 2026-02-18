import { useState, useCallback, lazy, Suspense, memo } from 'react';
import { 
  AlertTriangle, Grid3X3, Camera, Flame, Shield,
  Bike, Mountain, MapPin, TrafficCone, Users, Menu,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  Bell, Activity
} from 'lucide-react';
import TopStatusBar from './TopStatusBar';
import MapFirstView from './MapFirstView';
import ControlHub, { LayerConfig } from './ControlHub';
import ContextDrawer from './ContextDrawer';
import AlertsFeed from './AlertsFeed';
import ModuleTabBar from './ModuleTabBar';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

// Lazy-load non-critical panels
const IntelligenceSidebar = lazy(() => import('./IntelligenceSidebar'));
const MobileBottomSheet = lazy(() => import('./MobileBottomSheet'));
const AreaIntelligenceDrawer = lazy(() => import('./AreaIntelligenceDrawer'));

/**
 * Map-First Layout — v2.0 Smart Hybrid Model
 * 
 * Three-zone layout with persistent sidebars:
 * ┌──────────────────────────────────────────────────┐
 * │ TOP STATUS BAR (h-12, z-50)                      │
 * ├──────────┬────────────────────────┬───────────────┤
 * │ LEFT     │                        │ RIGHT         │
 * │ 30%      │  CENTER MAP + MODULES  │ 20%           │
 * │ Nav/Ctrl │  50% (flex)            │ Contextual    │
 * │ Filters  │  + Bottom Tab Bar      │ Alerts Feed   │
 * │ Search   │                        │ or Details    │
 * ├──────────┴────────────────────────┴───────────────┤
 * │ SOS DOCK (z-50, fixed bottom)                     │
 * └──────────────────────────────────────────────────┘
 *
 * Principles:
 * 1. Map always visible — anchor for spatial context
 * 2. 3-tier info: always-visible → on-demand → deep-dive
 * 3. Everything accessible within 2 clicks
 * 4. Right panel: alerts feed by default, entity details on selection
 * 5. Bottom tab bar: Crime, Areas, Routes, Trails modules
 */

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
type SeverityLevel = 'all' | 'low' | 'medium' | 'high' | 'critical';

const MapFirstLayout = () => {
  const { isTravelerMode, setTravelerMode, selectedEntity, clearSelection } = useDashboard();
  const isMobile = useIsMobile();

  // Sidebar collapse state
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [severity, setSeverity] = useState<SeverityLevel>('all');
  
  // Layer configuration
  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: 'heatmap', name: 'Crime Heatmap', icon: AlertTriangle, color: '#ef4444', enabled: true, category: 'safety' },
    { id: 'safezones', name: 'Safe Zones', icon: Shield, color: '#10b981', enabled: true, category: 'safety' },
    { id: 'reports', name: 'Citizen Reports', icon: Users, color: '#f97316', enabled: true, category: 'safety' },
    { id: 'risk', name: 'Pickpocket Zones', icon: AlertTriangle, color: '#f97316', enabled: false, category: 'safety' },
    { id: 'wards', name: 'Ward Boundaries', icon: Grid3X3, color: '#6366f1', enabled: true, category: 'infrastructure' },
    { id: 'cctv', name: 'CCTV Cameras', icon: Camera, color: '#3b82f6', enabled: false, category: 'infrastructure' },
    { id: 'traffic', name: 'Traffic Signals', icon: TrafficCone, color: '#22c55e', enabled: false, category: 'infrastructure' },
    { id: 'cycling', name: 'Cycle Lanes', icon: Bike, color: '#10b981', enabled: false, category: 'infrastructure' },
    { id: 'hiking', name: 'Hiking Trails', icon: Mountain, color: '#92400e', enabled: false, category: 'infrastructure' },
    { id: 'wildfire', name: 'Wildfire (AFIS)', icon: Flame, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst', 'responder'] },
    { id: 'hotspots', name: 'Accident Hotspots', icon: MapPin, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst', 'responder'] },
  ]);

  const handleToggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => 
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ));
  }, []);

  const showLeftSidebar = !isTravelerMode && !isMobile;
  const showRightSidebar = !isTravelerMode && !isMobile;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* TOP STATUS BAR */}
      <TopStatusBar
        isTravelerMode={isTravelerMode}
        onToggleTravelerMode={() => setTravelerMode(!isTravelerMode)}
        alertCount={3}
        connectionStatus="connected"
      />

      {/* MAIN CONTENT — flex layout */}
      <div className="flex-1 overflow-hidden flex gap-0 relative">
        
        {/* LEFT PANEL — 30% width, persistent nav + controls */}
        {showLeftSidebar && (
          <aside className={cn(
            "relative z-30 flex flex-col bg-card/95 backdrop-blur-xl border-r border-border/30",
            "transition-all duration-300 ease-out overflow-hidden shrink-0",
            leftCollapsed ? "w-12" : "w-[280px] xl:w-[320px]"
          )}>
            {/* Collapse toggle */}
            <button
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className="absolute top-2 right-1.5 z-10 p-1 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              aria-label={leftCollapsed ? "Expand left panel" : "Collapse left panel"}
            >
              {leftCollapsed 
                ? <PanelLeftOpen className="w-3.5 h-3.5 text-muted-foreground" /> 
                : <PanelLeftClose className="w-3.5 h-3.5 text-muted-foreground" />
              }
            </button>

            {leftCollapsed ? (
              <div className="flex flex-col items-center gap-2 pt-10 p-1.5">
                <button
                  onClick={() => setLeftCollapsed(false)}
                  className="p-2 rounded-lg bg-muted/30 hover:bg-primary/10 border border-border/30 transition-colors"
                  title="Controls"
                >
                  <Shield className="w-4 h-4 text-primary" />
                </button>
              </div>
            ) : (
              <ScrollArea className="flex-1 pt-8">
                <div className="p-3 space-y-3">
                  {/* Control Hub — Layers, Filters, Search */}
                  <ControlHub
                    layers={layers}
                    onToggleLayer={handleToggleLayer}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    severity={severity}
                    onSeverityChange={setSeverity}
                    isExpanded={true}
                    onToggleExpand={() => {}}
                    onCollapseAll={() => {}}
                    className="relative static w-full"
                  />
                </div>
              </ScrollArea>
            )}
          </aside>
        )}

        {/* CENTER — Map canvas + bottom module tabs */}
        <main className="flex-1 relative overflow-hidden">
          {/* Map */}
          <div className="absolute inset-0">
            <MapFirstView fullHeight onMapInteraction={() => {}} />
          </div>

          {/* Mobile: floating control hub */}
          {isMobile && !isTravelerMode && (
            <ControlHub
              layers={layers}
              onToggleLayer={handleToggleLayer}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              severity={severity}
              onSeverityChange={setSeverity}
              isExpanded={false}
              onToggleExpand={() => {}}
              onCollapseAll={() => {}}
            />
          )}

          {/* Bottom Module Tab Bar */}
          {!isTravelerMode && (
            <ModuleTabBar />
          )}
        </main>

        {/* RIGHT PANEL — 20% width, contextual */}
        {showRightSidebar && (
          <aside className={cn(
            "relative z-20 flex flex-col bg-card/95 backdrop-blur-xl border-l border-border/30",
            "transition-all duration-300 ease-out overflow-hidden shrink-0",
            rightCollapsed ? "w-12" : "w-[260px] xl:w-[300px]"
          )}>
            {/* Collapse toggle */}
            <button
              onClick={() => setRightCollapsed(!rightCollapsed)}
              className="absolute top-2 left-1.5 z-10 p-1 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              aria-label={rightCollapsed ? "Expand right panel" : "Collapse right panel"}
            >
              {rightCollapsed 
                ? <PanelRightOpen className="w-3.5 h-3.5 text-muted-foreground" />
                : <PanelRightClose className="w-3.5 h-3.5 text-muted-foreground" />
              }
            </button>

            {rightCollapsed ? (
              <div className="flex flex-col items-center gap-2 pt-10 p-1.5">
                <button
                  onClick={() => setRightCollapsed(false)}
                  className="p-2 rounded-lg bg-muted/30 hover:bg-primary/10 border border-border/30 transition-colors"
                  title="Alerts"
                >
                  <Bell className="w-4 h-4 text-primary" />
                </button>
              </div>
            ) : (
              <ScrollArea className="flex-1 pt-8">
                <div className="p-3">
                  {/* Show entity details when selected, otherwise alerts feed */}
                  {selectedEntity && selectedEntity.type !== 'area' ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                          Entity Detail
                        </h3>
                        <button
                          onClick={clearSelection}
                          className="text-[10px] font-mono text-primary hover:underline"
                        >
                          ← Back to feed
                        </button>
                      </div>
                      <Suspense fallback={null}>
                        <IntelligenceSidebar />
                      </Suspense>
                    </div>
                  ) : (
                    <AlertsFeed />
                  )}
                </div>
              </ScrollArea>
            )}
          </aside>
        )}

        {/* MOBILE: Bottom Sheet for intelligence */}
        {isMobile && (
          <Suspense fallback={null}>
            <MobileBottomSheet
              isOpen={false}
              onClose={() => {}}
              title="Safety Intelligence"
              initialState="expanded"
            >
              <div className="p-4">
                <IntelligenceSidebar />
              </div>
            </MobileBottomSheet>
          </Suspense>
        )}

        {/* CONTEXT DRAWER — non-area entities (mobile or overlay) */}
        {selectedEntity && selectedEntity.type !== 'area' && isMobile && (
          <ContextDrawer
            entity={selectedEntity}
            onClose={clearSelection}
          />
        )}

        {/* AREA INTELLIGENCE DRAWER */}
        <Suspense fallback={null}>
          <AreaIntelligenceDrawer
            isOpen={selectedEntity?.type === 'area'}
            onClose={clearSelection}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default memo(MapFirstLayout);
