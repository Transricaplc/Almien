import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Clock, ChevronDown, ChevronUp, TrendingDown } from 'lucide-react';

const periods = [
  {
    id: 'morning', label: '🌅 Morning', time: '6 AM – 12 PM', score: 8.5, incidents: 42,
    breakdown: [
      { type: 'Theft', count: 18, pct: 43 },
      { type: 'Vehicle Crime', count: 12, pct: 29 },
      { type: 'Property', count: 8, pct: 19 },
      { type: 'Other', count: 4, pct: 9 },
    ],
    trend: '↓ 12% vs. last period',
  },
  {
    id: 'day', label: '☀️ Day', time: '12 PM – 6 PM', score: 7.8, incidents: 58,
    breakdown: [
      { type: 'Theft', count: 22, pct: 38 },
      { type: 'Robbery', count: 14, pct: 24 },
      { type: 'Vehicle Crime', count: 12, pct: 21 },
      { type: 'Other', count: 10, pct: 17 },
    ],
    trend: '↔ Stable',
  },
  {
    id: 'evening', label: '🌆 Evening', time: '6 PM – 12 AM', score: 5.8, incidents: 85,
    breakdown: [
      { type: 'Robbery', count: 30, pct: 35 },
      { type: 'Theft', count: 25, pct: 29 },
      { type: 'Assault', count: 18, pct: 21 },
      { type: 'Other', count: 12, pct: 15 },
    ],
    trend: '↑ 5% vs. last period',
  },
  {
    id: 'night', label: '🌙 Night', time: '12 AM – 6 AM', score: 4.2, incidents: 65,
    breakdown: [
      { type: 'Robbery', count: 25, pct: 38 },
      { type: 'Assault', count: 20, pct: 31 },
      { type: 'Vehicle Crime', count: 12, pct: 18 },
      { type: 'Other', count: 8, pct: 13 },
    ],
    trend: '↓ 3% vs. last period',
  },
];

function getCurrentPeriod(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'day';
  if (h >= 18) return 'evening';
  return 'night';
}

function scoreColor(s: number) {
  if (s >= 7) return 'text-safety-green';
  if (s >= 5) return 'text-safety-yellow';
  return 'text-safety-red';
}

interface Props {
  /** Show compact horizontal pills only (for map/route) or expandable detail (for dashboard) */
  variant?: 'compact' | 'detail';
  className?: string;
}

const TimeRiskStrip = memo(({ variant = 'compact', className }: Props) => {
  const currentPeriod = getCurrentPeriod();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (variant === 'compact') {
    return (
      <div className={cn("flex gap-2 overflow-x-auto pb-1 scrollbar-visible", className)}>
        {periods.map(p => (
          <div
            key={p.id}
            className={cn(
              "shrink-0 px-3 py-2 rounded-xl border bg-card min-w-[100px]",
              p.id === currentPeriod ? "border-primary/40 bg-primary/5" : "border-border"
            )}
          >
            <p className="text-xs font-semibold text-foreground">{p.label}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={cn("text-sm font-bold tabular-nums", scoreColor(p.score))}>{p.score}</span>
              <span className="text-[10px] text-muted-foreground">/ 10</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{p.incidents} inc.</p>
          </div>
        ))}
      </div>
    );
  }

  // Detail variant — accordion for dashboard
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">Time-of-Day Risk</h3>
        <span className="text-[10px] text-muted-foreground ml-auto">Updated today</span>
      </div>
      {periods.map(p => {
        const isOpen = expanded === p.id;
        const isCurrent = p.id === currentPeriod;
        return (
          <div key={p.id} className={cn(
            "rounded-xl border bg-card overflow-hidden",
            isCurrent ? "border-primary/30" : "border-border"
          )}>
            <button
              onClick={() => setExpanded(isOpen ? null : p.id)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">{p.label}</span>
                <span className="text-[10px] text-muted-foreground">{p.time}</span>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[9px] font-bold">NOW</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold tabular-nums", scoreColor(p.score))}>{p.score}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            {isOpen && (
              <div className="px-3 pb-3 border-t border-border pt-2 space-y-2 animate-fade-in">
                {p.breakdown.map(b => (
                  <div key={b.type} className="flex items-center gap-2">
                    <span className="text-xs text-foreground w-24 shrink-0">{b.type}</span>
                    <div className="flex-1 bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${b.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-10 text-right">{b.pct}%</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                  <TrendingDown className="w-3 h-3" />
                  <span>{p.trend}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

TimeRiskStrip.displayName = 'TimeRiskStrip';
export default TimeRiskStrip;
