import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Search, ArrowRight, Crown, Lock, Camera, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SafetyScoreBadge from '../SafetyScoreBadge';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const zones = [
  {
    name: 'V&A Waterfront Entrance', score: 9.5, level: 'green' as const, status: 'SAFE',
    features: ['High foot traffic', 'CCTV coverage', 'Security presence'],
    times: { morning: 9.5, day: 9.2, evening: 8.8, night: 8.5 },
    incidents: 0,
    tips: ['Well-lit with security presence', 'Multiple ride options available', 'Safe waiting area with seating'],
  },
  {
    name: 'Camps Bay Main Road', score: 8.8, level: 'green' as const, status: 'SAFE',
    features: ['Well-lit', 'Restaurant strip', 'High visibility'],
    times: { morning: 9.0, day: 8.8, evening: 8.5, night: 7.5 },
    incidents: 0,
    tips: ['Popular dining strip with good visibility', 'Use designated pickup points'],
  },
  {
    name: 'Sea Point Promenade', score: 8.5, level: 'green' as const, status: 'SAFE',
    features: ['Well-patrolled', 'Lit pathway', 'Busy area'],
    times: { morning: 9.0, day: 8.8, evening: 7.5, night: 6.5 },
    incidents: 1,
    tips: ['Promenade area is well-patrolled', 'Avoid quieter side streets at night'],
  },
  {
    name: 'Long Street (Upper)', score: 6.2, level: 'orange' as const, status: 'CAUTION',
    features: ['Moderate traffic', 'Nightlife area'],
    times: { morning: 7.5, day: 7.0, evening: 5.5, night: 4.0 },
    incidents: 4,
    alternatives: [
      { name: "Company's Garden", distance: '700m', score: 8.5 },
      { name: 'City Station', distance: '500m', score: 8.8 },
    ],
    tips: ['Exercise caution especially after dark', 'Use well-known pickup spots'],
  },
  {
    name: 'Observatory Lower Main', score: 5.8, level: 'yellow' as const, status: 'CAUTION',
    features: ['Student area', 'Mixed traffic'],
    times: { morning: 7.0, day: 6.5, evening: 5.0, night: 3.5 },
    incidents: 3,
    alternatives: [
      { name: 'Groote Schuur Hospital', distance: '1.2km', score: 8.0 },
    ],
    tips: ['Stay near main road', 'Avoid side streets at night'],
  },
];

const RideShareView = memo(({ onUpgrade }: Props) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ride Share Zones</h1>
        <p className="text-muted-foreground mt-1">Current Time: {timeStr} {dayStr}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search pickup location..." className="pl-10" />
      </div>

      <div className="space-y-4">
        {zones.map(zone => (
          <div key={zone.name} className="p-5 rounded-xl border border-border bg-card card-hover">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">{zone.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{zone.status === 'SAFE' ? 'Safe pickup zone' : '⚠️ Exercise caution'}</p>
              </div>
              <SafetyScoreBadge score={zone.score} size="sm" />
            </div>

            <div className={cn(
              "text-sm font-medium mb-3",
              zone.status === 'SAFE' ? "text-safety-green" : "text-safety-orange"
            )}>
              {zone.status === 'SAFE' ? '✓ Currently SAFE for pickups' : '⚠️ CAUTION recommended'}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              {zone.features.map(f => (
                <span key={f} className="flex items-center gap-1">
                  {f.includes('CCTV') ? <Camera className="w-3 h-3" /> : f.includes('traffic') ? <Users className="w-3 h-3" /> : null}
                  {f}
                </span>
              ))}
              <span>📊 {zone.incidents} incidents this week</span>
            </div>

            {/* Time safety */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {Object.entries(zone.times).map(([t, score]) => (
                <div key={t} className="text-center p-2 rounded-lg bg-secondary/50">
                  <div className="text-[10px] text-muted-foreground capitalize">{t}</div>
                  <div className="text-sm font-bold text-foreground">{score}</div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="space-y-1 mb-3">
              {zone.tips.map((tip, i) => (
                <div key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="text-safety-green">✓</span> {tip}
                </div>
              ))}
            </div>

            {/* Alternatives */}
            {zone.alternatives && (
              <div className="p-3 rounded-lg bg-secondary/50 mt-3">
                <div className="text-xs font-semibold text-foreground mb-2">SAFER ALTERNATIVES NEARBY:</div>
                {zone.alternatives.map(alt => (
                  <div key={alt.name} className="flex items-center justify-between text-xs text-muted-foreground py-1">
                    <span>→ {alt.name} ({alt.distance})</span>
                    <span className="text-safety-green font-medium">{alt.score} 🟢</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Elite */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-elite-from" />
          <h3 className="font-bold text-foreground">Elite Ride Share Features</h3>
        </div>
        <ul className="space-y-1.5 mb-4">
          {['Real-time zone alerts', 'Route safety analysis', 'Auto-find safer alternatives', 'App integration support'].map(f => (
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

RideShareView.displayName = 'RideShareView';
export default RideShareView;
