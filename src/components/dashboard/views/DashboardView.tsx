import { memo, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Shield, AlertTriangle, Bookmark, TrendingDown, Crown,
  ArrowRight, Clock, MapPin, Lock, Zap, Car, Wind, Volume2,
  Users, Thermometer, Flame, ChevronRight, Bell, Compass,
  Ambulance, Map, BarChart3, Waves, Recycle, Accessibility,
  TrendingUp, ExternalLink, Sparkles, Eye
} from 'lucide-react';
import MunicipalPerformance from '../MunicipalPerformance';
import InteractiveMap from '../InteractiveMap';
import type { ViewId } from '../GridifyDashboard';

interface DashboardViewProps {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

/* ── Animated Counter ── */
const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const duration = 1200;
    const start = ref.current;
    const diff = value - start;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setDisplay(Number(current.toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
      else ref.current = value;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display}{suffix}</>;
};

/* ── KPI Data ── */
const useKPIData = () => {
  const [data, setData] = useState(() => generateKPIs());

  useEffect(() => {
    const interval = setInterval(() => setData(generateKPIs()), 25000);
    return () => clearInterval(interval);
  }, []);

  return data;
};

function generateKPIs() {
  return [
    {
      id: 'traffic', label: 'Traffic Congestion', value: +(15 + Math.random() * 40).toFixed(1), unit: '%',
      icon: Car, trend: +(Math.random() * 16 - 8).toFixed(1),
      insight: 'N2 corridor flowing well — 18% below peak average',
      sparkline: Array.from({ length: 12 }, () => Math.random() * 60 + 20),
    },
    {
      id: 'aqi', label: 'Air Quality', value: Math.round(25 + Math.random() * 70), unit: 'AQI',
      icon: Wind, trend: +(Math.random() * 14 - 10).toFixed(1),
      insight: '↓12% since yesterday — excellent air quality',
      sparkline: Array.from({ length: 12 }, () => Math.random() * 80 + 15),
    },
    {
      id: 'noise', label: 'Noise Level', value: Math.round(42 + Math.random() * 30), unit: 'dB',
      icon: Volume2, trend: +(Math.random() * 8 - 4).toFixed(1),
      insight: 'Below threshold — comfortable urban soundscape',
      sparkline: Array.from({ length: 12 }, () => Math.random() * 50 + 35),
    },
    {
      id: 'energy', label: 'Energy Use', value: Math.round(50 + Math.random() * 40), unit: '%',
      icon: Zap, trend: +(Math.random() * 10 - 5).toFixed(1),
      insight: 'Grid stable at Stage 0 — no loadshedding expected',
      sparkline: Array.from({ length: 12 }, () => Math.random() * 45 + 40),
    },
    {
      id: 'crowd', label: 'Crowd Density', value: Math.round(20 + Math.random() * 55), unit: '%',
      icon: Users, trend: +(Math.random() * 12 - 6).toFixed(1),
      insight: 'V&A Waterfront peak in 2h — consider alternatives',
      sparkline: Array.from({ length: 12 }, () => Math.random() * 60 + 15),
    },
    {
      id: 'heat', label: 'Urban Heat', value: +(22 + Math.random() * 12).toFixed(1), unit: '°C',
      icon: Thermometer, trend: +(Math.random() * 4 - 2).toFixed(1),
      insight: 'Comfortable — sea breeze cooling CBD by 3°C',
      sparkline: Array.from({ length: 12 }, () => Math.random() * 15 + 20),
    },
  ];
}

/* ── Sparkline SVG ── */
const Sparkline = ({ data, className }: { data: number[]; className?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80}`).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("w-full h-8 opacity-40", className)}>
      <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};

/* ── City Pulse Messages ── */
const cityPulseMessages = [
  "Cape Town is running 8% more efficiently than yesterday. Air quality excellent, traffic light across all corridors.",
  "Moderate crowd density at V&A Waterfront. Table Mountain cable car wait time: ~15 min. All systems nominal.",
  "Energy grid stable at Stage 0. Sea breeze keeping CBD comfortable. 3 minor incidents resolved in last hour.",
  "Tourism footfall up 12% this week. All emergency services on standby. Water reservoirs at 87% capacity.",
];

/* ── Recent Alerts ── */
const recentAlerts = [
  { severity: 'high' as const, text: 'Theft reported in Camps Bay', time: '15 min ago', area: 'Camps Bay' },
  { severity: 'medium' as const, text: 'Vehicle break-in at Sea Point', time: '42 min ago', area: 'Sea Point' },
  { severity: 'low' as const, text: 'Safety patrol completed — Waterfront', time: '2 hrs ago', area: 'V&A Waterfront' },
];

const severityColor = {
  high: 'bg-destructive',
  medium: 'bg-safety-orange',
  low: 'bg-safety-green',
};

/* ── Insight Cards ── */
const insightCards = [
  { id: 'heatmap', label: 'Predictive Heat Map', sub: '3-day crime forecast', icon: Flame, color: 'text-destructive' },
  { id: 'waste', label: 'Waste Optimization', sub: '92% collection rate', icon: Recycle, color: 'text-safety-green' },
  { id: 'accessibility', label: 'Accessibility Score', sub: '7.4/10 — improving', icon: Accessibility, color: 'text-primary' },
  { id: 'tourism', label: 'Tourism Flow', sub: '+12% this week', icon: Compass, color: 'text-safety-yellow' },
];

/* ──────────────────────────────── Main Component ──────────────────────────────── */

const DashboardView = memo(({ onUpgrade, onNavigate }: DashboardViewProps) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const kpis = useKPIData();

  const [pulseIdx, setPulseIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulseIdx(p => (p + 1) % cityPulseMessages.length), 8000);
    return () => clearInterval(t);
  }, []);

  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 lg:p-8">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {greeting}, Cape Town Planner <span className="inline-block animate-pulse">✦</span>
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm lg:text-base max-w-2xl">
            Your city is running <span className="text-primary font-semibold">8% more efficiently</span> than yesterday. All critical systems nominal.
          </p>
        </div>
      </div>

      {/* ── Hero KPI Bar ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.id}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border/50",
              "bg-card/60 backdrop-blur-xl p-4 transition-all duration-300",
              "hover:border-primary/30 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.15)]",
              "hover:-translate-y-0.5 cursor-default"
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: 'inset 0 1px 1px hsl(var(--primary) / 0.08)' }}
            />

            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="w-4 h-4 text-primary/70" />
              <span className={cn(
                "text-[10px] font-bold tabular-nums",
                Number(kpi.trend) >= 0 ? 'text-destructive' : 'text-safety-green'
              )}>
                {Number(kpi.trend) >= 0 ? '↑' : '↓'} {Math.abs(Number(kpi.trend))}%
              </span>
            </div>

            <div className="text-2xl font-black text-foreground tabular-nums leading-none">
              <AnimatedNumber value={kpi.value} />
              <span className="text-xs font-medium text-muted-foreground ml-1">{kpi.unit}</span>
            </div>

            <p className="text-[11px] font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{kpi.label}</p>

            {/* Sparkline */}
            <div className="mt-2">
              <Sparkline data={kpi.sparkline} />
            </div>

            {/* AI Insight */}
            <p className="text-[10px] text-muted-foreground/80 mt-1.5 line-clamp-2 leading-tight">{kpi.insight}</p>
          </div>
        ))}
      </div>

      {/* ── Central Map + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Map */}
        <div className="relative rounded-2xl border border-border/50 overflow-hidden bg-card/40 backdrop-blur-xl"
          style={{ minHeight: '480px' }}
        >
          <InteractiveMap fullHeight />

          {/* City Pulse AI Pill */}
          <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:max-w-md z-[1000]">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg">
              <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
              <p className="text-xs text-foreground/90 leading-snug transition-all duration-500">
                {cityPulseMessages[pulseIdx]}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar — Quick Insights */}
        <div className="space-y-4 hidden lg:flex flex-col">
          {/* Active Alerts */}
          <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-destructive" />
                <h3 className="text-sm font-bold text-foreground">Active Alerts</h3>
              </div>
              <span className="text-[10px] font-mono text-destructive animate-pulse">● 3 LIVE</span>
            </div>
            <div className="divide-y divide-border/30">
              {recentAlerts.map((alert, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", severityColor[alert.severity])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{alert.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{alert.area} · {alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="w-full px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1 border-t border-border/30"
            >
              View All Alerts <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Your City Today */}
          <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Your City Today
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Safety Score', value: '7.8/10', color: 'text-safety-green' },
                { label: 'Water Reserves', value: '87%', color: 'text-primary' },
                { label: 'Loadshedding', value: 'Stage 0', color: 'text-safety-green' },
                { label: 'Active Incidents', value: '12', color: 'text-safety-orange' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className={cn("text-xs font-bold tabular-nums", item.color)}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            {[
              { label: 'Tourism Hub', icon: Compass, view: 'tourism-hub' as ViewId },
              { label: 'Mobility Optimizer', icon: Car, view: 'traffic-optimizer' as ViewId },
              { label: 'Emergency Overlay', icon: Ambulance, view: 'emergency' as ViewId },
            ].map(nav => (
              <button
                key={nav.label}
                onClick={() => onNavigate(nav.view)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <nav.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground flex-1 text-left">{nav.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Insights Row ── */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Deep Insights</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {insightCards.map(card => (
            <button
              key={card.id}
              onClick={() => setExpandedInsight(expandedInsight === card.id ? null : card.id)}
              className={cn(
                "relative overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl p-4 text-left transition-all duration-300",
                "hover:border-primary/30 hover:shadow-[0_0_20px_-6px_hsl(var(--primary)/0.12)] hover:-translate-y-0.5",
                expandedInsight === card.id && "border-primary/40 bg-primary/5"
              )}
            >
              <card.icon className={cn("w-5 h-5 mb-2", card.color)} />
              <h3 className="text-sm font-bold text-foreground">{card.label}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{card.sub}</p>
              <ChevronRight className={cn(
                "w-4 h-4 text-muted-foreground absolute top-4 right-4 transition-transform",
                expandedInsight === card.id && "rotate-90"
              )} />

              {expandedInsight === card.id && (
                <div className="mt-3 pt-3 border-t border-border/30 animate-fade-in">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Advanced analytics powered by AI. Predictive modeling across 12 urban data streams to surface actionable patterns and optimize city operations.
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpgrade('Deep Insights'); }}
                    className="mt-2 text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    Open Full View <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {[
            { type: 'high' as const, text: 'Theft reported in Camps Bay', time: '15 min ago', area: 'Camps Bay' },
            { type: 'medium' as const, text: 'Vehicle break-in at Sea Point parking', time: '42 min ago', area: 'Sea Point' },
            { type: 'low' as const, text: 'Suspicious activity near City Centre station', time: '1 hr ago', area: 'City Centre' },
            { type: 'low' as const, text: 'Safety patrol completed in Waterfront', time: '2 hrs ago', area: 'V&A Waterfront' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl hover:bg-muted/20 transition-colors">
              <div className={cn("w-2 h-2 rounded-full shrink-0", severityColor[item.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.text}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.area} · {item.time}</p>
              </div>
              <button className="text-xs text-primary font-semibold hover:underline shrink-0">View</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Explore Safe Areas', view: 'areas' as ViewId, icon: MapPin },
            { label: 'Plan Your Day', view: 'activities' as ViewId, icon: Zap, elite: true },
            { label: 'View Analytics', view: 'safety-overview' as ViewId, icon: BarChart3, elite: true },
            { label: 'Check Activities', view: 'activities' as ViewId, icon: Compass },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => action.elite ? onUpgrade(`Unlock ${action.label}`) : onNavigate(action.view)}
              className="p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl hover:bg-primary/5 hover:border-primary/30 transition-all text-left group"
            >
              <action.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">{action.label}</span>
              {action.elite && <span className="ml-1.5 text-[9px] font-bold bg-elite-gradient text-foreground px-1.5 py-0.5 rounded-full">👑</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Municipal Performance ── */}
      <MunicipalPerformance />

      {/* ── Elite Preview ── */}
      <div className="p-6 rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-elite-from" />
          <h3 className="text-lg font-bold text-foreground">Unlock Real-Time Intelligence</h3>
        </div>
        <ul className="space-y-2 mb-4">
          {['Real-time safety alerts', '5-year historical data', 'AI-powered recommendations', 'Professional tools suite', 'Unlimited saved locations'].map(f => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-elite-from shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onUpgrade()}
          className="px-6 py-3 rounded-xl bg-elite-gradient text-foreground font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Crown className="w-4 h-4" />
          START FREE 7-DAY TRIAL
        </button>
      </div>
    </div>
  );
});

DashboardView.displayName = 'DashboardView';
export default DashboardView;
