import { useState } from 'react';
import { ChevronUp, ChevronDown, X, Clock, AlertTriangle, Activity, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';
import LiveReportFeed from './LiveReportFeed';
import EnvironmentalCluster from './EnvironmentalCluster';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Context Drawer - Bottom On-Demand Drawer
 * Shows contextual information and recent activity
 * Can be expanded/collapsed
 */
const ContextDrawer = () => {
  const { selectedEntity } = useDashboard();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'environmental' | 'details'>('activity');

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-card/95 backdrop-blur-xl border-t border-border/50",
        "transition-all duration-300 ease-out",
        isExpanded ? "h-64" : "h-10"
      )}
    >
      {/* Header / Toggle Bar */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
            <span>Context</span>
          </button>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Last 24h</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-3 h-3" />
              <span>12 alerts</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {isExpanded && (
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5">
            {(['activity', 'environmental', 'details'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1 rounded-md text-[10px] font-medium transition-all",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}

        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <ScrollArea className="h-[calc(100%-48px)] scrollbar-visible">
          <div className="p-4">
            {activeTab === 'activity' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Recent Activity
                  </h3>
                  <LiveReportFeed />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Active Alerts
                  </h3>
                  <div className="space-y-2">
                    <AlertItem
                      title="Water Outage"
                      location="Sea Point"
                      time="15 min ago"
                      severity="medium"
                    />
                    <AlertItem
                      title="Traffic Congestion"
                      location="N2 Highway"
                      time="32 min ago"
                      severity="low"
                    />
                    <AlertItem
                      title="Wildfire Alert"
                      location="Table Mountain"
                      time="2h ago"
                      severity="high"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'environmental' && (
              <div className="max-w-xl">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Environmental Conditions
                </h3>
                <EnvironmentalCluster />
              </div>
            )}

            {activeTab === 'details' && selectedEntity && (
              <div className="max-w-xl">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedEntity.name}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p>Type: {selectedEntity.type}</p>
                  {selectedEntity.coordinates && (
                    <p className="font-mono text-xs mt-1">
                      {selectedEntity.coordinates.lat.toFixed(6)}, {selectedEntity.coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'details' && !selectedEntity && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a location on the map to see details</p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

// Alert Item Component
const AlertItem = ({
  title,
  location,
  time,
  severity,
}: {
  title: string;
  location: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}) => {
  const severityColors = {
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-2.5 rounded-lg border",
      severityColors[severity]
    )}>
      <div>
        <div className="text-xs font-medium text-foreground">{title}</div>
        <div className="text-[10px] text-muted-foreground">{location}</div>
      </div>
      <div className="text-[10px] font-mono">{time}</div>
    </div>
  );
};

export default ContextDrawer;
