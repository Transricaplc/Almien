import { useState, useCallback } from 'react';
import { 
  ChevronDown, ChevronUp, Eye, EyeOff, Users, UserCheck, Shield,
  Map, AlertTriangle, Grid3X3, Camera, Flame, Building, Route,
  Clock, Download, Share2, ArrowUpDown, Filter, Settings, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

/**
 * Control Panel - Left Sidebar
 * Accordion-based with only one section expanded at a time
 * Contains: View Mode, Data Layers, Filters, Actions
 */

export type ViewMode = 'citizen' | 'analyst' | 'responder';
export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
export type SeverityLevel = 'all' | 'low' | 'medium' | 'high' | 'critical';

export interface LayerConfig {
  id: string;
  name: string;
  icon: typeof Map;
  color: string;
  enabled: boolean;
  category: 'safety' | 'infrastructure' | 'operations';
  restrictedTo?: ViewMode[];
}

interface ControlPanelProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  layers: LayerConfig[];
  onToggleLayer: (id: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  severity: SeverityLevel;
  onSeverityChange: (level: SeverityLevel) => void;
  className?: string;
}

type AccordionSection = 'view' | 'layers' | 'filters' | 'actions' | null;

const ControlPanel = ({
  viewMode,
  onViewModeChange,
  layers,
  onToggleLayer,
  timeRange,
  onTimeRangeChange,
  severity,
  onSeverityChange,
  className,
}: ControlPanelProps) => {
  const [openSection, setOpenSection] = useState<AccordionSection>('layers');

  const toggleSection = (section: AccordionSection) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  // Filter layers based on current view mode
  const visibleLayers = layers.filter(layer => {
    if (!layer.restrictedTo) return true;
    return layer.restrictedTo.includes(viewMode);
  });

  const safetyLayers = visibleLayers.filter(l => l.category === 'safety');
  const infraLayers = visibleLayers.filter(l => l.category === 'infrastructure');
  const opsLayers = visibleLayers.filter(l => l.category === 'operations');

  return (
    <aside 
      className={cn(
        "w-64 bg-card/80 backdrop-blur-xl border-r border-border/50",
        "flex flex-col h-full overflow-hidden",
        className
      )}
      role="complementary"
      aria-label="Map controls"
    >
      {/* Panel Header */}
      <div className="px-3 py-3 border-b border-border/30 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Controls</span>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="flex-1 overflow-y-auto scrollbar-visible">
        {/* Zone 1: View Mode Selector */}
        <AccordionItem
          title="View Mode"
          icon={Users}
          isOpen={openSection === 'view'}
          onToggle={() => toggleSection('view')}
        >
          <div className="space-y-1.5">
            <ViewModeButton
              mode="citizen"
              label="Citizen"
              description="Safety awareness"
              icon={Users}
              isActive={viewMode === 'citizen'}
              onClick={() => onViewModeChange('citizen')}
            />
            <ViewModeButton
              mode="analyst"
              label="Analyst"
              description="Pattern recognition"
              icon={UserCheck}
              isActive={viewMode === 'analyst'}
              onClick={() => onViewModeChange('analyst')}
            />
            <ViewModeButton
              mode="responder"
              label="Responder"
              description="Coordination & routing"
              icon={Shield}
              isActive={viewMode === 'responder'}
              onClick={() => onViewModeChange('responder')}
            />
          </div>
        </AccordionItem>

        {/* Zone 2: Data Layer Toggles */}
        <AccordionItem
          title="Data Layers"
          icon={Layers}
          isOpen={openSection === 'layers'}
          onToggle={() => toggleSection('layers')}
          badge={`${visibleLayers.filter(l => l.enabled).length}/${visibleLayers.length}`}
        >
          <div className="space-y-3">
            {/* Safety Layers */}
            {safetyLayers.length > 0 && (
              <LayerGroup title="Safety" layers={safetyLayers} onToggle={onToggleLayer} />
            )}
            
            {/* Infrastructure Layers */}
            {infraLayers.length > 0 && (
              <LayerGroup title="Infrastructure" layers={infraLayers} onToggle={onToggleLayer} />
            )}
            
            {/* Operations Layers - Only for Analyst/Responder */}
            {opsLayers.length > 0 && (
              <LayerGroup title="Operations" layers={opsLayers} onToggle={onToggleLayer} />
            )}
          </div>
        </AccordionItem>

        {/* Zone 3: Filters */}
        <AccordionItem
          title="Filters"
          icon={Filter}
          isOpen={openSection === 'filters'}
          onToggle={() => toggleSection('filters')}
        >
          <div className="space-y-4">
            {/* Time Range */}
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Time Range
              </label>
              <div className="flex flex-wrap gap-1">
                {(['1h', '6h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => onTimeRangeChange(range)}
                    className={cn(
                      "px-2 py-1 rounded text-[10px] font-mono transition-all",
                      timeRange === range
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Severity Threshold
              </label>
              <div className="flex flex-wrap gap-1">
                {(['all', 'low', 'medium', 'high', 'critical'] as SeverityLevel[]).map((level) => {
                  const colors: Record<SeverityLevel, string> = {
                    all: 'bg-muted/30',
                    low: 'bg-emerald-500/20 border-emerald-500/50',
                    medium: 'bg-yellow-500/20 border-yellow-500/50',
                    high: 'bg-orange-500/20 border-orange-500/50',
                    critical: 'bg-red-500/20 border-red-500/50',
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => onSeverityChange(level)}
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-mono transition-all border",
                        severity === level
                          ? cn(colors[level], "border-current")
                          : "bg-muted/20 border-transparent text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* Zone 4: Actions */}
        <AccordionItem
          title="Actions"
          icon={Settings}
          isOpen={openSection === 'actions'}
          onToggle={() => toggleSection('actions')}
        >
          <div className="space-y-2">
            <ActionButton icon={Download} label="Export Snapshot" />
            <ActionButton icon={Share2} label="Share Map View" />
            <ActionButton icon={ArrowUpDown} label="Switch City / Ward" />
          </div>
        </AccordionItem>
      </div>

      {/* Active Layers Summary */}
      <div className="px-3 py-2 border-t border-border/30 bg-background/30">
        <div className="text-[9px] font-mono text-muted-foreground">
          <span className="text-primary font-medium">{visibleLayers.filter(l => l.enabled).length}</span> layers active • 
          <span className="ml-1">{timeRange}</span> range
        </div>
      </div>
    </aside>
  );
};

// Accordion Item Component
const AccordionItem = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  badge,
  children,
}: {
  title: string;
  icon: typeof Map;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}) => (
  <Collapsible open={isOpen} onOpenChange={onToggle}>
    <CollapsibleTrigger asChild>
      <button
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 border-b border-border/20",
          "hover:bg-muted/30 transition-colors",
          isOpen && "bg-muted/20"
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-primary/20 text-primary">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="px-3 py-3 bg-background/20">
        {children}
      </div>
    </CollapsibleContent>
  </Collapsible>
);

// View Mode Button
const ViewModeButton = ({
  mode,
  label,
  description,
  icon: Icon,
  isActive,
  onClick,
}: {
  mode: ViewMode;
  label: string;
  description: string;
  icon: typeof Users;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left",
      isActive
        ? "bg-primary/15 border-primary/50 text-foreground"
        : "bg-muted/10 border-border/30 text-muted-foreground hover:border-primary/30 hover:bg-muted/20"
    )}
  >
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center",
      isActive ? "bg-primary text-primary-foreground" : "bg-muted/30"
    )}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-[10px] text-muted-foreground">{description}</div>
    </div>
  </button>
);

// Layer Group
const LayerGroup = ({
  title,
  layers,
  onToggle,
}: {
  title: string;
  layers: LayerConfig[];
  onToggle: (id: string) => void;
}) => (
  <div>
    <div className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
      {title}
    </div>
    <div className="space-y-1">
      {layers.map(layer => (
        <LayerToggle key={layer.id} layer={layer} onToggle={onToggle} />
      ))}
    </div>
  </div>
);

// Layer Toggle
const LayerToggle = ({
  layer,
  onToggle,
}: {
  layer: LayerConfig;
  onToggle: (id: string) => void;
}) => {
  const Icon = layer.icon;
  return (
    <button
      onClick={() => onToggle(layer.id)}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all",
        layer.enabled
          ? "bg-background/50 border border-primary/30"
          : "hover:bg-muted/30 border border-transparent"
      )}
      style={layer.enabled ? { boxShadow: `0 0 8px ${layer.color}20` } : {}}
    >
      <div
        className="w-5 h-5 rounded flex items-center justify-center"
        style={{
          backgroundColor: layer.enabled ? layer.color : 'transparent',
          border: `1.5px solid ${layer.color}`,
        }}
      >
        <Icon
          className="w-3 h-3"
          style={{ color: layer.enabled ? 'white' : layer.color }}
        />
      </div>
      <span className={cn(
        "text-[11px] font-medium flex-1 text-left",
        layer.enabled ? "text-foreground" : "text-muted-foreground"
      )}>
        {layer.name}
      </span>
      {layer.enabled ? (
        <Eye className="w-3 h-3 text-primary" />
      ) : (
        <EyeOff className="w-3 h-3 text-muted-foreground/50" />
      )}
    </button>
  );
};

// Action Button
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Download;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/40 hover:border-primary/30 transition-all"
  >
    <Icon className="w-3.5 h-3.5 text-primary" />
    <span className="text-[11px] font-medium text-foreground">{label}</span>
  </button>
);

export default ControlPanel;
