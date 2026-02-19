import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, MapPin, Bookmark, ArrowLeft, Clock, Target, Shield, ArrowRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SafetyScoreBadge from '../SafetyScoreBadge';
import { capeTownAreas, searchAreas, type AreaSafetyData } from '@/data/capeTownSafetyData';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const safetyFilters = ['all', 'green', 'yellow', 'orange', 'red'] as const;
const filterLabels = { all: 'All', green: '🟢 Green', yellow: '🟡 Yellow', orange: '🟠 Orange', red: '🔴 Red' };

const AreasView = memo(({ onUpgrade, onNavigate }: Props) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<typeof safetyFilters[number]>('all');
  const [selectedArea, setSelectedArea] = useState<AreaSafetyData | null>(null);

  const filtered = (query ? searchAreas(query) : capeTownAreas)
    .filter(a => filter === 'all' || a.safetyLevel === filter)
    .sort((a, b) => b.safetyScore - a.safetyScore);

  if (selectedArea) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedArea(null)} className="flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Areas
        </button>

        <div className="flex items-center gap-4">
          <SafetyScoreBadge score={selectedArea.safetyScore} size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{selectedArea.name}</h1>
            <p className="text-muted-foreground capitalize">{selectedArea.safetyLevel} Risk Zone</p>
          </div>
        </div>

        {/* Time-based safety */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Time-Based Safety</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['morning', 'day', 'evening', 'night'] as const).map(t => {
              const data = selectedArea.timeBasedSafety[t];
              const labels = { morning: '🌅 Morning', day: '☀️ Day', evening: '🌆 Evening', night: '🌙 Night' };
              return (
                <div key={t} className="p-4 rounded-xl border border-border bg-card text-center">
                  <div className="text-sm text-muted-foreground mb-1">{labels[t]}</div>
                  <SafetyScoreBadge score={data.score} size="sm" className="mx-auto" />
                  <div className="text-xs text-muted-foreground mt-1 capitalize">{data.color}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incidents */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">Incident Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div><div className="text-2xl font-bold text-foreground">{selectedArea.incidentCount.last7Days}</div><div className="text-xs text-muted-foreground">Last 7 Days</div></div>
            <div><div className="text-2xl font-bold text-foreground">{selectedArea.incidentCount.last30Days}</div><div className="text-xs text-muted-foreground">Last 30 Days</div></div>
            <div><div className="text-2xl font-bold text-foreground">{selectedArea.incidentCount.last12Months}</div><div className="text-xs text-muted-foreground">Last 12 Months</div></div>
          </div>
        </div>

        {/* Activities */}
        {selectedArea.recommendedActivities.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Recommended Activities</h2>
            <div className="space-y-2">
              {selectedArea.recommendedActivities.map(act => (
                <div key={act.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <div>
                    <div className="text-sm font-medium text-foreground">{act.name}</div>
                    <div className="text-xs text-muted-foreground">Best: {act.bestTime} · {act.category}</div>
                  </div>
                  <SafetyScoreBadge score={act.safetyScore} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Nearby Facilities</h2>
          <div className="space-y-2">
            {selectedArea.nearbyFacilities.map(f => (
              <div key={f.name} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{f.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{f.type.replace('_', ' ')} · {f.distance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Safety Tips</h2>
          <ul className="space-y-2">
            {selectedArea.safetyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-secondary/50">
                <span className="text-primary mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => onUpgrade('Historical Trends with Elite')} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
          View Historical Trends 👑 <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Areas & Zones</h1>
        <p className="text-muted-foreground mt-1">{capeTownAreas.length} monitored areas in Cape Town</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search areas, addresses, landmarks..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-10"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {safetyFilters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Area cards */}
      <div className="space-y-3">
        {filtered.map(area => (
          <div
            key={area.id}
            className="p-5 rounded-xl border border-border bg-card card-hover cursor-pointer"
            onClick={() => setSelectedArea(area)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-foreground">{area.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{area.safetyLevel} risk zone</p>
              </div>
              <SafetyScoreBadge score={area.safetyScore} size="sm" />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {area.incidentCount.last7Days} incidents / 7d</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Safest: Morning & Day</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {area.recommendedActivities.length} activities</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="text-xs font-semibold text-primary hover:underline">View Details</button>
              <button className="text-xs text-muted-foreground hover:text-foreground">Save</button>
              <button className="text-xs text-muted-foreground hover:text-foreground">Directions</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

AreasView.displayName = 'AreasView';
export default AreasView;
