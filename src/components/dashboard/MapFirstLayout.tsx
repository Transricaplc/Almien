import { useState, useCallback, lazy, Suspense, memo } from 'react';
import { 
  AlertTriangle, Grid3X3, Camera, Flame, Shield,
  Bike, Mountain, MapPin, TrafficCone, Users, Menu,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen
} from 'lucide-react';
import TopStatusBar from './TopStatusBar';
import MapFirstView from './MapFirstView';
import ControlHub, { LayerConfig } from './ControlHub';
import ContextDrawer from './ContextDrawer';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy-load non-critical panels
const IntelligenceSidebar = lazy(() => import('./IntelligenceSidebar'));
const MobileBottomSheet = lazy(() => import('./MobileBottomSheet'));

/**
 * Map-First Layout — v1.2 Grid System
 * 
 * 12-column responsive grid with collapsible sidebars:
 * ┌──────────────────────────────────────────────────┐
 * │ TOP STATUS BAR (h-12, z-50, col-span-12)        │
 * ├──────┬──────────────────────────────┬─────────────┤
 * │LEFT  │                              │RIGHT        │
 * │PANEL │   CENTER MAP CANVAS          │INTEL PANEL  │
 * │col 3 │   col 6-9 (flex)             │col 3        │
 * │1.5rem│   1.5rem pad, 12px radius    │1.5rem pad   │
 * ├──────┴──────────────────────────────┴─────────────┤
 * │ SOS DOCK (z-50, fixed bottom, col-span-12)       │
 * └──────────────────────────────────────────────────┘
 *
 * Rules:
 * 1. Sidebars are collapsible — toggle to maximize map
 * 2. Panels use 1.5rem padding, 12px border-radius
 * 3. Only ONE primary panel visible at a time
 * 4. Panels auto-collapse on map interaction
 * 5. Traveler mode locks all secondary panels
 * 6. z-index: map(0) < intel(20) < controls(30) < statusbar(50)
 */

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
type SeverityLevel = 'all' | 'low' | 'medium' | 'high' | 'critical';
type ActivePanel = 'none' | 'controls' | 'intelligence';

