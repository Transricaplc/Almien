import { memo } from 'react';
import { Clock, CheckCircle2, AlertCircle, TrendingUp, ArrowRight, Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Municipal Performance Widget
 * Tracks citizen report resolution times and infrastructure fault aging.
 */

interface FaultEntry {
  id: string;
  type: string;
  area: string;
  reportedDaysAgo: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'dispatched' | 'resolved';
}

const performanceData = {
  avgResolutionHours: 18.4,
  resolvedToday: 12,
  pendingTotal: 34,
  dispatchedTotal: 8,
  resolutionTrend: -2.3, // negative = improving
};

const infrastructureFaults: FaultEntry[] = [
  { id: '1', type: 'Pothole', area: 'Observatory', reportedDaysAgo: 14, severity: 'high', status: 'dispatched' },
  { id: '2', type: 'Water Burst', area: 'Woodstock', reportedDaysAgo: 2, severity: 'critical', status: 'dispatched' },
  { id: '3', type: 'Streetlight', area: 'Claremont', reportedDaysAgo: 21, severity: 'medium', status: 'pending' },
  { id: '4', type: 'Pothole', area: 'Bellville', reportedDaysAgo: 7, severity: 'high', status: 'pending' },
  { id: '5', type: 'Sewer', area: 'Athlone', reportedDaysAgo: 30, severity: 'critical', status: 'pending' },
  { id: '6', type: 'Traffic Signal', area: 'Goodwood', reportedDaysAgo: 3, severity: 'medium', status: 'resolved' },
];

const severityStyles = {
  critical: 'bg-destructive/20 text-destructive',
  high: 'bg-safety-orange/20 text-safety-orange',
  medium: 'bg-safety-yellow/20 text-safety-yellow',
  low: 'bg-safety-green/20 text-safety-green',
};

const statusStyles = {
  pending: 'bg-muted text-muted-foreground',
  dispatched: 'bg-primary/20 text-primary',
  resolved: 'bg-safety-green/20 text-safety-green',
};

const MunicipalPerformance = memo(() => {
  const sortedFaults = [...infrastructureFaults].sort((a, b) => {
    const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (sevOrder[a.severity] !== sevOrder[b.severity]) return sevOrder[a.severity] - sevOrder[b.severity];
    return b.reportedDaysAgo - a.reportedDaysAgo;
  });

  return (
    <div className="space-y-6">
      {/* Performance KPIs */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-foreground text-sm">Municipal Performance</h3>
          </div>
          <Badge variant="secondary" className="text-[10px]">Live Metrics</Badge>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold text-foreground">{performanceData.avgResolutionHours}h</div>
              <div className="text-[10px] text-muted-foreground">Avg Resolution</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-safety-green" />
              <div className="text-xl font-bold text-foreground">{performanceData.resolvedToday}</div>
              <div className="text-[10px] text-muted-foreground">Resolved Today</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <AlertCircle className="w-4 h-4 mx-auto mb-1 text-safety-orange" />
              <div className="text-xl font-bold text-foreground">{performanceData.pendingTotal}</div>
              <div className="text-[10px] text-muted-foreground">Pending</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-safety-green" />
              <div className="text-xl font-bold text-safety-green">{performanceData.resolutionTrend}h</div>
              <div className="text-[10px] text-muted-foreground">Trend (faster)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Faults — sorted by severity + age */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-destructive/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Construction className="w-4 h-4 text-destructive" />
            <h3 className="font-bold text-foreground text-sm">Infrastructure Faults</h3>
          </div>
          <Badge variant="outline" className="text-[10px]">
            {sortedFaults.length} active
          </Badge>
        </div>

        <div className="divide-y divide-border">
          {sortedFaults.map(fault => (
            <div key={fault.id} className={cn(
              "px-4 py-3 flex items-center gap-3 transition-colors hover:bg-muted/30",
              fault.reportedDaysAgo >= 14 && "bg-destructive/5"
            )}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{fault.type}</span>
                  <Badge className={cn("text-[9px]", severityStyles[fault.severity])}>
                    {fault.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {fault.area} · {fault.reportedDaysAgo}d ago
                  {fault.reportedDaysAgo >= 14 && (
                    <span className="text-destructive font-semibold ml-1">⚠ OVERDUE</span>
                  )}
                </div>
              </div>
              <Badge className={cn("text-[9px] shrink-0", statusStyles[fault.status])}>
                {fault.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

MunicipalPerformance.displayName = 'MunicipalPerformance';
export default MunicipalPerformance;
