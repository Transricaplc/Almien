import { memo } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import SafetyScoreBadge from '../SafetyScoreBadge';
import VirtualEscortTimer from '../VirtualEscortTimer';
import { capeTownAreas, getTopSafeAreas } from '@/data/capeTownSafetyData';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const SafetyOverviewView = memo(({ onUpgrade, onNavigate }: Props) => {
  const greenAreas = capeTownAreas.filter(a => a.safetyLevel === 'green');
  const yellowAreas = capeTownAreas.filter(a => a.safetyLevel === 'yellow');
  const orangeAreas = capeTownAreas.filter(a => a.safetyLevel === 'orange');
  const redAreas = capeTownAreas.filter(a => a.safetyLevel === 'red');
  const topSafe = getTopSafeAreas(5);

  const hotspots = [...capeTownAreas].sort((a, b) => a.safetyScore - b.safetyScore).slice(0, 3);

  const zones = [
    { label: 'Safe Zones', range: '8.0-10.0', count: greenAreas.length, pct: Math.round(greenAreas.length / capeTownAreas.length * 100), color: 'bg-safety-green', textColor: 'text-safety-green' },
    { label: 'Moderate', range: '6.0-7.9', count: yellowAreas.length, pct: Math.round(yellowAreas.length / capeTownAreas.length * 100), color: 'bg-safety-yellow', textColor: 'text-safety-yellow' },
    { label: 'Caution', range: '4.0-5.9', count: orangeAreas.length, pct: Math.round(orangeAreas.length / capeTownAreas.length * 100), color: 'bg-safety-orange', textColor: 'text-safety-orange' },
    { label: 'High Risk', range: '0-3.9', count: redAreas.length, pct: Math.round(redAreas.length / capeTownAreas.length * 100), color: 'bg-safety-red', textColor: 'text-safety-red' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Safety Overview</h1>
        <p className="text-muted-foreground mt-1">City-wide safety intelligence</p>
      </div>

      {/* Virtual Escort Timer */}
      <VirtualEscortTimer />

      {/* Main score */}
      <div className="p-6 rounded-xl border border-border bg-card flex items-center gap-6">
        <SafetyScoreBadge score={7.8} size="lg" />
        <div>
          <div className="text-3xl font-bold text-foreground">7.8 / 10</div>
          <div className="text-lg text-muted-foreground">Generally Safe</div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-safety-green">
            <TrendingUp className="w-4 h-4" />
            Improving 3% this week
          </div>
        </div>
      </div>

      {/* Zone breakdown */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Zone Safety Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {zones.map(zone => (
            <div key={zone.label} className="p-5 rounded-xl border border-border bg-card card-hover">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-3 h-3 rounded-full", zone.color)} />
                <span className="text-sm font-semibold text-foreground">{zone.label}</span>
                <span className="text-xs text-muted-foreground">({zone.range})</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{zone.count} areas</div>
              <div className="text-sm text-muted-foreground">{zone.pct}% of city</div>
              <button
                onClick={() => onNavigate('areas')}
                className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View Areas <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Today's incident summary */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-bold text-foreground mb-4">Today's Incident Summary</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-foreground">45</div>
            <div className="text-sm text-muted-foreground">Total Incidents</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-safety-green">↓ 12%</div>
            <div className="text-sm text-muted-foreground">vs Yesterday (57)</div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {[
            { type: 'Theft & Pickpocketing', pct: 38 },
            { type: 'Vehicle Crime', pct: 25 },
            { type: 'Robbery', pct: 18 },
            { type: 'Property Crime', pct: 12 },
            { type: 'Other', pct: 7 },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-40 shrink-0">{item.type}</span>
              <div className="flex-1 bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${item.pct}%` }} />
              </div>
              <span className="text-sm font-medium text-muted-foreground w-10 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => onUpgrade('View Detailed Analysis with Elite')}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          View Detailed Analysis 👑 <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Current Hotspots */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Current Hotspots</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hotspots.map(area => (
            <div key={area.id} className="p-5 rounded-xl border border-border bg-card card-hover">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{area.name}</span>
                <SafetyScoreBadge score={area.safetyScore} size="sm" />
              </div>
              <div className="text-xs text-muted-foreground">{area.incidentCount.last7Days} incidents this week</div>
              <button
                onClick={() => onNavigate('areas')}
                className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View Details <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Safest Areas */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Safest Areas Right Now</h2>
        <div className="space-y-2">
          {topSafe.map((area, i) => (
            <div key={area.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card card-hover">
              <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{area.name}</span>
              </div>
              <SafetyScoreBadge score={area.safetyScore} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

SafetyOverviewView.displayName = 'SafetyOverviewView';
export default SafetyOverviewView;
