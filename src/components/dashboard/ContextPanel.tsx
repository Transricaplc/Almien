import { useEffect, useState, useRef } from 'react';
import { 
  X, MapPin, Clock, AlertTriangle, Camera, TrafficCone,
  ChevronRight, Activity, Link2, History, ExternalLink,
  Shield, Maximize2, GripHorizontal, ChevronUp, ChevronDown, Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard, SelectedEntity } from '@/contexts/DashboardContext';
import { useOntology } from '@/hooks/useOntology';
import { usePanelState } from '@/hooks/usePanelState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import EnvironmentalCluster from './EnvironmentalCluster';

/**
 * Level 3 - Context Panel
 * Center-top positioned panel that appears when user clicks a map object.
 * Shows related entities with localStorage persistence.
 * Controls: Expand, Collapse, Full Screen, Close (NO minimize)
 */
const ContextPanel = () => {
  const { selectedEntity, contextPanelOpen, closeContextPanel } = useDashboard();
  const { getEntityNeighborhood } = useOntology();
  const [neighbors, setNeighbors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const panelId = `context-${selectedEntity?.type || 'default'}`;
  const {
    position,
    setPosition,
    toggleMaximize,
    isMaximized,
  } = usePanelState(panelId);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  useEffect(() => {
    if (selectedEntity?.id) {
      setLoading(true);
      getEntityNeighborhood(selectedEntity.id, 2)
        .then(setNeighbors)
        .finally(() => setLoading(false));
    }
  }, [selectedEntity?.id, getEntityNeighborhood]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contextPanelOpen) {
        closeContextPanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contextPanelOpen, closeContextPanel]);

  // Drag handling
  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setPosition({
        x: dragStartRef.current.posX + deltaX,
        y: Math.max(0, dragStartRef.current.posY + deltaY),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setPosition]);

  if (!contextPanelOpen || !selectedEntity) return null;

  const getModeLabel = () => {
    if (isMaximized) return 'Full View';
    if (isCollapsed) return 'Collapsed';
    return 'Details';
  };

  const getPanelStyle = () => {
    if (isMaximized) {
      return {
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '95vw',
        maxWidth: '1200px',
        maxHeight: 'calc(100vh - 80px)',
      };
    }
    return {
      top: `${Math.max(16, position.y)}px`,
      left: '50%',
      transform: `translateX(calc(-50% + ${position.x}px))`,
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity duration-300"
        onClick={closeContextPanel}
        aria-hidden="true"
      />

      {/* Panel - Center Top */}
      <div 
        className={cn(
          "fixed z-50 w-[95vw] max-w-2xl",
          "bg-background/98 backdrop-blur-xl border border-primary/30 rounded-xl",
          "shadow-2xl shadow-black/30",
          "animate-in fade-in-0 slide-in-from-top-4 zoom-in-95 duration-300",
          isMaximized && "max-w-5xl"
        )}
        style={getPanelStyle()}
        role="dialog"
        aria-label={`${selectedEntity.name} details`}
        aria-modal="true"
      >
        {/* Drag handle */}
        {!isMaximized && (
          <div 
            className={cn(
              "flex justify-center py-1.5 cursor-grab active:cursor-grabbing",
              "border-b border-border/20 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-t-xl",
              isDragging && "cursor-grabbing bg-primary/10"
            )}
            onMouseDown={handleDragStart}
          >
            <GripHorizontal className="w-6 h-4 text-muted-foreground/50" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              getTypeStyle(selectedEntity.type).bg
            )}>
              {getTypeIcon(selectedEntity.type)}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{selectedEntity.name}</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {selectedEntity.type?.replace('_', ' ')} • {getModeLabel()}
              </p>
            </div>
          </div>
          
          {/* Controls - Only Expand/Collapse, Full Screen, Close */}
          <div className="flex items-center gap-1.5">
            {isCollapsed ? (
              <button 
                onClick={() => setIsCollapsed(false)} 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-all"
                title="Expand"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Expand</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsCollapsed(true)} 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 hover:bg-amber-500/20 hover:text-amber-400 transition-all"
                title="Collapse"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Collapse</span>
              </button>
            )}
            <button 
              onClick={toggleMaximize} 
              className={cn("p-2 rounded-lg transition-all", isMaximized ? "bg-primary/20 text-primary" : "bg-muted/50 hover:bg-primary/10 hover:text-primary")}
              title="Full Screen"
            >
              {isMaximized ? <Copy className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={closeContextPanel} 
              className="p-2 rounded-lg bg-muted/50 hover:bg-destructive/20 hover:text-destructive transition-all"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats - Always visible when collapsed */}
        {isCollapsed && (
          <div className="p-3 border-b border-border/30">
            <QuickStatsGrid entity={selectedEntity} />
          </div>
        )}

        {/* Main Content - Collapsible with always visible scrollbar */}
        <div className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0" : isMaximized ? "max-h-[calc(100vh-200px)]" : "max-h-[60vh]"
        )}>
          <ScrollArea className={cn(
            isMaximized ? "h-[calc(100vh-200px)]" : "max-h-[60vh]",
            "scrollbar-visible"
          )}>
            <div className="p-4 space-y-4">
              {/* Priority: Quick Stats */}
              <QuickStatsGrid entity={selectedEntity} />

              <Separator />

              {/* Environmental Cluster - Weather, Wind, K9 */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Environmental Context
                </h3>
                <EnvironmentalCluster compact />
              </div>

              <Separator />

              {/* Location Context */}
              {selectedEntity.coordinates && (
                <Card className="bg-background/30 border-border/30">
                  <CardHeader className="py-2 px-3">
                    <CardTitle className="text-xs font-medium flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedEntity.coordinates.lat.toFixed(6)}, {selectedEntity.coordinates.lng.toFixed(6)}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Related Entities */}
              <Card className="bg-background/30 border-border/30">
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-xs font-medium flex items-center gap-2">
                    <Link2 className="w-3 h-3 text-primary" />
                    Related Entities
                    {loading && <span className="text-muted-foreground">(loading...)</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  {neighbors.length > 0 ? (
                    <div className="space-y-2">
                      {neighbors.slice(0, 8).map((neighbor, idx) => (
                        <RelatedEntityCard key={idx} neighbor={neighbor} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      No related entities found
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Linked Incidents */}
              <Card className="bg-background/30 border-border/30">
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                    Linked Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <IncidentList entityId={selectedEntity.id} />
                </CardContent>
              </Card>

              {/* Historical Changes */}
              <Card className="bg-background/30 border-border/30">
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-xs font-medium flex items-center gap-2">
                    <History className="w-3 h-3 text-primary" />
                    Recent Changes
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <ChangeHistory entityId={selectedEntity.id} />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium">
                  <ExternalLink className="w-3 h-3" />
                  Full Details
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors text-xs font-medium">
                  <Activity className="w-3 h-3" />
                  View Trends
                </button>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Bottom gradient */}
        {!isCollapsed && (
          <div className="h-1 bg-gradient-to-b from-primary/20 to-transparent rounded-b-xl" />
        )}
      </div>
    </>
  );
};

// Helper Components

const QuickStatsGrid = ({ entity }: { entity: SelectedEntity }) => {
  const stats = [
    { label: 'Status', value: 'Operational', icon: Shield, color: 'text-emerald-400' },
    { label: 'Risk Level', value: 'Low', icon: AlertTriangle, color: 'text-emerald-400' },
    { label: 'Last Update', value: '2m ago', icon: Clock, color: 'text-muted-foreground' },
    { label: 'Connections', value: '5', icon: Link2, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="p-2 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <stat.icon className={cn("w-3 h-3", stat.color)} />
            <span className="text-[10px] text-muted-foreground uppercase">{stat.label}</span>
          </div>
          <p className={cn("text-sm font-semibold", stat.color)}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

const RelatedEntityCard = ({ neighbor }: { neighbor: any }) => (
  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors text-left">
    <div className="p-1.5 rounded bg-primary/10">
      {getTypeIcon(neighbor.entity_type)}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium truncate">{neighbor.entity_name}</p>
      <p className="text-[10px] text-muted-foreground">
        {neighbor.relationship_type} • {neighbor.direction}
      </p>
    </div>
    <ChevronRight className="w-3 h-3 text-muted-foreground" />
  </button>
);

const IncidentList = ({ entityId }: { entityId: string }) => {
  const incidents = [
    { id: 1, title: 'Camera offline briefly', time: '2h ago', severity: 'low' },
    { id: 2, title: 'Maintenance scheduled', time: '1d ago', severity: 'info' },
  ];

  return (
    <div className="space-y-2">
      {incidents.map((incident) => (
        <div key={incident.id} className="flex items-center gap-2 p-2 rounded-lg bg-background/20">
          <Badge variant="outline" className={cn(
            "text-[8px]",
            incident.severity === 'low' ? 'border-amber-500/50 text-amber-400' : 'border-blue-500/50 text-blue-400'
          )}>
            {incident.severity}
          </Badge>
          <span className="text-xs flex-1 truncate">{incident.title}</span>
          <span className="text-[10px] text-muted-foreground">{incident.time}</span>
        </div>
      ))}
    </div>
  );
};

const ChangeHistory = ({ entityId }: { entityId: string }) => {
  const history = [
    { action: 'Status updated', time: '5m ago', by: 'System' },
    { action: 'Location verified', time: '2h ago', by: 'Admin' },
    { action: 'Created', time: '30d ago', by: 'Import' },
  ];

  return (
    <div className="space-y-2">
      {history.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="flex-1">{item.action}</span>
          <span className="text-muted-foreground">{item.time}</span>
        </div>
      ))}
    </div>
  );
};

// Utility functions
const getTypeIcon = (type: string | null) => {
  switch (type) {
    case 'cctv': return <Camera className="w-4 h-4" />;
    case 'traffic_signal': return <TrafficCone className="w-4 h-4" />;
    case 'incident': return <AlertTriangle className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const getTypeStyle = (type: string | null) => {
  switch (type) {
    case 'cctv': return { bg: 'bg-blue-500/20', text: 'text-blue-400' };
    case 'traffic_signal': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
    case 'incident': return { bg: 'bg-orange-500/20', text: 'text-orange-400' };
    default: return { bg: 'bg-primary/20', text: 'text-primary' };
  }
};

export default ContextPanel;