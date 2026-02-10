import { memo, useCallback, useState } from 'react';
import { 
  Layers, Filter, Search, X, ChevronUp, ChevronDown,
  AlertTriangle, Shield, Grid3X3, Clock,
  Eye, EyeOff, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

/**
 * Control Hub — Stabilized
 * 
 * Single expandable control center with tabbed navigation.
 * Rules:
 * - Docked position (bottom-left mobile, top-left desktop)
 * - No floating/dragging
 * - Auto-collapses on map interaction
 * - Tabs: Layers | Filters | Search — never stacked modals
 */

type Tab = 'layers' | 'filters' | 'search';
type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
type SeverityLevel = 'all' | 'low' | 'medium' | 'high' | 'critical';

export interface LayerConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  enabled: boolean;
  category: 'safety' | 'infrastructure' | 'operations';
  restrictedTo?: string[];
}

interface ControlHubProps {
  layers: LayerConfig[];
  onToggleLayer: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  severity: SeverityLevel;
  onSeverityChange: (level: SeverityLevel) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCollapseAll: () => void;
  className?: string;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

const ControlHub = memo(({
  layers,
  onToggleLayer,
  searchQuery,
  onSearchChange,
  timeRange,
  onTimeRangeChange,
  severity,
  onSeverityChange,
  isExpanded,
  onToggleExpand,
  onCollapseAll,
  className,
}: ControlHubProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('layers');
  
  const enabledCount = layers.filter(l => l.enabled).length;
  const timeRanges: TimeRange[] = ['1h', '6h', '24h', '7d', '30d'];
  const severityLevels: SeverityLevel[] = ['all', 'low', 'medium', 'high', 'critical'];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'filters', label: 'Filters', icon: Filter },
    { id: 'search', label: 'Search', icon: Search },
  ];

  const safetyLayers = layers.filter(l => l.category === 'safety');
  const infrastructureLayers = layers.filter(l => l.category === 'infrastructure');
  const operationsLayers = layers.filter(l => l.category === 'operations');

  return (
    <div 
      className={cn(
        "fixed z-30 transition-all duration-200 ease-out",
        "bottom-16 left-2 right-2 md:bottom-auto md:top-16 md:left-4 md:right-auto md:w-72",
        className
      )}
    >
      {/* Collapsed — compact toggle */}
      {!isExpanded && (
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 px-3 py-2 bg-card/95 backdrop-blur-xl rounded-lg border border-border/50 shadow-lg hover:border-primary/50 transition-all w-full md:w-auto"
        >
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">Controls</span>
          <Badge variant="secondary" className="ml-auto text-[10px] font-mono">
            {enabledCount}
          </Badge>
          <ChevronUp className="w-3 h-3 text-muted-foreground" />
        </button>
      )}

      {/* Expanded */}
      {isExpanded && (
        <div className="bg-card/98 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl shadow-black/30 overflow-hidden will-change-auto">
          {/* Tab Header */}
          <div className="flex items-center justify-between p-2 border-b border-border/30 bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <tab.icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={onCollapseAll}
              className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Tab Content — fixed max-height, no resize jitter */}
          <div className="max-h-[40vh] md:max-h-[50vh] overflow-y-auto scrollbar-visible">
            {activeTab === 'layers' && (
              <div className="p-3 space-y-3">
                <LayerGroup title="Safety" icon={<Shield className="w-3 h-3" />} layers={safetyLayers} onToggle={onToggleLayer} />
                <LayerGroup title="Infrastructure" icon={<Grid3X3 className="w-3 h-3" />} layers={infrastructureLayers} onToggle={onToggleLayer} />
                {operationsLayers.length > 0 && (
                  <LayerGroup title="Operations" icon={<AlertTriangle className="w-3 h-3" />} layers={operationsLayers} onToggle={onToggleLayer} />
                )}
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="p-3 space-y-4">
                <div>
                  <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time Range
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {timeRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => onTimeRangeChange(range)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
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
                <div>
                  <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Severity
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {severityLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => onSeverityChange(level)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                          severity === level
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search areas, wards, assets..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-9 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  {searchQuery && (
                    <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                <div className="mt-3 space-y-1.5">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Quick Search</p>
                  {['CBD', 'Sea Point', 'Khayelitsha', 'Claremont'].map((area) => (
                    <button
                      key={area}
                      onClick={() => onSearchChange(area)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                    >
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">{area}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-border/30 bg-muted/10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground">
              {enabledCount} layers active
            </span>
            <button
              onClick={() => layers.forEach(l => l.enabled && onToggleLayer(l.id))}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

ControlHub.displayName = 'ControlHub';

// Extracted sub-components for clarity
const LayerGroup = memo(({ title, icon, layers, onToggle }: { 
  title: string; icon: React.ReactNode; layers: LayerConfig[]; onToggle: (id: string) => void 
}) => (
  <div>
    <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
      {icon} {title}
    </h4>
    <div className="grid grid-cols-2 gap-1.5">
      {layers.map((layer) => (
        <LayerButton key={layer.id} layer={layer} onToggle={onToggle} />
      ))}
    </div>
  </div>
));

LayerGroup.displayName = 'LayerGroup';

const LayerButton = memo(({ layer, onToggle }: { layer: LayerConfig; onToggle: (id: string) => void }) => {
  const Icon = layer.icon;
  return (
    <button
      onClick={() => onToggle(layer.id)}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border transition-colors text-left",
        layer.enabled
          ? "bg-primary/10 border-primary/40"
          : "bg-muted/20 border-border/30 hover:border-primary/30"
      )}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{
          backgroundColor: layer.enabled ? layer.color : 'transparent',
          border: `2px solid ${layer.color}`,
        }}
      >
        <Icon className="w-2.5 h-2.5" style={{ color: layer.enabled ? 'white' : layer.color }} />
      </div>
      <span className={cn(
        "text-[10px] font-medium truncate",
        layer.enabled ? "text-foreground" : "text-muted-foreground"
      )}>
        {layer.name}
      </span>
      {layer.enabled ? (
        <Eye className="w-3 h-3 ml-auto text-primary shrink-0" />
      ) : (
        <EyeOff className="w-3 h-3 ml-auto text-muted-foreground/50 shrink-0" />
      )}
    </button>
  );
});

LayerButton.displayName = 'LayerButton';

export default ControlHub;
