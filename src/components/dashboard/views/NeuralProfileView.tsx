import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Brain, TrendingUp, TrendingDown, Shield, Heart, Phone, MapPin, Star, CheckCircle, Circle } from 'lucide-react';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const riskDNA = [
  { label: 'Evening Commuter', color: 'bg-accent-warning/15 text-accent-warning' },
  { label: 'High-exposure Area', color: 'bg-accent-threat/15 text-accent-threat' },
  { label: 'GBV-aware', color: 'bg-accent-gbv/15 text-accent-gbv' },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayRisks = ['low', 'elevated', 'low', 'high', 'elevated', 'low', 'low'];
const dayIncidents = [
  'No major incidents',
  '2 thefts on Beach Road',
  'Quiet day',
  '4 vehicle break-ins overnight',
  'Suspicious activity × 2',
  'Community patrol active',
  'No incidents reported',
];

const riskColorMap: Record<string, string> = {
  low: 'bg-accent-safe',
  elevated: 'bg-accent-warning',
  high: 'bg-accent-threat',
  critical: 'bg-accent-threat',
};

const NeuralProfileView = memo(({ onNavigate }: Props) => {
  const [selectedDay, setSelectedDay] = useState(3); // Thursday
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          YOUR SAFETY NEURAL PROFILE
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Personalised AI-driven safety analysis</p>
      </div>

      {/* Safety DNA Card */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <p className="text-[10px] font-neural font-bold text-muted-foreground uppercase tracking-wider mb-3">Safety DNA</p>
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {riskDNA.map(d => (
              <span key={d.label} className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold", d.color)}>{d.label}</span>
            ))}
          </div>
          <div className="text-center shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-accent-safe flex items-center justify-center">
              <span className="text-xl font-neural font-bold text-accent-safe">7.8</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <TrendingUp className="w-4 h-4 text-accent-safe" />
            <span className="text-xs text-accent-safe font-semibold">+0.3</span>
            <span className="text-[10px] text-muted-foreground">vs 7d</span>
          </div>
        </div>
      </div>

      {/* Risk Timeline */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <p className="text-[10px] font-neural font-bold text-muted-foreground uppercase tracking-wider mb-3">7-Day Risk Calendar</p>
        <div className="flex gap-1">
          {weekDays.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors",
                selectedDay === i && "ring-1 ring-accent-safe"
              )}
            >
              <span className="text-[10px] text-muted-foreground">{day}</span>
              <div className={cn("w-full h-8 rounded", riskColorMap[dayRisks[i]])} />
              {i === todayIdx && <span className="w-1 h-1 rounded-full bg-foreground" />}
            </button>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-lg bg-secondary/50 text-xs text-foreground">
          <span className="font-bold">{weekDays[selectedDay]}:</span> {dayIncidents[selectedDay]}
        </div>
      </div>

      {/* Commute Analysis */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <p className="text-[10px] font-neural font-bold text-muted-foreground uppercase tracking-wider mb-3">My Commute Analysis</p>
        {[
          { label: 'Morning — Sea Point → CBD', score: 7.8, time: '07:15', risk: 'Theft peaks 08:00' },
          { label: 'Evening — CBD → Sea Point', score: 6.2, time: '17:30', risk: 'Load-shedding 18:00' },
        ].map(r => (
          <div key={r.label} className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
            <div>
              <p className="text-sm font-semibold text-foreground">{r.label}</p>
              <p className="text-[10px] text-muted-foreground">Safest departure: {r.time} • {r.risk}</p>
            </div>
            <span className="font-neural text-sm font-bold text-accent-safe">{r.score}</span>
          </div>
        ))}
        <button onClick={() => onNavigate('safe-route')} className="text-xs text-primary font-semibold mt-2 hover:underline">Update Commute →</button>
      </div>

      {/* GBV Readiness */}
      <div className="p-4 rounded-xl border border-accent-gbv/30 bg-accent-gbv/5">
        <p className="text-[10px] font-neural font-bold text-accent-gbv uppercase tracking-wider mb-3">GBV Readiness Score</p>
        <div className="space-y-2 text-sm text-foreground">
          <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent-safe" /> Emergency contacts: 2 set up</p>
          <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent-gbv" /> Nearest shelter: Saartjie Baartman Centre — 8.1km</p>
          <div className="flex gap-2 mt-3">
            {[
              { label: 'SOS Configured', done: true },
              { label: 'Contacts Set', done: true },
              { label: 'Safe Route Saved', done: false },
            ].map(s => (
              <div key={s.label} className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold", s.done ? "bg-accent-safe/15 text-accent-safe" : "bg-secondary text-muted-foreground")}>
                {s.done ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />} {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Standing */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <p className="text-[10px] font-neural font-bold text-muted-foreground uppercase tracking-wider mb-3">Community Standing</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-xl">👤</div>
          <div>
            <p className="text-sm font-bold text-foreground">Member</p>
            <p className="text-xs text-muted-foreground">3 reports this month • Trust: 65/100</p>
          </div>
        </div>
        <button className="text-xs text-primary font-semibold mt-3 hover:underline">Verify my identity →</button>
      </div>
    </div>
  );
});

NeuralProfileView.displayName = 'NeuralProfileView';
export default NeuralProfileView;
