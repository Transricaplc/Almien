import { memo } from 'react';
import { cn } from '@/lib/utils';
import {
  Shield, AlertTriangle, Bookmark, TrendingDown, Crown,
  ArrowRight, Clock, MapPin, Lock, Zap, Navigation
} from 'lucide-react';
import SafetyScoreBadge from '../SafetyScoreBadge';
import MunicipalPerformance from '../MunicipalPerformance';
import UrbanMetricsTiles from '../UrbanMetricsTiles';
import type { ViewId } from '../GridifyDashboard';

interface DashboardViewProps {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const recentActivity = [
  { type: 'red' as const, text: 'Theft reported in Camps Bay', time: '15 min ago', area: 'Camps Bay' },
  { type: 'orange' as const, text: 'Vehicle break-in at Sea Point parking', time: '42 min ago', area: 'Sea Point' },
  { type: 'yellow' as const, text: 'Suspicious activity near City Centre station', time: '1 hr ago', area: 'City Centre' },
  { type: 'green' as const, text: 'Safety patrol completed in Waterfront', time: '2 hrs ago', area: 'V&A Waterfront' },
  { type: 'red' as const, text: 'Robbery reported on Long Street', time: '3 hrs ago', area: 'City Centre' },
];

const typeColors = {
  red: 'bg-safety-red',
  orange: 'bg-safety-orange',
  yellow: 'bg-safety-yellow',
  green: 'bg-safety-green',
};

const DashboardView = memo(({ onUpgrade, onNavigate }: DashboardViewProps) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{greeting}! 👋</h1>
        <p className="text-muted-foreground mt-1">Your Cape Town Safety Intelligence</p>
      </div>

      {/* Urban Pulse - Live Metrics */}
      <UrbanMetricsTiles />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Cape Town Safety', value: '7.8 / 10', sub: 'Generally Safe', icon: Shield, color: 'text-safety-green' },
          { label: 'Active Alerts', value: '12', sub: '3 High Risk', icon: AlertTriangle, color: 'text-safety-orange' },
          { label: 'Your Locations', value: '3 / 3', sub: 'Upgrade for ∞', icon: Bookmark, color: 'text-primary' },
          { label: 'Incidents Today', value: '45', sub: 'Below average', icon: Clock, color: 'text-muted-foreground' },
          { label: 'Trend vs Yesterday', value: '↓ 12%', sub: 'Improving', icon: TrendingDown, color: 'text-safety-green' },
          { label: 'Elite Features', value: 'Locked', sub: '', icon: Lock, color: 'text-muted-foreground', isUpgrade: true },
        ].map(card => (
          <div
            key={card.label}
            className={cn(
              "p-5 rounded-xl border border-border bg-card card-hover",
              card.isUpgrade && "cursor-pointer"
            )}
            onClick={card.isUpgrade ? () => onUpgrade() : undefined}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</span>
              <card.icon className={cn("w-5 h-5", card.color)} />
            </div>
            <div className={cn("text-2xl font-bold", card.color === 'text-muted-foreground' ? 'text-foreground' : card.color)}>
              {card.value}
            </div>
            {card.sub && <p className="text-sm text-muted-foreground mt-1">{card.sub}</p>}
            {card.isUpgrade && (
              <button
                className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Upgrade Now <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card card-hover">
              <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", typeColors[item.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.area} · {item.time}</p>
              </div>
              <button className="text-xs text-primary font-semibold hover:underline shrink-0">View</button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Plan Safe Route', view: 'safe-route' as ViewId, icon: Navigation },
            { label: 'Explore Safe Areas', view: 'areas' as ViewId, icon: MapPin },
            { label: 'Plan Your Day', view: 'activities' as ViewId, icon: Zap, elite: true },
            { label: 'View Analytics', view: 'safety-overview' as ViewId, icon: Shield, elite: true },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => action.elite ? onUpgrade(`Unlock ${action.label} with Elite`) : onNavigate(action.view)}
              className="p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left"
            >
              <action.icon className="w-5 h-5 text-primary mb-2" />
              <span className="text-sm font-medium text-foreground">{action.label}</span>
              {action.elite && <span className="ml-1 text-[9px] font-bold bg-elite-gradient text-white px-1.5 py-0.5 rounded-full">👑</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Municipal Performance & Infrastructure Faults */}
      <MunicipalPerformance />

      {/* Elite Preview */}
      <div className="p-6 rounded-xl border border-border bg-card">
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
          className="px-6 py-3 rounded-xl bg-elite-gradient text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
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
