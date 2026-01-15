import { Wind, Car, Umbrella, Waves, Mountain, AlertTriangle, RefreshCw } from 'lucide-react';
import { useWindReports, getSeverityColor, getWindDirectionIcon } from '@/hooks/useWindReports';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const WindReportPanel = () => {
  const { windReports, loading, error, refetch } = useWindReports();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || windReports.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Wind className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No wind data available</p>
        <button onClick={refetch} className="text-primary text-xs mt-2 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  const severityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      severe: 'bg-destructive/20 text-destructive border-destructive/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return colors[severity] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-3">
      {/* Header with Cape Doctor reference */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          Cape Town Wind Report
        </span>
        <button onClick={refetch} className="hover:text-foreground transition-colors">
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {windReports.map((report) => (
        <div
          key={report.id}
          className="p-3 rounded-lg bg-secondary/30 border border-border/40 hover:border-border/60 transition-all"
        >
          {/* Location & Severity */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: getSeverityColor(report.severity) }}>
                {getWindDirectionIcon(report.wind_direction)}
              </span>
              <div>
                <h4 className="text-sm font-medium text-foreground">{report.location}</h4>
                <p className="text-[10px] text-muted-foreground">{report.description}</p>
              </div>
            </div>
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[9px] font-medium border uppercase',
              severityBadge(report.severity)
            )}>
              {report.severity}
            </span>
          </div>

          {/* Wind Stats */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="text-center p-1.5 rounded bg-background/50">
              <p className="text-lg font-bold text-foreground">{report.wind_speed_kmh}</p>
              <p className="text-[9px] text-muted-foreground">km/h</p>
            </div>
            <div className="text-center p-1.5 rounded bg-background/50">
              <p className="text-lg font-bold text-orange-400">{report.wind_gust_kmh || '-'}</p>
              <p className="text-[9px] text-muted-foreground">gusts</p>
            </div>
            <div className="text-center p-1.5 rounded bg-background/50">
              <p className="text-lg font-bold text-foreground">{report.wind_direction}</p>
              <p className="text-[9px] text-muted-foreground">direction</p>
            </div>
          </div>

          {/* Affected Groups */}
          <div className="flex items-center gap-2 mb-2">
            {report.affects_drivers && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[9px]">
                <Car className="w-2.5 h-2.5" /> Drivers
              </span>
            )}
            {report.affects_beach_goers && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px]">
                <Umbrella className="w-2.5 h-2.5" /> Beach
              </span>
            )}
            {report.affects_surfers && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px]">
                <Waves className="w-2.5 h-2.5" /> Surfers
              </span>
            )}
            {report.affects_hikers && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px]">
                <Mountain className="w-2.5 h-2.5" /> Hikers
              </span>
            )}
          </div>

          {/* Advisory */}
          {report.advisory && (
            <div className="flex items-start gap-1.5 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-yellow-200/90 leading-relaxed">{report.advisory}</p>
            </div>
          )}
        </div>
      ))}

      {/* Cape Doctor info footer */}
      <p className="text-[9px] text-muted-foreground text-center italic">
        The "Cape Doctor" (SE wind) typically blows Oct-Mar, clearing pollution but creating hazardous driving conditions
      </p>
    </div>
  );
};

export default WindReportPanel;
