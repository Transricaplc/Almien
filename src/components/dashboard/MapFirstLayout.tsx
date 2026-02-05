import { useState, useCallback } from 'react';
import { 
  Map, AlertTriangle, Grid3X3, Camera, Flame, Shield,
  Bike, Mountain, MapPin, TrafficCone, Users, Menu
} from 'lucide-react';
import TopStatusBar from './TopStatusBar';
import MapFirstView from './MapFirstView';
import ControlHub, { LayerConfig } from './ControlHub';
import MobileBottomSheet from './MobileBottomSheet';
import IntelligenceSidebar from './IntelligenceSidebar';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';

/**
 * Map-First Layout
 * Mobile-first design where map is always the primary surface
 * 
 * Features:
 * - Progressive zoom: city → ward → suburb level rendering
 * - Collapsible bottom sheets (mobile) or side panels (desktop)
 * - Single expandable control hub with tabs
 * - Auto-collapse panels on map interaction
 */

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
type SeverityLevel = 'all' | 'low' | 'medium' | 'high' | 'critical';

const MapFirstLayout = () => {
  const { contextPanelOpen, isTravelerMode } = useDashboard();
  
  // Control Hub state
  const [controlHubExpanded, setControlHubExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [severity, setSeverity] = useState<SeverityLevel>('all');
  
  // Layer configuration
  const [layers, setLayers] = useState<LayerConfig[]>([
    // Safety Layers
    { id: 'heatmap', name: 'Crime Heatmap', icon: AlertTriangle, color: '#ef4444', enabled: true, category: 'safety' },
    { id: 'safezones', name: 'Safe Zones', icon: Shield, color: '#10b981', enabled: true, category: 'safety' },
    { id: 'reports', name: 'Citizen Reports', icon: Users, color: '#f97316', enabled: true, category: 'safety' },
    { id: 'risk', name: 'Pickpocket Zones', icon: AlertTriangle, color: '#f97316', enabled: false, category: 'safety' },
    
    // Infrastructure Layers
    { id: 'wards', name: 'Ward Boundaries', icon: Grid3X3, color: '#6366f1', enabled: true, category: 'infrastructure' },
    { id: 'cctv', name: 'CCTV Cameras', icon: Camera, color: '#3b82f6', enabled: false, category: 'infrastructure' },
    { id: 'traffic', name: 'Traffic Signals', icon: TrafficCone, color: '#22c55e', enabled: false, category: 'infrastructure' },
    { id: 'cycling', name: 'Cycle Lanes', icon: Bike, color: '#10b981', enabled: false, category: 'infrastructure' },
    { id: 'hiking', name: 'Hiking Trails', icon: Mountain, color: '#92400e', enabled: false, category: 'infrastructure' },
    
    // Operations Layers
    { id: 'wildfire', name: 'Wildfire (AFIS)', icon: Flame, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst', 'responder'] },
    { id: 'hotspots', name: 'Accident Hotspots', icon: MapPin, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst', 'responder'] },
  ]);

  // Bottom sheet state for mobile intelligence panel
  const [intelligenceSheetOpen, setIntelligenceSheetOpen] = useState(false);

  // Toggle layer handler
  const handleToggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => 
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ));
  }, []);

  // Auto-collapse controls on map interaction
  const handleMapInteraction = useCallback(() => {
    setControlHubExpanded(false);
    setIntelligenceSheetOpen(false);
  }, []);

  // Collapse all panels
  const handleCollapseAll = useCallback(() => {
    setControlHubExpanded(false);
    setIntelligenceSheetOpen(false);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Status Bar - Compact */}
      <TopStatusBar
        isTravelerMode={isTravelerMode}
        onToggleTravelerMode={() => {}}
        alertCount={3}
        connectionStatus="connected"
      />

      {/* Main Content - Map takes full space */}
      <main className="flex-1 relative overflow-hidden">
        {/* Primary Map Canvas */}
        <MapFirstView 
          fullHeight 
          onMapInteraction={handleMapInteraction}
        />

        {/* Control Hub - Floating */}
        <ControlHub
          layers={layers}
          onToggleLayer={handleToggleLayer}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          severity={severity}
          onSeverityChange={setSeverity}
          isExpanded={controlHubExpanded}
          onToggleExpand={() => setControlHubExpanded(!controlHubExpanded)}
          onCollapseAll={handleCollapseAll}
        />

        {/* Desktop: Side Intelligence Panel */}
        <aside 
          className={cn(
            "hidden lg:block fixed right-0 top-[52px] bottom-0 w-80 z-30",
            "bg-card/80 backdrop-blur-xl border-l border-border/50",
            "transition-transform duration-300",
            contextPanelOpen ? "translate-x-full" : "translate-x-0"
          )}
        >
          <IntelligenceSidebar />
        </aside>

        {/* Mobile: Bottom Intelligence Button */}
        <button
          onClick={() => setIntelligenceSheetOpen(true)}
          className={cn(
            "lg:hidden fixed bottom-24 right-4 z-40",
            "flex items-center gap-2 px-4 py-2.5",
            "bg-primary text-primary-foreground rounded-full shadow-lg",
            "hover:bg-primary/90 transition-all"
          )}
        >
          <Menu className="w-4 h-4" />
          <span className="text-sm font-medium">Intel</span>
        </button>

        {/* Mobile: Bottom Sheet for Intelligence */}
        <MobileBottomSheet
          isOpen={intelligenceSheetOpen}
          onClose={() => setIntelligenceSheetOpen(false)}
          title="Safety Intelligence"
          initialState="expanded"
        >
          <div className="p-4">
            <IntelligenceSidebar />
          </div>
        </MobileBottomSheet>
      </main>
    </div>
  );
};

export default MapFirstLayout;
