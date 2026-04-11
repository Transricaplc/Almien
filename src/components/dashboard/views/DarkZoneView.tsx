import { memo, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Zap, MapPin, Navigation, ArrowUp, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const riskLevels = ['CRITICAL', 'HIGH', 'MODERATE'] as const;
const riskColors: Record<string, string> = { CRITICAL: 'text-accent-threat bg-accent-threat/15', HIGH: 'text-accent-warning bg-accent-warning/15', MODERATE: 'text-accent-safe bg-accent-safe/15' };

const activeZones = [
  { name: 'Sea Point — High Level Rd', ward: 54, stage: 4, time: '20:00–22:30', crimeInc: 18, lights: '34/120', risk: 'CRITICAL' as const },
  { name: 'Woodstock — Victoria Rd', ward: 57, stage: 2, time: '18:00–20:30', crimeInc: 12, lights: '22/80', risk: 'HIGH' as const },
  { name: 'Observatory — Station Rd', ward: 58, stage: 2, time: '20:00–22:30', crimeInc: 8, lights: '15/60', risk: 'MODERATE' as const },
];

const predictedZones = [
  { name: 'Green Point', ward: 54, stage: 4, time: '22:00–00:30', crimeInc: 14, lights: '28/95', risk: 'HIGH' as const },
  { name: 'Mowbray', ward: 59, stage: 2, time: '20:00–22:30', crimeInc: 6, lights: '10/45', risk: 'MODERATE' as const },
];

const historicalData = [
  { stage: '0', incidents: 12 }, { stage: '1', incidents: 15 }, { stage: '2', incidents: 22 },
  { stage: '3', incidents: 31 }, { stage: '4', incidents: 45 }, { stage: '5', incidents: 52 }, { stage: '6', incidents: 68 },
];

const [sortOptions] = [['By Risk', 'By Distance', 'By Duration'] as const];

const DarkZoneView = memo(({ onNavigate }: Props) => {
  const [sortBy, setSortBy] = useState(0);

  const renderZoneCard = (zone: typeof activeZones[0], predicted = false) => (
    <div key={zone.name} className={cn(
      "p-4 rounded-xl border",
      predicted ? "bg-card border-border-subtle opacity-70" : "bg-[hsl(var(--dark-zone-dim))] border-[hsl(var(--dark-zone)/0.3)]"
    )}>
      {predicted && <span className="text-[9px] font-neural font-bold text-accent-warning uppercase tracking-wider">FORECAST</span>}
      <div className="flex items-center justify-between mt-1">
        <h3 className="text-sm font-bold text-foreground">{zone.name}</h3>
        <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold", riskColors[zone.risk])}>{zone.risk}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">Ward {zone.ward}</p>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="text-xs"><span className="text-accent-warning font-bold">Stage {zone.stage}</span> · {zone.time}</div>
        <div className="text-xs text-accent-threat flex items-center gap-1"><ArrowUp className="w-3 h-3" />↑{zone.crimeInc}% crime risk</div>
        <div className="text-xs font-neural text-accent-warning">{zone.lights} lights out</div>
        <div className="text-xs text-muted-foreground">Restore ETA: {zone.time.split('–')[1]}</div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => onNavigate('map-full')} className="px-3 py-1.5 rounded-lg border border-border-subtle text-[11px] font-semibold text-foreground hover:bg-secondary transition-colors">View on Map</button>
        <button onClick={() => onNavigate('safe-route')} className="px-3 py-1.5 rounded-lg border border-accent-safe/30 text-[11px] font-semibold text-accent-safe hover:bg-accent-safe/10 transition-colors">Safe Route Around</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent-warning" />
          DARK ZONE INTELLIGENCE
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Areas where load-shedding and crime converge</p>
      </div>

      {/* Sort toggle */}
      <div className="flex gap-1">
        {['By Risk', 'By Distance', 'By Duration'].map((s, i) => (
          <button key={s} onClick={() => setSortBy(i)} className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-semibold transition-colors",
            sortBy === i ? "bg-accent-warning/15 text-accent-warning" : "text-muted-foreground hover:text-foreground"
          )}>{s}</button>
        ))}
      </div>

      {/* Active zones */}
      <div>
        <p className="text-[10px] font-neural font-bold text-accent-warning uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-warning animate-pulse" /> ACTIVE DARK ZONES
        </p>
        <div className="space-y-3">
          {activeZones.map(z => renderZoneCard(z))}
        </div>
      </div>

      {/* Predicted zones */}
      <div>
        <p className="text-[10px] font-neural font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          ⚡ PREDICTED FOR TONIGHT
        </p>
        <div className="space-y-3">
          {predictedZones.map(z => renderZoneCard(z, true))}
        </div>
      </div>

      {/* Historical chart */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <p className="text-[10px] font-neural font-bold text-muted-foreground uppercase tracking-wider mb-3">Crime Rate by Load-Shedding Stage</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="stage" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} label={{ value: 'Stage', position: 'bottom', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="incidents" fill="hsl(27, 96%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[9px] text-muted-foreground mt-2">Source: Almien Guardian Engine × SAPS data analysis</p>
      </div>
    </div>
  );
});

DarkZoneView.displayName = 'DarkZoneView';
export default DarkZoneView;
