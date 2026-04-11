import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Thermometer, Bus, Trash2, TrendingUp, Calendar, AlertTriangle, Brain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const generateHeatIslandData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(d => ({
    day: d,
    urban: +(28 + Math.random() * 8).toFixed(1),
    suburban: +(24 + Math.random() * 6).toFixed(1),
    rural: +(20 + Math.random() * 5).toFixed(1),
  }));
};

const generateMobilityData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  return hours.map(h => {
    const hr = parseInt(h);
    const peak = (hr >= 7 && hr <= 9) || (hr >= 16 && hr <= 18);
    return {
      hour: h,
      bus: Math.round((peak ? 800 : 200) + Math.random() * 300),
      taxi: Math.round((peak ? 1200 : 400) + Math.random() * 400),
      bike: Math.round((peak ? 300 : 50) + Math.random() * 150),
    };
  });
};

const generateWasteData = () => {
  const zones = ['CBD', 'Atlantic', 'Southern', 'Northern', 'Helderberg', 'Tygerberg', 'Blaauwberg', 'Mitchells Plain'];
  return zones.map(z => ({
    zone: z,
    fillLevel: Math.round(30 + Math.random() * 65),
    nextCollection: Math.round(1 + Math.random() * 3),
    optimizedSaving: Math.round(10 + Math.random() * 25),
  }));
};

const PredictiveAnalyticsView = memo(({ onUpgrade, onNavigate }: Props) => {
  const heatData = useMemo(generateHeatIslandData, []);
  const mobilityData = useMemo(generateMobilityData, []);
  const wasteData = useMemo(generateWasteData, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Guardian Status Bar */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-neural text-[10px] font-bold text-accent-safe uppercase tracking-wider">GUARDIAN ENGINE</p>
            <p className="text-xs text-muted-foreground mt-0.5">ACTIVE — 60s cycle · Calculated 00:23 ago</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-safe animate-pulse" />
            <span className="text-[10px] font-bold text-accent-safe">LIVE</span>
          </div>
        </div>
      </div>

      {/* Risk Equation */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <p className="font-neural text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Risk Equation</p>
        <div className="text-xs font-neural text-foreground leading-relaxed">
          <span className="text-accent-safe">RISK SCORE</span> = (<span className="px-1 py-0.5 rounded bg-accent-threat/15 text-accent-threat">Incident Freq</span>) ÷ (<span className="px-1 py-0.5 rounded bg-accent-safe/15 text-accent-safe">Police + Fire + CCTV</span>) × [<span className="px-1 py-0.5 rounded bg-accent-warning/15 text-accent-warning">ESP Stage</span>] × [<span className="px-1 py-0.5 rounded bg-accent-info/15 text-accent-info">i-TRAFFIC</span>] × [<span className="px-1 py-0.5 rounded bg-accent-gbv/15 text-accent-gbv">Night ×</span>]
        </div>
      </div>

      {/* Chain of Awareness */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-visible">
        {[
          { step: 1, label: 'Signal Acquisition', status: 'active' },
          { step: 2, label: 'Infrastructure Correlation', status: 'active' },
          { step: 3, label: 'Spatial Logic', status: 'active' },
          { step: 4, label: 'Proactive Orchestration', status: 'pending' },
        ].map(s => (
          <div key={s.step} className="shrink-0 w-[140px] p-3 rounded-xl bg-card border border-border-subtle text-center">
            <span className="text-[9px] font-neural text-muted-foreground">STEP {s.step}</span>
            <p className="text-xs font-semibold text-foreground mt-1">{s.label}</p>
            <span className={cn("inline-block mt-2 w-2 h-2 rounded-full", s.status === 'active' ? "bg-accent-safe" : "bg-muted-foreground/30")} />
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-headline text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-accent-safe" />
          🧠 GUARDIAN INTELLIGENCE
        </h1>
        <p className="text-muted-foreground mt-1 text-xs">ML-powered forecasts for urban planning decisions</p>
      </div>

      {/* Heat Island Forecast */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-1">
          <Thermometer className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-bold text-foreground">Urban Heat Island — 7-Day Forecast</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Temperature differential across urban zones (°C)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={heatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="urban" stroke="#ef4444" fill="#ef444420" name="Urban Core" animationDuration={1000} animationBegin={0} animationEasing="ease-out" />
              <Area type="monotone" dataKey="suburban" stroke="#f59e0b" fill="#f59e0b20" name="Suburban" animationDuration={1000} animationBegin={200} animationEasing="ease-out" />
              <Area type="monotone" dataKey="rural" stroke="#10b981" fill="#10b98120" name="Rural" animationDuration={1000} animationBegin={400} animationEasing="ease-out" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Urban Core</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Suburban</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Rural</span>
        </div>
      </div>

      {/* Mobility Demand */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-1">
          <Bus className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-foreground">Mobility Demand Predictor</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Predicted passenger demand by mode (today)</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mobilityData.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="bus" fill="#3b82f6" name="Bus/MyCiti" radius={[2, 2, 0, 0]} animationDuration={1200} animationBegin={0} animationEasing="ease-out" />
              <Bar dataKey="taxi" fill="#f59e0b" name="Minibus Taxi" radius={[2, 2, 0, 0]} animationDuration={1200} animationBegin={200} animationEasing="ease-out" />
              <Bar dataKey="bike" fill="#10b981" name="Cycling" radius={[2, 2, 0, 0]} animationDuration={1200} animationBegin={400} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Peak AM', time: '07:00–09:00', load: '92%', color: 'text-red-400' },
            { label: 'Off-Peak', time: '10:00–15:00', load: '45%', color: 'text-emerald-400' },
            { label: 'Peak PM', time: '16:00–18:00', load: '88%', color: 'text-orange-400' },
          ].map(p => (
            <div key={p.label} className="p-3 rounded-lg bg-secondary/50 text-center">
              <p className="text-xs font-semibold text-muted-foreground">{p.label}</p>
              <p className={cn("text-lg font-black", p.color)}>{p.load}</p>
              <p className="text-[10px] text-muted-foreground">{p.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Waste Optimization */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-1">
          <Trash2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-foreground">Waste Collection Optimizer</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">AI-optimized routes save fuel and reduce emissions</p>
        <div className="space-y-2">
          {wasteData.map(w => (
            <div key={w.zone} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <span className="text-sm font-semibold text-foreground w-28 shrink-0">{w.zone}</span>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", w.fillLevel > 80 ? 'bg-red-500' : w.fillLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500')}
                  style={{ width: `${w.fillLevel}%` }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-10 text-right">{w.fillLevel}%</span>
              <span className="text-[10px] text-muted-foreground w-16 text-right">{w.nextCollection}d left</span>
              <span className="text-[10px] font-bold text-emerald-400 w-14 text-right">-{w.optimizedSaving}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs font-semibold text-emerald-400">
            💡 AI Recommendation: Deferring Blaauwberg & Atlantic collections by 1 day saves 18% fuel costs with no overflow risk.
          </p>
        </div>
      </div>
    </div>
  );
});

PredictiveAnalyticsView.displayName = 'PredictiveAnalyticsView';
export default PredictiveAnalyticsView;
