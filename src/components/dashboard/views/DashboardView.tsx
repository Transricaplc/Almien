import { memo, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Shield, AlertTriangle, Navigation, Heart, MapPin, Clock,
  Phone, ChevronDown, ChevronUp, Zap, ExternalLink, CheckCircle2, Map
} from 'lucide-react';
import type { ViewId } from '../GridifyDashboard';
import TimeRiskStrip from '../widgets/TimeRiskStrip';
import AreaIntelCard from '../widgets/AreaIntelCard';
import { getTimeWindows } from '@/data/timeAnalyticsData';

interface DashboardViewProps {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

// ── Mock data ──────────────────────────────────────────────
const crimeFilters = ['All', 'Theft', 'Robbery', 'Assault', 'GBV', 'Drugs', 'Hijacking', 'Housebreaking'];

const briefing = {
  suburb: 'Sea Point',
  line1: '3 vehicle break-ins reported overnight — highest in 7 days',
  line2: 'Risk elevated 17:00–20:00 today',
  line3: 'Avoid Beach Road near Queens after dark',
};

const incidents = [
  { id: '1', type: 'Theft', icon: '🔴', time: '14 min ago', location: 'Beach Rd, Sea Point', distance: '0.4 km', verified: true },
  { id: '2', type: 'Robbery', icon: '🔴', time: '28 min ago', location: 'Main Rd, Green Point', distance: '1.2 km', verified: true },
  { id: '3', type: 'Suspicious Activity', icon: '🟡', time: '52 min ago', location: 'High Level Rd', distance: '0.8 km', verified: false },
];

// Risk colors for rendering
const riskColors: Record<string, string> = {
  low: 'bg-safety-green',
  elevated: 'bg-safety-yellow',
  high: 'bg-safety-orange',
  critical: 'bg-safety-red',
};

const communityReports = [
  { user: '🛡️ @WatchdogCPT', text: 'Pickpocket active near Greenmarket Square', time: '1 hr ago', suburb: 'City Centre' },
  { user: '⭐ @SafetyWatcher', text: 'Vehicle circling block on High Level Rd', time: '2 hrs ago', suburb: 'Sea Point' },
];

const emergencyContacts = [
  { label: 'SAPS Emergency', number: '10111', icon: Phone },
  { label: 'CT Law Enforcement', number: '021 480 7700', icon: Phone },
  { label: 'Ambulance (WC)', number: '10177', icon: Phone },
  { label: 'GBV Helpline', number: '0800 428 428', icon: Heart },
];

const DashboardView = memo(({ onNavigate }: DashboardViewProps) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [briefingExpanded, setBriefingExpanded] = useState(false);
  const riskWindows = useMemo(() => getTimeWindows(), []);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ═══ PANEL 3 — LIVE THREAT MAP TILE ═══ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="relative h-[45vh] min-h-[240px] bg-secondary/30 flex items-center justify-center">
          {/* Simulated map */}
          <div className="absolute inset-0 opacity-20" style={{
            background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.3), transparent 60%)'
          }} />
          <div className="relative text-center z-10">
            <Map className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Tap to view full map</p>
          </div>
          {/* LIVE badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Live</span>
          </div>
          {/* Expand button */}
          <button
            onClick={() => onNavigate('map-full')}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur border border-border text-xs font-semibold text-foreground hover:bg-card transition-colors"
          >
            Expand Map
          </button>
        </div>

        {/* Crime type filter pills */}
        <div className="p-3 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-visible">
            {crimeFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                  activeFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ PANEL 4 — TODAY'S SAFETY BRIEFING ═══ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex">
          <div className="w-1 shrink-0 bg-safety-yellow" />
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-foreground">
                Today's Briefing — {briefing.suburb}
              </h2>
              <span className="text-[10px] text-muted-foreground">
                {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p>• {briefing.line1}</p>
              <p>• <span className="text-safety-yellow font-medium">{briefing.line2}</span></p>
              <p>• {briefing.line3}</p>
            </div>
            {briefingExpanded && (
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1 animate-fade-in">
                <p>🔹 SAPS patrol active on Beach Road until 22:00</p>
                <p>🔹 Community night watch deployed from 19:00</p>
                <p>🔹 3 CCTV cameras operational in immediate area</p>
              </div>
            )}
            <button
              onClick={() => setBriefingExpanded(!briefingExpanded)}
              className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {briefingExpanded ? 'Less' : 'Full Briefing'}
              {briefingExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ PANEL 5 — ACTIVE ALERTS FEED ═══ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            Active Nearby — Last 2 Hours
            <span className="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold tabular-nums">
              {incidents.length}
            </span>
          </h2>
        </div>
        <div className="space-y-2">
          {incidents.map(inc => (
            <div key={inc.id} className="p-3 rounded-xl border border-border bg-card flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <AlertTriangle className={cn(
                  "w-4 h-4",
                  inc.verified ? "text-destructive" : "text-safety-yellow"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">{inc.type}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                    inc.verified
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {inc.verified ? 'Verified' : 'Community'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{inc.location}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-muted-foreground">{inc.time}</p>
                <p className="text-[10px] text-muted-foreground tabular-nums">{inc.distance}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-2 py-2.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">
          See All Incidents
        </button>
      </div>

      {/* ═══ PANEL 6 — QUICK ACTION ROW ═══ */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Safe Route', icon: Navigation, view: 'safe-route' as ViewId, desc: 'Plan your journey' },
          { label: 'Report Incident', icon: AlertTriangle, view: 'community' as ViewId, desc: 'Alert your area' },
          { label: 'Share Journey', icon: MapPin, view: 'safe-route' as ViewId, desc: 'Live tracking' },
          { label: 'Safe Space', icon: Heart, view: 'safe-space' as ViewId, desc: 'GBV support' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.view)}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all text-left min-h-[80px]"
          >
            <action.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-sm font-semibold text-foreground">{action.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* ═══ PANEL 7 — RISK PLANNER STRIP ═══ */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3">Tonight's Risk Windows</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-visible">
          {riskWindows.map(w => (
            <div key={w.id} className={cn(
              "p-3 rounded-xl border bg-card shrink-0 w-[150px]",
              w.loadshedding ? "border-safety-orange/30" : "border-border"
            )}>
              <p className="text-xs font-bold text-foreground tabular-nums">{w.time}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={cn("h-1.5 flex-1 rounded-full", riskColors[w.risk])} />
                {w.loadshedding && <Zap className="w-3.5 h-3.5 text-safety-yellow shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 capitalize">{w.risk} risk</p>
              <p className="text-[10px] text-foreground font-medium mt-0.5">{w.dominantCrime}</p>
              {w.loadshedding && (
                <p className="text-[10px] text-safety-yellow font-medium">Load-shedding</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PANEL 7b — TIME-OF-DAY RISK ANALYSIS ═══ */}
      <TimeRiskStrip variant="detail" />

      {/* ═══ PANEL 7c — AREA INTELLIGENCE SEARCH ═══ */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Area Intelligence
        </h2>
        <AreaIntelCard variant="inline" />
      </div>

      {/* ═══ PANEL 8 — COMMUNITY FEED PREVIEW ═══ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Your Neighbourhood</h2>
          <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">Connected</span>
        </div>
        <div className="space-y-2">
          {communityReports.map((r, i) => (
            <div key={i} className="p-3 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span className="font-medium">{r.user}</span>
                <span>·</span>
                <span>{r.time}</span>
              </div>
              <p className="text-sm text-foreground">{r.text}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{r.suburb}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => onNavigate('community')}
          className="w-full mt-2 py-2.5 rounded-xl border border-border text-xs font-medium text-primary hover:bg-secondary transition-colors"
        >
          See All Community Reports
        </button>
      </div>

      {/* ═══ PANEL 9 — EMERGENCY CONTACTS STRIP ═══ */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3">Emergency Contacts</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-visible">
          {emergencyContacts.map(c => (
            <a
              key={c.label}
              href={`tel:${c.number.replace(/\s/g, '')}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:border-primary/30 transition-colors shrink-0 min-h-[48px]"
            >
              <c.icon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground whitespace-nowrap">{c.label}</p>
                <p className="text-[10px] text-muted-foreground tabular-nums">{c.number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

DashboardView.displayName = 'DashboardView';
export default DashboardView;