const MapFirstLayout = () => {
  const { isTravelerMode, setTravelerMode, selectedEntity, clearSelection } = useDashboard();
  const isMobile = useIsMobile();

  // Sidebar collapse state
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Single panel state — only one panel open at a time
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  
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

  const handleMapInteraction = useCallback(() => {
    setActivePanel('none');
  }, []);

  const togglePanel = useCallback((panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? 'none' : panel);
  }, []);

  const showLeftSidebar = !isTravelerMode && !isMobile;
  const showRightSidebar = !isTravelerMode && !isMobile;
  const showMobileIntelButton = !isTravelerMode && isMobile;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* TOP STATUS BAR — col-span-12, h-12, z-50 */}
      <TopStatusBar
        isTravelerMode={isTravelerMode}
        onToggleTravelerMode={() => setTravelerMode(!isTravelerMode)}
        alertCount={3}
        connectionStatus="connected"
      />

      {/* MAIN CONTENT — 12-column grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-12 gap-0 relative">
        
        {/* LEFT SIDEBAR — Navigation & Controls (col-span-3 or collapsed) */}
        {showLeftSidebar && (
          <aside className={cn(
            "relative z-30 flex flex-col bg-card/95 backdrop-blur-xl border-r border-border/50",
            "transition-all duration-300 ease-out overflow-hidden",
            leftCollapsed ? "col-span-1 w-14" : "col-span-3"
          )}>
            {/* Collapse toggle */}
            <button
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className="absolute top-3 right-2 z-10 p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              aria-label={leftCollapsed ? "Expand left panel" : "Collapse left panel"}
            >
              {leftCollapsed 
                ? <PanelLeftOpen className="w-4 h-4 text-muted-foreground" /> 
                : <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
              }
            </button>

            {leftCollapsed ? (
              /* Collapsed: icon-only strip */
              <div className="flex flex-col items-center gap-2 pt-12 p-2">
                <button
                  onClick={() => { setLeftCollapsed(false); togglePanel('controls'); }}
                  className="p-2 rounded-xl bg-muted/30 hover:bg-primary/10 hover:border-primary/40 border border-border/30 transition-colors"
                  title="Controls"
                >
                  <Shield className="w-4 h-4 text-primary" />
                </button>
              </div>
            ) : (
              /* Expanded: full control hub */
              <div className="flex-1 overflow-hidden p-[1.5rem] pt-10">
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
                  onCollapseAll={handleMapInteraction}
                  className="relative static w-full"
                />
              </div>
            )}
          </aside>
        )}

        {/* CENTER MAP CANVAS — fills remaining columns */}
        <main className={cn(
          "relative overflow-hidden",
          // Dynamic column span based on sidebar states
          showLeftSidebar && showRightSidebar
            ? cn(
                leftCollapsed && rightCollapsed ? "col-span-10" :
                leftCollapsed ? "col-span-8" :
                rightCollapsed ? "col-span-8" :
                "col-span-6"
              )
            : "col-span-12"
        )}>
          <div className="absolute inset-0 p-1.5">
            <div className="w-full h-full rounded-xl overflow-hidden border border-border/30">
              <MapFirstView
                fullHeight
                onMapInteraction={handleMapInteraction}
              />
            </div>
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
              isExpanded={activePanel === 'controls'}
              onToggleExpand={() => togglePanel('controls')}
              onCollapseAll={handleMapInteraction}
            />
          )}
        </main>

        {/* RIGHT SIDEBAR — Intelligence Panel (col-span-3 or collapsed) */}
        {showRightSidebar && (
          <aside className={cn(
            "relative z-20 flex flex-col bg-card/95 backdrop-blur-xl border-l border-border/50",
            "transition-all duration-300 ease-out overflow-hidden",
            rightCollapsed ? "col-span-1 w-14" : "col-span-3"
          )}>
            {/* Collapse toggle */}
            <button
              onClick={() => setRightCollapsed(!rightCollapsed)}
              className="absolute top-3 left-2 z-10 p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              aria-label={rightCollapsed ? "Expand right panel" : "Collapse right panel"}
            >
              {rightCollapsed 
                ? <PanelRightOpen className="w-4 h-4 text-muted-foreground" />
                : <PanelRightClose className="w-4 h-4 text-muted-foreground" />
              }
            </button>

            {rightCollapsed ? (
              /* Collapsed: icon-only strip */
              <div className="flex flex-col items-center gap-2 pt-12 p-2">
                <button
                  onClick={() => setRightCollapsed(false)}
                  className="p-2 rounded-xl bg-muted/30 hover:bg-primary/10 hover:border-primary/40 border border-border/30 transition-colors"
                  title="Intelligence"
                >
                  <Menu className="w-4 h-4 text-primary" />
                </button>
              </div>
            ) : (
              /* Expanded: full intelligence sidebar */
              <div className="flex-1 overflow-hidden p-[1.5rem] pt-10">
                <Suspense fallback={
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-mono">Loading…</span>
                  </div>
                }>
                  <IntelligenceSidebar />
                </Suspense>
              </div>
            )}
          </aside>
        )}

        {/* MOBILE: Intelligence Toggle Button */}
        {showMobileIntelButton && (
          <button
            onClick={() => togglePanel('intelligence')}
            className={cn(
              "lg:hidden fixed bottom-20 right-4 z-30",
              "flex items-center gap-2 px-4 py-2.5",
              "rounded-xl shadow-lg transition-all duration-200",
              activePanel === 'intelligence'
                ? "bg-primary text-primary-foreground"
                : "bg-card/90 text-foreground border border-border/50"
            )}
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">Intel</span>
          </button>
        )}

        {/* MOBILE: Bottom Sheet */}
        {isMobile && (
          <Suspense fallback={null}>
            <MobileBottomSheet
              isOpen={activePanel === 'intelligence'}
              onClose={() => setActivePanel('none')}
              title="Safety Intelligence"
              initialState="expanded"
            >
              <div className="p-[1.5rem]">
                <IntelligenceSidebar />
              </div>
            </MobileBottomSheet>
          </Suspense>
        )}

        {/* CONTEXT DRAWER */}
        {selectedEntity && (
          <ContextDrawer
            entity={selectedEntity}
            onClose={clearSelection}
          />
        )}
      </div>
    </div>
  );
};

export default memo(MapFirstLayout);
