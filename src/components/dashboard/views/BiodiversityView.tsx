import { memo, useMemo } from 'react';
import { Leaf, TreePine, Bird, Droplets, TrendingUp, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const greenCoverageData = [
  { year: '2020', coverage: 28.3 }, { year: '2021', coverage: 27.8 },
  { year: '2022', coverage: 28.1 }, { year: '2023', coverage: 29.2 },
  { year: '2024', coverage: 30.1 }, { year: '2025', coverage: 31.4 },
  { year: '2026', coverage: 32.0 },
];

const regreeningOpportunities = [
  { area: 'Mitchell\'s Plain', potential: 85, currentGreen: 12, type: 'Urban Forest', priority: 'high' },
  { area: 'Khayelitsha', potential: 92, currentGreen: 8, type: 'Community Garden', priority: 'high' },
  { area: 'Parow', potential: 65, currentGreen: 22, type: 'Street Trees', priority: 'medium' },
  { area: 'Bellville CBD', potential: 70, currentGreen: 15, type: 'Green Roof', priority: 'medium' },
  { area: 'Athlone', potential: 78, currentGreen: 18, type: 'Pocket Park', priority: 'high' },
  { area: 'Goodwood', potential: 55, currentGreen: 25, type: 'Verge Planting', priority: 'low' },
];

const speciesIndicators = [
  { name: 'Cape Sugarbird', status: 'stable', trend: '+2%', icon: Bird },
  { name: 'Fynbos Coverage', status: 'recovering', trend: '+5%', icon: Leaf },
  { name: 'Wetland Health', status: 'declining', trend: '-3%', icon: Droplets },
  { name: 'Urban Canopy', status: 'improving', trend: '+8%', icon: TreePine },
];

const BiodiversityView = memo(({ onUpgrade, onNavigate }: Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Biodiversity Monitor</h1>
        <p className="text-muted-foreground mt-1">Green coverage trends & re-greening opportunities</p>
      </div>

      {/* Species Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {speciesIndicators.map(s => (
          <div key={s.name} className="p-4 rounded-xl border border-border bg-card">
            <s.icon className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-sm font-bold text-foreground">{s.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                s.status === 'stable' ? 'bg-blue-500/15 text-blue-400' :
                s.status === 'recovering' || s.status === 'improving' ? 'bg-emerald-500/15 text-emerald-400' :
                'bg-red-500/15 text-red-400'
              )}>{s.status}</span>
              <span className={cn("text-xs font-bold", s.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400')}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Green Coverage Trend */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-1">
          <TreePine className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-foreground">Green Coverage Trend</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Percentage of metro area with vegetation cover</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={greenCoverageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[25, 35]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="coverage" stroke="#10b981" fill="#10b98130" name="Coverage %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Re-greening Opportunities */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-foreground">Re-greening Opportunities</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">AI-identified areas with highest greening potential</p>
        <div className="space-y-2">
          {regreeningOpportunities.map(o => (
            <div key={o.area} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-semibold text-foreground w-32 shrink-0">{o.area}</span>
              <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${o.potential}%` }} />
              </div>
              <span className="text-xs font-mono text-emerald-400 w-10 text-right">{o.potential}%</span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                o.priority === 'high' ? 'bg-red-500/15 text-red-400' : o.priority === 'medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
              )}>{o.priority}</span>
              <span className="text-[10px] text-muted-foreground w-24 text-right">{o.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

BiodiversityView.displayName = 'BiodiversityView';
export default BiodiversityView;
