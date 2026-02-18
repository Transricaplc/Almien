import { memo } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Building2, Shield, Stethoscope, ChevronRight } from 'lucide-react';
import SafetyScoreBadge from './SafetyScoreBadge';
import { getScoreLabel } from './SafetyScoreBadge';
import type { AreaSafetyData, TimeOfDay } from '@/data/capeTownSafetyData';
import { safetyLevelColors } from '@/data/capeTownSafetyData';

/**
 * AreaDetailPanel — Right-side slide-in panel showing area details.
 * Shows safety score, facilities, tips, and activities.
 */

interface AreaDetailPanelProps {
  area: AreaSafetyData;
  timeOfDay: TimeOfDay;
  onClose: () => void;
  className?: string;
}

const facilityIcons = {
  hospital: Stethoscope,
  police: Shield,
  fire_station: Building2,
};

const AreaDetailPanel = memo(({ area, timeOfDay, onClose, className }: AreaDetailPanelProps) => {
  const currentTimeSafety = area.timeBasedSafety[timeOfDay];
  const statusColor = safetyLevelColors[currentTimeSafety.color];

  return (
    <div className={cn(
      "h-full flex flex-col bg-card border-l border-border animate-slide-in-right",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <h2 className="text-lg font-bold text-foreground truncate">{area.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: statusColor }}
              >
                {getScoreLabel(currentTimeSafety.score)}
              </span>
              <span className="text-xs text-muted-foreground">
                {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
              </span>
            </div>
          </div>
          <SafetyScoreBadge score={area.safetyScore} size="lg" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Time-based scores */}
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Safety by Time of Day
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {(['morning', 'day', 'evening', 'night'] as TimeOfDay[]).map((t) => {
              const s = area.timeBasedSafety[t];
              return (
                <div
                  key={t}
                  className={cn(
                    "text-center p-2 rounded-lg border transition-all",
                    t === timeOfDay ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div
                    className="text-sm font-bold tabular-nums"
                    style={{ color: safetyLevelColors[s.color] }}
                  >
                    {s.score.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-muted-foreground capitalize">{t}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident Summary */}
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Incident Summary
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground tabular-nums">
                {area.incidentCount.last7Days}
              </div>
              <div className="text-[10px] text-muted-foreground">7 Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground tabular-nums">
                {area.incidentCount.last30Days}
              </div>
              <div className="text-[10px] text-muted-foreground">30 Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-muted-foreground tabular-nums">
                {area.incidentCount.last12Months}
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                12 Mo
                <span className="text-[8px] bg-elite-gradient text-white px-1 rounded">ELITE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Activities */}
        {area.recommendedActivities.length > 0 && (
          <div className="p-4 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Recommended Activities
            </h3>
            <div className="space-y-2">
              {area.recommendedActivities.slice(0, 3).map((act) => (
                <div
                  key={act.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">{act.name}</div>
                    <div className="text-xs text-muted-foreground">Best: {act.bestTime}</div>
                  </div>
                  <SafetyScoreBadge score={act.safetyScore} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Facilities */}
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Nearby Facilities
          </h3>
          <div className="space-y-2">
            {area.nearbyFacilities.map((fac) => {
              const Icon = facilityIcons[fac.type] || Building2;
              return (
                <div key={fac.name} className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{fac.name}</div>
                    <div className="text-xs text-muted-foreground">{fac.distance}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Safety Tips
          </h3>
          <ul className="space-y-2">
            {area.safetyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onClose}
          className="w-full py-2 px-4 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
});

AreaDetailPanel.displayName = 'AreaDetailPanel';

export default AreaDetailPanel;
