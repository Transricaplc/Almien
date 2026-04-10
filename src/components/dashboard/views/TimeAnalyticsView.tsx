import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, TrendingDown, Lock, ArrowRight } from 'lucide-react';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const periods = [
  {
    id: 'morning', label: '🌅 MORNING (6 AM - 12 PM)', score: 8.5, incidents: 42,
    breakdown: [
      { type: 'Theft', count: 18, pct: 43 },
      { type: 'Vehicle Crime', count: 12, pct: 29 },
      { type: 'Property', count: 8, pct: 19 },
      { type: 'Other', count: 4, pct: 9 },
    ],
    hotspots: [
      { area: 'City Centre', count: 15 },
      { area: 'Woodstock', count: 8 },
      { area: 'Sea Point', count: 6 },
    ],
    trend: '↓ Declining 12% vs. last period',
  },
  {
    id: 'day', label: '☀️ DAY (12 PM - 6 PM)', score: 7.8, incidents: 58,
    breakdown: [
      { type: 'Theft', count: 22, pct: 38 },
      { type: 'Robbery', count: 14, pct: 24 },
      { type: 'Vehicle Crime', count: 12, pct: 21 },
      { type: 'Other', count: 10, pct: 17 },
    ],
    hotspots: [
      { area: 'City Centre', count: 20 },
      { area: 'Woodstock', count: 12 },
      { area: 'Observatory', count: 8 },
    ],
    trend: '↔ Stable vs. last period',
  },
  {
    id: 'evening', label: '🌆 EVENING (6 PM - 12 AM)', score: 5.8, incidents: 85,
    breakdown: [
      { type: 'Robbery', count: 30, pct: 35 },
      { type: 'Theft', count: 25, pct: 29 },
      { type: 'Assault', count: 18, pct: 21 },
      { type: 'Other', count: 12, pct: 15 },
    ],
    hotspots: [
      { area: 'City Centre', count: 28 },
      { area: 'Woodstock', count: 18 },
      { area: 'Observatory', count: 14 },
    ],
    trend: '↑ Increasing 5% vs. last period',
  },
  {
    id: 'night', label: '🌙 NIGHT (12 AM - 6 AM) ⚠️ Highest risk', score: 4.2, incidents: 65,
    breakdown: [
      { type: 'Robbery', count: 25, pct: 38 },
      { type: 'Assault', count: 20, pct: 31 },
      { type: 'Vehicle Crime', count: 12, pct: 18 },
      { type: 'Other', count: 8, pct: 13 },
    ],
    hotspots: [
      { area: 'City Centre', count: 22 },
      { area: "Mitchell's Plain", count: 18 },
      { area: 'Khayelitsha', count: 15 },
    ],
    trend: '↓ Declining 3% vs. last period',
  },
];

const TimeAnalyticsView = memo(({ onUpgrade }: Props) => {
  const [expanded, setExpanded] = useState<string | null>('morning');

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Time Analytics</h1>
        <p className="text-muted-foreground mt-1">Safety patterns across different times of day</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground">All Cape Town</span>
        <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary text-muted-foreground">Last 7 Days</span>
        <button onClick={() => onUpgrade('Extended date ranges with Elite')} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary text-muted-foreground">
          30 Days
        </button>
        <button onClick={() => onUpgrade('Year view with Elite')} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary text-muted-foreground flex items-center gap-1">
          Year 👑
        </button>
      </div>

      {/* Accordion sections */}
      <div className="space-y-3">
        {periods.map(period => {
          const isOpen = expanded === period.id;
          return (
            <div key={period.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : period.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="text-base font-semibold text-foreground">{period.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{period.incidents} incidents | Safety Score: {period.score}</div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-border pt-4 space-y-5 animate-fade-in">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">INCIDENT BREAKDOWN</h4>
                    <div className="space-y-2">
                      {period.breakdown.map(item => (
                        <div key={item.type} className="flex items-center gap-3">
                          <span className="text-sm text-foreground w-32 shrink-0">{item.type}</span>
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground w-14 text-right">{item.count} ({item.pct}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">HOTSPOT AREAS</h4>
                    <ol className="space-y-1.5">
                      {period.hotspots.map((h, i) => (
                        <li key={h.area} className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-5">{i + 1}.</span>
                          <span className="text-foreground">{h.area}</span>
                          <span className="text-muted-foreground ml-auto">{h.count} incidents</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">TREND: {period.trend}</span>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => onUpgrade('Charts with Elite')} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                      View Chart 👑 <ArrowRight className="w-3 h-3" />
                    </button>
                    <button onClick={() => onUpgrade('Export with Elite')} className="text-xs font-semibold text-muted-foreground hover:underline flex items-center gap-1">
                      Export 👑
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key Insights */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-3">Key Insights</h3>
        <ul className="space-y-2">
          {[
            'Night-time incidents are 3x higher than morning incidents',
            'Theft is the most common incident type across all periods',
            'City Centre consistently ranks as the top hotspot area',
            'Weekend evenings show 30% more incidents than weekdays',
            'Morning safety scores have improved 8% over the last month',
          ].map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary">•</span>
              {insight}
            </li>
          ))}
        </ul>
        <button onClick={() => onUpgrade('Predictive Analytics with Elite')} className="mt-4 text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          Upgrade for Predictive Analytics 👑 <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
});

TimeAnalyticsView.displayName = 'TimeAnalyticsView';
export default TimeAnalyticsView;
