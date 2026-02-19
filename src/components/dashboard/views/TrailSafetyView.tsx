import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Mountain, Clock, AlertTriangle, Crown, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import SafetyScoreBadge from '../SafetyScoreBadge';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const trails = [
  {
    name: 'Table Mountain Platteklip', score: 8.8, difficulty: 'Moderate', duration: '2.5 hrs',
    elevation: '600m', status: 'Open', updated: '1 hour ago',
    traffic: 'High', rescue: 'Available', incidents: 1,
    conditions: { weather: 'Clear, ideal ✓', trail: 'Good condition ✓', crowd: 'Moderate' },
    safety: ['Well-marked trail', 'Regular patrols', 'Emergency points marked'],
  },
  {
    name: "Lion's Head Sunrise", score: 8.5, difficulty: 'Moderate', duration: '2 hrs',
    elevation: '400m', status: 'Open', updated: '2 hours ago',
    traffic: 'High', rescue: 'Available', incidents: 0,
    conditions: { weather: 'Clear ✓', trail: 'Good ✓', crowd: 'High (sunrise popular)' },
    safety: ['Popular sunrise hike', 'Chain section requires care', 'Start early for best experience'],
  },
  {
    name: 'Kirstenbosch Skeleton Gorge', score: 7.5, difficulty: 'Hard', duration: '4 hrs',
    elevation: '800m', status: 'Open', updated: '3 hours ago',
    traffic: 'Low', rescue: 'Limited', incidents: 2,
    conditions: { weather: 'Clear ✓', trail: 'Wet in sections ⚠️', crowd: 'Low' },
    safety: ['Rocky terrain — proper shoes required', 'Low traffic — hike with partner', 'Carry extra water'],
  },
  {
    name: 'Pipe Track', score: 9.0, difficulty: 'Easy', duration: '1.5 hrs',
    elevation: '150m', status: 'Open', updated: '1 hour ago',
    traffic: 'High', rescue: 'Available', incidents: 0,
    conditions: { weather: 'Clear ✓', trail: 'Excellent ✓', crowd: 'Moderate' },
    safety: ['Family-friendly', 'Flat and well-maintained', 'Beautiful views of Camps Bay'],
  },
  {
    name: "Chapman's Peak Trail", score: 7.2, difficulty: 'Hard', duration: '5 hrs',
    elevation: '600m', status: 'Open', updated: '4 hours ago',
    traffic: 'Low', rescue: 'Limited', incidents: 3,
    conditions: { weather: 'Windy ⚠️', trail: 'Good ✓', crowd: 'Very Low' },
    safety: ['Exposed sections — be aware of wind', 'Remote — inform someone of your route', 'Carry first aid kit'],
  },
];

const TrailSafetyView = memo(({ onUpgrade }: Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trail Safety</h1>
        <p className="text-muted-foreground mt-1">🌤️ Weather: 24°C Clear | Wind: 15 km/h | ⛰️ {trails.length} Trails Available</p>
      </div>

      <div className="space-y-4">
        {trails.map(trail => (
          <div key={trail.name} className="p-5 rounded-xl border border-border bg-card card-hover">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-primary" />
                  {trail.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {trail.difficulty} · {trail.duration} · {trail.elevation} elevation
                </p>
              </div>
              <SafetyScoreBadge score={trail.score} size="sm" />
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1 text-safety-green">
                <CheckCircle className="w-3 h-3" /> Trail {trail.status}
              </span>
              <span>Updated: {trail.updated}</span>
              <span>👥 {trail.traffic} traffic</span>
              <span>🚁 Rescue {trail.rescue}</span>
              <span>📊 {trail.incidents} incident{trail.incidents !== 1 ? 's' : ''} this month</span>
            </div>

            {/* Conditions */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {Object.entries(trail.conditions).map(([key, val]) => (
                <div key={key} className="p-2 rounded-lg bg-secondary/50 text-center">
                  <div className="text-[10px] text-muted-foreground capitalize">{key}</div>
                  <div className="text-xs font-medium text-foreground">{val}</div>
                </div>
              ))}
            </div>

            {/* Safety bullets */}
            <div className="space-y-1">
              {trail.safety.map((s, i) => (
                <div key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="text-primary">•</span> {s}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-3">
              <button className="text-xs font-semibold text-primary hover:underline">View Details</button>
              <button className="text-xs text-muted-foreground hover:underline">Directions</button>
              <button className="text-xs text-muted-foreground hover:underline">Save</button>
            </div>
          </div>
        ))}
      </div>

      {/* Elite */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-elite-from" />
          <h3 className="font-bold text-foreground">Elite Trail Features</h3>
        </div>
        <ul className="space-y-1.5 mb-4">
          {['Real-time trail alerts', 'Weather warnings', 'Offline maps', 'GPS tracking'].map(f => (
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

TrailSafetyView.displayName = 'TrailSafetyView';
export default TrailSafetyView;
