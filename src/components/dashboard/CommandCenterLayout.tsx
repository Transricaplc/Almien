import { useState, useCallback } from 'react';
import { 
  Map, AlertTriangle, Grid3X3, Camera, Flame, Shield, Route,
  Bike, Mountain, MapPin, TrafficCone, Users
} from 'lucide-react';
import TopStatusBar from './TopStatusBar';
import ControlPanel, { ViewMode, TimeRange, SeverityLevel, LayerConfig } from './ControlPanel';
import InteractiveMap from './InteractiveMap';
import IntelligenceSidebar from './IntelligenceSidebar';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';

/**
 * Command Center Layout
 * Implements the SafeSync Design System architecture:
 * - Top Status Bar (Context & Alerts)
 * - Left Control Panel (View Mode, Layers, Filters, Actions)
 * - Primary Map Canvas (≥65% of screen)
 * - Right Intelligence Sidebar (conditional)
 */

const CommandCenterLayout = () => {
  const { contextPanelOpen } = useDashboard();
  
  // View Mode State
  const [viewMode, setViewMode] = useState<ViewMode>('citizen');
  
  // Time and Severity Filters
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [severity, setSeverity] = useState<SeverityLevel>('all');
  
  // Layer Configuration - max 3 active thematic layers enforced
  const [layers, setLayers] = useState<LayerConfig[]>([
    // Safety Layers
    { id: 'safezones', name: 'Safe Zones', icon: Shield, color: '#10b981', enabled: true, category: 'safety' },
    { id: 'heatmap', name: 'Crime Heatmap', icon: AlertTriangle, color: '#ef4444', enabled: true, category: 'safety' },
    { id: 'reports', name: 'Citizen Reports', icon: Users, color: '#f97316', enabled: true, category: 'safety' },
    { id: 'risk', name: 'Pickpocket Zones', icon: AlertTriangle, color: '#f97316', enabled: false, category: 'safety' },
    
    // Infrastructure Layers
    { id: 'wards', name: 'Ward Boundaries', icon: Grid3X3, color: '#6366f1', enabled: true, category: 'infrastructure' },
    { id: 'cctv', name: 'CCTV Cameras', icon: Camera, color: '#3b82f6', enabled: false, category: 'infrastructure' },
    { id: 'traffic', name: 'Traffic Signals', icon: TrafficCone, color: '#22c55e', enabled: false, category: 'infrastructure' },
    
    // Operations Layers (Analyst/Responder only)
    { id: 'wildfire', name: 'Wildfire (AFIS)', icon: Flame, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst', 'responder'] },
    { id: 'hotspots', name: 'Accident Hotspots', icon: MapPin, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst', 'responder'] },
    
    // Recreation Layers
    { id: 'cycling', name: 'Cycle Lanes', icon: Bike, color: '#10b981', enabled: false, category: 'infrastructure' },
    { id: 'hiking', name: 'Hiking Trails', icon: Mountain, color: '#92400e', enabled: false, category: 'infrastructure' },
    { id: 'pedestrian', name: 'Safe Pedestrian', icon: Route, color: '#3b82f6', enabled: false, category: 'infrastructure' },
  ]);

  // Toggle Layer - enforce max 3 thematic layers rule
  const handleToggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => 
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ));
  }, []);

  // Connection status (would come from real-time hook)
  const connectionStatus = 'connected' as const;
  const alertCount = 3;

  // Hide sidebar in responder mode or when context panel is open
  const showSidebar = viewMode !== 'responder' && !contextPanelOpen;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Status Bar */}
      <TopStatusBar
        isTravelerMode={false}
        onToggleTravelerMode={() => {}}
        alertCount={alertCount}
        connectionStatus={connectionStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel - 256px fixed */}
        <ControlPanel
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          layers={layers}
          onToggleLayer={handleToggleLayer}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          severity={severity}
          onSeverityChange={setSeverity}
        />

        {/* Primary Map Canvas - Always ≥65% width */}
        <main className={cn(
          "flex-1 relative transition-all duration-300 min-w-0",
        )}>
          <div className="absolute inset-0 p-2">
            <InteractiveMap fullHeight />
          </div>
        </main>

        {/* Right Intelligence Sidebar - 320px when visible */}
        {showSidebar && (
          <aside className="w-80 border-l border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden flex-shrink-0">
            <IntelligenceSidebar />
          </aside>
        )}
      </div>
    </div>
  );
};

export default CommandCenterLayout;
