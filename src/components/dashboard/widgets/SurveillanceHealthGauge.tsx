import { memo, useMemo } from 'react';
import { Camera, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/**
 * Surveillance Health Gauge
 * Shows real-time % of functional CCTV nodes in the searched/selected area.
 */

const SurveillanceHealthGauge = memo(({ areaCode }: { areaCode?: string }) => {
  const { data } = useQuery({
    queryKey: ['cctv-health', areaCode],
    queryFn: async () => {
      let query = supabase.from('cctv_assets').select('status');
      if (areaCode) query = query.eq('area_code', areaCode);
      const { data, error } = await query.limit(500);
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  const stats = useMemo(() => {
    if (!data || data.length === 0) return { total: 0, online: 0, percent: 0 };
    const online = data.filter(c => c.status === 'operational').length;
    return { total: data.length, online, percent: Math.round((online / data.length) * 100) };
  }, [data]);

  const getHealthColor = (pct: number) => {
    if (pct >= 85) return 'text-accent-safe';
    if (pct >= 60) return 'text-accent-warning';
    return 'text-accent-threat';
  };

  const getHealthLabel = (pct: number) => {
    if (pct >= 85) return 'OPTIMAL';
    if (pct >= 60) return 'DEGRADED';
    return 'CRITICAL';
  };

  return (
    <div className="p-3 rounded-lg border border-border/30 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-accent-info" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Surveillance Health
          </span>
        </div>
        <span className={cn("text-[10px] font-mono font-bold uppercase tracking-wider", getHealthColor(stats.percent))}>
          {getHealthLabel(stats.percent)}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-2 rounded-full bg-muted/30 overflow-hidden mb-2">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
            stats.percent >= 85 ? 'bg-accent-safe' :
            stats.percent >= 60 ? 'bg-accent-warning' :
            'bg-accent-threat'
          )}
          style={{ width: `${stats.percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span className="tabular-nums">{stats.online}/{stats.total} nodes online</span>
        <span className={cn("font-bold tabular-nums", getHealthColor(stats.percent))}>
          {stats.percent}%
        </span>
      </div>
    </div>
  );
});

SurveillanceHealthGauge.displayName = 'SurveillanceHealthGauge';
export default SurveillanceHealthGauge;
