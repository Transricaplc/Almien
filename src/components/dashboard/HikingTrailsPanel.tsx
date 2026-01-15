import { Mountain, Clock, MapPin, AlertTriangle, Sun, Sunset } from 'lucide-react';
import { useHikingTrails, getDifficultyColor, getDifficultyLabel, formatDuration } from '@/hooks/useHikingTrails';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const HikingTrailsPanel = () => {
  const { trails, loading, getOpenTrails } = useHikingTrails();
  const openTrails = getOpenTrails();

  if (loading) {
    return (
      <div className="glass-panel p-4 space-y-3">
        <Skeleton className="h-5 w-32 bg-white/10" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-white/90">Hiking Trails</span>
        </div>
        <Badge variant="outline" className="text-xs border-emerald-400/30 text-emerald-400">
          {openTrails.length}/{trails.length} Open
        </Badge>
      </div>

      {/* Trails List */}
      <ScrollArea className="h-48">
        <div className="space-y-2 pr-2">
          {trails.map(trail => (
            <div 
              key={trail.id}
              className={`bg-black/30 border rounded-lg p-3 transition-all ${
                trail.is_open 
                  ? 'border-white/10 hover:border-white/20' 
                  : 'border-red-500/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/90">{trail.name}</span>
                    {!trail.is_open && (
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-white/40" />
                    <span className="text-xs text-white/50">{trail.location}</span>
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

              {/* Stats Row */}
              <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                <div className="flex items-center gap-1">
                  <span className="font-mono">{trail.distance_km}km</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono">↑{trail.elevation_gain_m}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">{formatDuration(Number(trail.estimated_hours))}</span>
                </div>
              </div>

              {/* Sunrise/Sunset Times */}
              {(trail.sunrise_time || trail.sunset_time) && (
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
                  {trail.sunrise_time && (
                    <div className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-mono text-white/40">{trail.sunrise_time.slice(0, 5)}</span>
                    </div>
                  )}
                  {trail.sunset_time && (
                    <div className="flex items-center gap-1">
                      <Sunset className="w-3 h-3 text-orange-400" />
                      <span className="text-xs font-mono text-white/40">{trail.sunset_time.slice(0, 5)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Safety Notes */}
              {trail.safety_notes && (
                <p className="text-xs text-white/40 mt-2 line-clamp-1">{trail.safety_notes}</p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HikingTrailsPanel;
