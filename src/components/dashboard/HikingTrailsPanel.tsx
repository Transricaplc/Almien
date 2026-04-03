import { memo, useMemo } from 'react';
import { Mountain, Clock, MapPin, AlertTriangle, Sun, Sunset, Bell } from 'lucide-react';
import { useHikingTrails, getDifficultyColor, getDifficultyLabel, formatDuration } from '@/hooks/useHikingTrails';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Sunset Trap logic: For Lion's Head and similar trails,
 * trigger a "Descent Required" warning 30 minutes before sunset.
 */
const getSunsetWarning = (sunsetTime: string | null, estimatedHours: number): string | null => {
  if (!sunsetTime) return null;
  const now = new Date();
  const [h, m] = sunsetTime.split(':').map(Number);
  const sunset = new Date();
  sunset.setHours(h, m, 0, 0);

  // Warning time = sunset - 30 minutes
  const warningTime = new Date(sunset.getTime() - 30 * 60 * 1000);
  // Latest safe start = sunset - estimated duration - 30 min buffer
  const latestStart = new Date(sunset.getTime() - (estimatedHours * 60 + 30) * 60 * 1000);

  if (now >= warningTime) {
    return 'DESCENT REQUIRED — Sunset imminent. Begin descent immediately.';
  }
  if (now >= latestStart) {
    const minsLeft = Math.round((warningTime.getTime() - now.getTime()) / 60000);
    return `⚠ ${minsLeft} min until descent deadline. Consider turning back.`;
  }
  return null;
};

const HikingTrailsPanel = memo(() => {
  const { trails, loading, getOpenTrails } = useHikingTrails();
  const openTrails = getOpenTrails();

  const trailsWithWarnings = useMemo(() => {
    return trails.map(trail => ({
      ...trail,
      sunsetWarning: getSunsetWarning(trail.sunset_time, Number(trail.estimated_hours)),
    }));
  }, [trails]);

  if (loading) {
    return (
      <div className="p-4 space-y-3 rounded-lg border border-border/30 bg-card/60">
        <Skeleton className="h-5 w-32 bg-muted/30" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full bg-muted/30" />)}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 rounded-lg border border-border/30 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Hiking Trails</span>
        </div>
        <Badge variant="outline" className="text-xs border-primary/30 text-primary font-mono">
          {openTrails.length}/{trails.length} Open
        </Badge>
      </div>

      <ScrollArea className="h-48">
        <div className="space-y-2 pr-2">
          {trailsWithWarnings.map(trail => (
            <div
              key={trail.id}
              className={cn(
                "rounded-lg p-3 transition-all border",
                trail.is_open
                  ? 'bg-card/40 border-border/20 hover:border-border/40'
                  : 'bg-card/20 border-accent-threat/20 opacity-60'
              )}
            >
              {/* Sunset Trap Warning */}
              {trail.sunsetWarning && (
                <div className="flex items-start gap-2 p-2 mb-2 rounded-md bg-accent-warning/10 border border-accent-warning/30">
                  <Bell className="w-3.5 h-3.5 text-accent-warning mt-0.5 shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-accent-warning">
                    {trail.sunsetWarning}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{trail.name}</span>
                    {!trail.is_open && <AlertTriangle className="w-3 h-3 text-accent-threat" />}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground">{trail.location}</span>
                  </div>
                </div>
                <Badge
                  className="text-xs font-mono shrink-0"
                  style={{
                    backgroundColor: `${getDifficultyColor(trail.difficulty)}20`,
                    color: getDifficultyColor(trail.difficulty),
                    border: `1px solid ${getDifficultyColor(trail.difficulty)}40`
                  }}
                >
                  {getDifficultyLabel(trail.difficulty)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="font-mono tabular-nums">{trail.distance_km}km</span>
                <span className="font-mono tabular-nums">↑{trail.elevation_gain_m}m</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono tabular-nums">{formatDuration(Number(trail.estimated_hours))}</span>
                </div>
              </div>

              {(trail.sunrise_time || trail.sunset_time) && (
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/10">
                  {trail.sunrise_time && (
                    <div className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-accent-warning" />
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">{trail.sunrise_time.slice(0, 5)}</span>
                    </div>
                  )}
                  {trail.sunset_time && (
                    <div className="flex items-center gap-1">
                      <Sunset className="w-3 h-3 text-accent-threat" />
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">{trail.sunset_time.slice(0, 5)}</span>
                    </div>
                  )}
                </div>
              )}

              {trail.safety_notes && (
                <p className="text-xs text-muted-foreground/60 mt-2 line-clamp-1">{trail.safety_notes}</p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});

HikingTrailsPanel.displayName = 'HikingTrailsPanel';
export default HikingTrailsPanel;
