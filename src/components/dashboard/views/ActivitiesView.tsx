import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, MapPin, Clock, Star, Crown, Lock } from 'lucide-react';
import SafetyScoreBadge from '../SafetyScoreBadge';
import { capeTownAreas, type ActivityCategory } from '@/data/capeTownSafetyData';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const categories: { id: ActivityCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '' },
  { id: 'dining', label: 'Dining', emoji: '🍽️' },
  { id: 'hiking', label: 'Outdoor', emoji: '🌄' },
  { id: 'beaches', label: 'Beaches', emoji: '🏖️' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
];

const allActivities = capeTownAreas.flatMap(area =>
  area.recommendedActivities.map(act => ({
    ...act,
    areaName: area.name,
    areaSafetyLevel: area.safetyLevel,
  }))
).sort((a, b) => b.safetyScore - a.safetyScore);

const ActivitiesView = memo(({ onUpgrade }: Props) => {
  const [category, setCategory] = useState<ActivityCategory | 'all'>('all');
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'green' | 'green-yellow'>('all');

  const filtered = allActivities
    .filter(a => category === 'all' || a.category === category)
    .filter(a => {
      if (safetyFilter === 'green') return a.safetyScore >= 7.5;
      if (safetyFilter === 'green-yellow') return a.safetyScore >= 5.5;
      return true;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Safe Activities</h1>
        <p className="text-muted-foreground mt-1">Discover safe things to do in Cape Town</p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              category === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Safety filter */}
      <div className="flex gap-2">
        {[
          { id: 'all' as const, label: 'All' },
          { id: 'green' as const, label: '🟢 Green Only' },
          { id: 'green-yellow' as const, label: '🟢🟡 Green+Yellow' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setSafetyFilter(f.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              safetyFilter === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity cards */}
      <div className="space-y-3">
        {filtered.map((act, i) => (
          <div key={`${act.name}-${i}`} className="p-5 rounded-xl border border-border bg-card card-hover">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-foreground">{act.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{act.category} · {act.areaName}</p>
              </div>
              <SafetyScoreBadge score={act.safetyScore} size="sm" />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-safety-green mb-2">
              <span>✓ Safe right now</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Best: {act.bestTime}</span>
            </div>
            <div className="flex gap-3 mt-3">
              <button className="text-xs font-semibold text-primary hover:underline">View Details</button>
              <button onClick={() => onUpgrade('Itinerary Builder with Elite')} className="text-xs font-semibold text-muted-foreground hover:underline flex items-center gap-1">
                Add to Itinerary 👑
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No activities match your filters</div>
        )}
      </div>

      {/* Elite card */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-elite-from" />
          <h3 className="font-bold text-foreground">Elite Activity Features</h3>
        </div>
        <ul className="space-y-1.5 mb-4">
          {['AI recommendations based on your profile', 'Multi-day itinerary planner', 'Real-time safety updates', 'Alternative suggestions when high-risk'].map(f => (
            <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
              <Crown className="w-3 h-3 text-elite-from shrink-0" /> {f}
            </li>
          ))}
        </ul>
        <button onClick={() => onUpgrade()} className="text-sm font-semibold text-primary hover:underline">Upgrade to Elite →</button>
      </div>
    </div>
  );
});

ActivitiesView.displayName = 'ActivitiesView';
export default ActivitiesView;
