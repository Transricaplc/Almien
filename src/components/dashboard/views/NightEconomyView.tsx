import { memo, useMemo } from 'react';
import { Moon, Shield, Lightbulb, Users, MapPin, Clock, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const nightDistricts = [
  { name: 'Long Street', safetyScore: 62, footTraffic: 'high', lightingGrade: 'B', incidents24h: 5, peakHour: '23:00', venues: 34 },
  { name: 'Bree Street', safetyScore: 78, footTraffic: 'moderate', lightingGrade: 'A', incidents24h: 1, peakHour: '20:00', venues: 22 },
  { name: 'Kloof Street', safetyScore: 72, footTraffic: 'moderate', lightingGrade: 'B+', incidents24h: 2, peakHour: '21:00', venues: 18 },
  { name: 'V&A Waterfront', safetyScore: 91, footTraffic: 'high', lightingGrade: 'A+', incidents24h: 0, peakHour: '19:00', venues: 45 },
  { name: 'Sea Point', safetyScore: 74, footTraffic: 'moderate', lightingGrade: 'B', incidents24h: 3, peakHour: '22:00', venues: 15 },
  { name: 'Observatory', safetyScore: 58, footTraffic: 'high', lightingGrade: 'C', incidents24h: 4, peakHour: '00:00', venues: 12 },
  { name: 'Woodstock', safetyScore: 55, footTraffic: 'low', lightingGrade: 'C-', incidents24h: 6, peakHour: '22:00', venues: 8 },
];

const activityByHour = Array.from({ length: 12 }, (_, i) => {
  const h = 18 + i;
  const hour = h >= 24 ? h - 24 : h;
  const peak = h >= 20 && h <= 24;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    pedestrians: Math.round((peak ? 800 : 200) + Math.random() * 400),
    incidents: Math.round((peak ? 4 : 1) + Math.random() * 3),
  };
});

const lightingRecommendations = [
  { location: 'Loop Street (Wale–Long)', issue: '3 non-functional poles', impact: 'High-risk dark corridor', priority: 'critical' },
  { location: 'Observatory Main Road', issue: 'Under-lit pedestrian zone', impact: '40% below standard', priority: 'high' },
  { location: 'Woodstock Albert Road', issue: 'Outdated sodium lamps', impact: 'Poor visibility spectrum', priority: 'medium' },
  { location: 'Green Point Park perimeter', issue: 'No pathway lighting after 22:00', impact: 'Unsafe jogging route', priority: 'high' },
];

const NightEconomyView = memo(({ onUpgrade, onNavigate }: Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Night-time Economy</h1>
        <p className="text-muted-foreground mt-1">Activity patterns, safety scoring & lighting recommendations</p>
      </div>

      {/* District Safety Grid */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Entertainment District Safety</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nightDistricts.map(d => (
            <div key={d.name} className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-foreground">{d.name}</h4>
                <span className={cn(
                  "text-xs font-black px-2 py-0.5 rounded-full",
                  d.safetyScore >= 80 ? 'bg-emerald-500/15 text-emerald-400' :
                  d.safetyScore >= 65 ? 'bg-amber-500/15 text-amber-400' :
                  'bg-red-500/15 text-red-400'
                )}>{d.safetyScore}/100</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center">
                  <Lightbulb className="w-3.5 h-3.5 mx-auto text-amber-400 mb-1" />
                  <p className="text-xs font-bold text-foreground">{d.lightingGrade}</p>
                  <p className="text-[9px] text-muted-foreground">Lighting</p>
                </div>
                <div className="text-center">
                  <Shield className="w-3.5 h-3.5 mx-auto text-blue-400 mb-1" />
                  <p className="text-xs font-bold text-foreground">{d.incidents24h}</p>
                  <p className="text-[9px] text-muted-foreground">Incidents</p>
                </div>
                <div className="text-center">
                  <Clock className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs font-bold text-foreground">{d.peakHour}</p>
                  <p className="text-[9px] text-muted-foreground">Peak</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-1">
          <Moon className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-foreground">Night Activity vs Incidents</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">18:00 – 06:00 pedestrian flow and incident correlation</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="pedestrians" fill="#6366f1" name="Pedestrians" radius={[2, 2, 0, 0]} />
              <Bar dataKey="incidents" fill="#ef4444" name="Incidents" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lighting Recommendations */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-foreground">Lighting Recommendations</h3>
        </div>
        <div className="space-y-2">
          {lightingRecommendations.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{r.location}</p>
                <p className="text-[10px] text-muted-foreground">{r.issue} · {r.impact}</p>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                r.priority === 'critical' ? 'bg-red-500/15 text-red-400' :
                r.priority === 'high' ? 'bg-orange-500/15 text-orange-400' :
                'bg-amber-500/15 text-amber-400'
              )}>{r.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

NightEconomyView.displayName = 'NightEconomyView';
export default NightEconomyView;
