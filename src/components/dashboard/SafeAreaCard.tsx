import { memo } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Star } from 'lucide-react';
import SafetyScoreBadge from './SafetyScoreBadge';
import type { AreaSafetyData, TimeOfDay } from '@/data/capeTownSafetyData';
import { safetyLevelColors } from '@/data/capeTownSafetyData';

/**
 * SafeAreaCard — Card displaying area safety summary.
 * Used in Explore tabs and search results.
 */

interface SafeAreaCardProps {
  area: AreaSafetyData;
  timeOfDay: TimeOfDay;
  onClick: (area: AreaSafetyData) => void;
  className?: string;
}

const SafeAreaCard = memo(({ area, timeOfDay, onClick, className }: SafeAreaCardProps) => {
  const timeSafety = area.timeBasedSafety[timeOfDay];
  const topActivity = area.recommendedActivities[0];

  return (
    <button
      onClick={() => onClick(area)}
      className={cn(
        "w-full text-left rounded-xl border border-border bg-card overflow-hidden",
        "card-hover hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
    >
      {/* Color bar representing safety level */}
      <div className="h-1.5" style={{ backgroundColor: safetyLevelColors[area.safetyLevel] }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground truncate">{area.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {area.incidentCount.last7Days} incidents this week
              </span>
            </div>
          </div>
          <SafetyScoreBadge score={area.safetyScore} size="sm" />
        </div>

        {/* Current time safety */}
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground capitalize">{timeOfDay} safety</span>
          <span
            className="font-semibold tabular-nums"
            style={{ color: safetyLevelColors[timeSafety.color] }}
          >
            {timeSafety.score.toFixed(1)}/10
          </span>
        </div>

        {/* Top activity */}
        {topActivity && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 text-xs">
            <Star className="w-3 h-3 text-primary shrink-0" />
            <span className="text-foreground font-medium truncate">{topActivity.name}</span>
            <span className="text-muted-foreground ml-auto shrink-0">Best: {topActivity.bestTime}</span>
          </div>
        )}
      </div>
    </button>
  );
});

SafeAreaCard.displayName = 'SafeAreaCard';

export default SafeAreaCard;
