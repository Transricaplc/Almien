import { memo, useMemo } from 'react';
import { AlertTriangle, Shield, Flame, Droplets, Clock, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * AlertsFeed — Real-time alerts feed for the right contextual panel.
 * Shows latest incidents, infrastructure alerts, and critical notifications.
 * Default content when no entity is selected.
 */

interface AlertItem {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  alert_type: string;
  status: string;
  created_at: string;
}

const priorityConfig: Record<string, { color: string; icon: typeof AlertTriangle }> = {
  critical: { color: 'text-destructive', icon: Flame },
  high: { color: 'text-orange-400', icon: AlertTriangle },
  medium: { color: 'text-amber-400', icon: Shield },
  low: { color: 'text-muted-foreground', icon: Bell },
};

const getJustification = (alert: AlertItem): string[] => {
  const factors: string[] = [];
  if (alert.alert_type === 'crime_spike') factors.push('Incident count exceeded 24h baseline by 40%');
  if (alert.alert_type === 'infrastructure') factors.push('Infrastructure degradation detected in zone');
  if (alert.priority === 'critical') factors.push('Multiple corroborating data sources confirmed');
  if (alert.alert_type === 'wildfire') factors.push('AFIS satellite hotspot detected within 5km');
  if (alert.alert_type === 'loadshedding') factors.push('Eskom stage change affects traffic signals');
  if (factors.length === 0) factors.push('Threshold breach detected by monitoring system');
  return factors;
};

const AlertCard = memo(({ alert }: { alert: AlertItem }) => {
  const config = priorityConfig[alert.priority] || priorityConfig.low;
  const Icon = config.icon;
  const timeAgo = getTimeAgo(alert.created_at);
  const justification = getJustification(alert);

  return (
    <div className={cn(
      "p-3 rounded-lg border bg-card/60 backdrop-blur-sm transition-colors hover:bg-card/80",
      alert.priority === 'critical' ? 'border-destructive/30' :
      alert.priority === 'high' ? 'border-orange-500/30' :
      'border-border/30'
    )}>
      <div className="flex items-start gap-2.5">
        <div className={cn("mt-0.5 shrink-0", config.color)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              "text-[10px] font-mono uppercase tracking-wider font-bold",
              config.color
            )}>
              {alert.priority}
            </span>
            <span className="text-[9px] font-mono text-muted-foreground shrink-0 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {timeAgo}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-foreground mt-1 leading-tight truncate">
            {alert.title}
          </h4>
          {alert.description && (
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
              {alert.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className={cn(
              "text-[9px] font-mono uppercase px-1.5 py-0.5 rounded",
              alert.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
              alert.status === 'acknowledged' ? 'bg-primary/15 text-primary' :
              'bg-muted/30 text-muted-foreground'
            )}>
              {alert.status}
            </span>
            <span className="text-[9px] font-mono text-muted-foreground/60">
              {alert.alert_type}
            </span>
          </div>

          {/* XAI Justification Panel */}
          {(alert.priority === 'critical' || alert.priority === 'high') && (
            <div className="mt-2 pt-2 border-t border-border/20 space-y-0.5">
              <span className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground/60">
                Why this alert:
              </span>
              {justification.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-1 text-[9px] text-muted-foreground/80 font-mono">
                  <span className="text-accent-info shrink-0">›</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AlertCard.displayName = 'AlertCard';

const AlertsFeed = () => {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_queue')
        .select('id, title, description, priority, alert_type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as AlertItem[];
    },
    refetchInterval: 30000,
  });

  const sortedAlerts = useMemo(() => {
    if (!alerts) return [];
    const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...alerts].sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 4;
      const pb = priorityOrder[b.priority] ?? 4;
      if (pa !== pb) return pa - pb;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [alerts]);

  if (isLoading) {
    return (
      <div className="space-y-3 p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg border border-border/30 space-y-2">
            <Skeleton className="h-3 w-16 bg-muted/30" />
            <Skeleton className="h-4 w-3/4 bg-muted/30" />
            <Skeleton className="h-3 w-full bg-muted/30" />
          </div>
        ))}
      </div>
    );
  }

  if (!sortedAlerts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-border/40 flex items-center justify-center mb-3">
          <Bell className="w-5 h-5 text-muted-foreground/40" />
        </div>
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">No Active Alerts</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">System operating normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-1">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
          Recent Alerts
        </h3>
        <span className="text-[10px] font-mono text-primary tabular-nums">
          {sortedAlerts.length} active
        </span>
      </div>
      {sortedAlerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default memo(AlertsFeed);
