import { memo, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Shield, AlertTriangle, Navigation, Heart, MapPin, Clock,
  Phone, ChevronDown, ChevronUp, Zap, Map
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SafetyScoreRing from '../SafetyScoreRing';
import MetricStrip from '../MetricStrip';
import GuardianAlert from '../widgets/GuardianAlert';
import type { ViewId } from '../GridifyDashboard';
import TimeRiskStrip from '../widgets/TimeRiskStrip';
import AreaIntelCard from '../widgets/AreaIntelCard';
import { getTimeWindows } from '@/data/timeAnalyticsData';

interface DashboardViewProps {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

// ── Mock data ──────────────────────────────────────────────
const briefing = {
  suburb: 'Sea Point',
  line1: '3 vehicle break-ins reported overnight — highest in 7 days',
  line2: 'Risk elevated 17:00–20:00 today',
  line3: 'Avoid Beach Road near Queens after dark',
};

const incidents = [
  { id: '1', type: 'Theft', emoji: '🔴', time: '14 min ago', location: 'Beach Rd, Sea Point', distance: '0.4 km', verified: true },
  { id: '2', type: 'Robbery', emoji: '🔴', time: '28 min ago', location: 'Main Rd, Green Point', distance: '1.2 km', verified: true },
  { id: '3', type: 'Suspicious', emoji: '🟡', time: '52 min ago', location: 'High Level Rd', distance: '0.8 km', verified: false },
];

const riskColors: Record<string, string> = {
  low: 'bg-safety-green',
  elevated: 'bg-safety-yellow',
  high: 'bg-safety-orange',
  critical: 'bg-safety-red',
};

const emergencyContacts = [
  { label: 'SAPS', number: '10111', color: 'text-blue-400' },
  { label: 'CT Law', number: '021 480 7700', color: 'text-blue-400' },
  { label: 'Ambulance', number: '10177', color: 'text-destructive' },
  { label: 'GBV Helpline', number: '0800 428 428', color: 'text-accent-gbv' },
];

const DashboardView = memo(({ onNavigate }: DashboardViewProps) => {
  const [briefingExpanded, setBriefingExpanded] = useState(false);
  const riskWindows = useMemo(() => getTimeWindows(), []);
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ═══ GUARDIAN RISK ENGINE ALERT ═══ */}
      <GuardianAlert onNavigate={onNavigate} />

      {/* ═══ DAILY SAFETY BRIEFING CARD ═══ */}
      <div className="rounded-xl overflow-hidden bg-[hsl(var(--surface-01))] border border-[hsl(var(--border-subtle))]">
        <div className="flex">
          <div className="w-1 shrink-0 bg-accent-safe" />
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium text-foreground">Your Safety Briefing</span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <h2 className="text-[28px] font-bold text-foreground leading-tight mb-3">{briefing.suburb}</h2>
            <div className="space-y-1.5 text-[13px] text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                {briefing.line1}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-safety-yellow shrink-0" />
                <span className="text-safety-yellow font-medium">{briefing.line2}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                {briefing.line3}
              </p>
            </div>
            {briefingExpanded && (
              <div className="mt-3 pt-3 border-t border-[hsl(var(--border-subtle))] text-xs text-muted-foreground space-y-1 animate-fade-in">
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

      {/* ═══ SAFETY SCORE RING — Apple Health ═══ */}
      {isMobile && (
        <SafetyScoreRing
          score={7.8}
          suburb={briefing.suburb}
          onTap={() => onNavigate('safety-overview')}
        />
      )}

      {/* ═══ METRIC STRIP — Stripe data clarity ═══ */}
      <MetricStrip />

      {/* ═══ INCIDENT FEED — Linear speed ═══ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            Active Nearby — Last 2 Hours
            <span className="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold tabular-nums">
              {incidents.length}
            </span>
          </h2>
        </div>
        <div className="divide-y divide-[hsl(var(--border-subtle)/0.3)]">
          {incidents.map(inc => (
            <button
              key={inc.id}
              onClick={() => {}}
              className="w-full text-left flex items-center gap-3 py-3 active:bg-[hsl(var(--surface-02))] transition-colors duration-100 cursor-pointer min-h-[48px]"
              aria-label={`${inc.type} at ${inc.location}, ${inc.time}`}
            >
              {/* Icon cell */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                inc.verified ? "bg-destructive/15" : "bg-safety-yellow/15"
              )}>
                <span className="text-sm">{inc.emoji}</span>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-foreground">{inc.type}</span>
                  {inc.verified && (
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">VERIFIED</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{inc.location}</p>
              </div>
              {/* Right */}
              <div className="text-right shrink-0">
                <p className="text-[10px] font-mono text-muted-foreground">{inc.time}</p>
                <p className="text-[10px] font-mono text-accent-safe">{inc.distance}</p>
              </div>
            </button>
          ))}
        </div>
        <button className="w-full mt-2 py-3 rounded-xl border border-[hsl(var(--border-subtle))] text-xs font-medium text-muted-foreground hover:bg-[hsl(var(--surface-02))] transition-colors min-h-[48px]">
          See All Incidents
        </button>
      </div>

      {/* ═══ QUICK ACTION GRID — Uber flow ═══ */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Safe Route', icon: Navigation, view: 'safe-route' as ViewId, accent: 'text-accent-safe border-accent-safe/20' },
          { label: 'Report Incident', icon: AlertTriangle, view: 'community' as ViewId, accent: 'text-safety-yellow border-safety-yellow/20' },
          { label: 'Share Journey', icon: MapPin, view: 'safe-route' as ViewId, accent: 'text-accent-safe border-accent-safe/20' },
          { label: 'Safe Space', icon: Heart, view: 'safe-space' as ViewId, accent: 'text-accent-gbv border-accent-gbv/20' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.view)}
            className={cn(
              "p-4 rounded-xl border bg-card text-left min-h-[88px] transition-all duration-100",
              "active:scale-[0.97] active:border-opacity-100",
              action.accent
            )}
          >
            <action.icon className={cn("w-5 h-5 mb-2", action.accent.split(' ')[0])} />
            <p className="text-sm font-semibold text-foreground">{action.label}</p>
          </button>
        ))}
      </div>

      {/* ═══ RISK WINDOWS STRIP — Apple Health ═══ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground">Tonight's Risk Windows</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
          {riskWindows.map(w => (
            <div key={w.id} className={cn(
              "p-3 rounded-xl border bg-card shrink-0 w-[150px]",
              w.loadshedding ? "border-safety-yellow/30" : "border-[hsl(var(--border-subtle))]"
            )}>
              <p className="text-xs font-bold text-foreground tabular-nums">{w.time}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={cn("h-1.5 flex-1 rounded-full", riskColors[w.risk])} />
                {w.loadshedding && <Zap className="w-3.5 h-3.5 text-safety-yellow shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 capitalize">{w.risk} risk</p>
              <p className="text-[11px] text-foreground font-medium mt-0.5">{w.dominantCrime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TIME-OF-DAY RISK ANALYSIS ═══ */}
      <TimeRiskStrip variant="detail" />

      {/* ═══ AREA INTELLIGENCE ═══ */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Area Intelligence
        </h2>
        <AreaIntelCard variant="inline" />
      </div>

      {/* ═══ EMERGENCY CONTACTS STRIP ═══ */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3">Emergency Contacts</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
          {emergencyContacts.map(c => (
            <a
              key={c.label}
              href={`tel:${c.number.replace(/\s/g, '')}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[hsl(var(--border-subtle))] bg-card shrink-0 min-h-[48px] active:scale-[0.97] transition-transform"
              aria-label={`Call ${c.label} at ${c.number}`}
            >
              <Phone className={cn("w-4 h-4 shrink-0", c.color)} />
              <div>
                <p className="text-[11px] text-muted-foreground whitespace-nowrap">{c.label}</p>
                <p className="text-xs font-mono font-bold text-foreground">{c.number}</p>
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
