import { Train, Camera, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { useTrainRoutes } from '@/hooks/useTrainRoutes';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const getSafetyColor = (score: number): string => {
  if (score >= 70) return 'hsl(160 84% 39%)';
  if (score >= 50) return 'hsl(38 92% 50%)';
  if (score >= 35) return 'hsl(25 95% 53%)';
  return 'hsl(0 84% 60%)';
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-destructive/20', text: 'text-destructive', label: 'CRITICAL' },
  high_risk: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'HIGH RISK' },
  moderate: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'MODERATE' },
  safe: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'SAFE' },
};

const TrainRoutesPanel = () => {
  const { trainRoutes, loading, error, refetch } = useTrainRoutes();

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || trainRoutes.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Train className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No train data available</p>
        <button onClick={refetch} className="text-primary text-xs mt-2 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span className="flex items-center gap-1">
          <Train className="w-3 h-3" />
          Metrorail Cape Town
        </span>
        <button onClick={refetch} className="hover:text-foreground transition-colors">
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {trainRoutes.map((train) => {
        const style = statusStyles[train.status] || statusStyles.moderate;
        const cameraPercent = Math.round((train.operating_cameras / train.total_cameras) * 100);

        return (
          <div
            key={train.id}
            className={cn(
              'p-3 rounded-lg border transition-all hover:border-border/60',
              style.bg,
              'border-border/40'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">{train.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{train.stations} stations</p>
                </div>
              </div>
              <span className={cn(
                'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                style.bg,
                style.text
              )}>
                {style.label}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background/30">
                <Shield className="w-3 h-3" style={{ color: getSafetyColor(train.safety_score) }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: getSafetyColor(train.safety_score) }}>
                    {train.safety_score}%
                  </p>
                  <p className="text-[8px] text-muted-foreground">Safety</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background/30">
                <Camera className="w-3 h-3 text-muted-foreground" />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {train.operating_cameras}/{train.total_cameras}
                  </p>
                  <p className="text-[8px] text-muted-foreground">{cameraPercent}% up</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background/30">
                <AlertTriangle className="w-3 h-3 text-destructive" />
                <div>
                  <p className="text-xs font-bold text-destructive">{train.incidents_24h}</p>
                  <p className="text-[8px] text-muted-foreground">24h</p>
                </div>
              </div>
            </div>

            {/* Operational status */}
            {!train.is_operational && (
              <div className="mt-2 px-2 py-1 rounded bg-destructive/20 text-destructive text-[10px] text-center">
                Service Currently Suspended
              </div>
            )}
          </div>
        );
      })}

      <p className="text-[9px] text-muted-foreground text-center">
        Data from PRASA security feeds • Updated live
      </p>
    </div>
  );
};

export default TrainRoutesPanel;
