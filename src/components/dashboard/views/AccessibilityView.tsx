import { memo } from 'react';
import { Accessibility, AlertTriangle, CheckCircle, MapPin, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const accessibilityIssues = [
  { id: 1, location: 'Long Street & Wale Street', issue: 'Missing tactile paving at crossing', severity: 'high', status: 'open', reported: '2d ago', ward: 77 },
  { id: 2, location: 'Sea Point Promenade km 2.3', issue: 'Broken wheelchair ramp', severity: 'critical', status: 'in-progress', reported: '5d ago', ward: 54 },
  { id: 3, location: 'Adderley Street MyCiti Stop', issue: 'Non-functioning audio signal', severity: 'high', status: 'open', reported: '1d ago', ward: 77 },
  { id: 4, location: 'Cavendish Square entrance', issue: 'Steep gradient >1:12', severity: 'medium', status: 'open', reported: '7d ago', ward: 62 },
  { id: 5, location: 'Cape Town Station Platform 4', issue: 'Gap exceeds 75mm standard', severity: 'critical', status: 'escalated', reported: '3d ago', ward: 77 },
  { id: 6, location: 'Kalk Bay Main Road', issue: 'No curb cut at pedestrian crossing', severity: 'high', status: 'open', reported: '4d ago', ward: 62 },
  { id: 7, location: 'Bellville CBD Taxi Rank', issue: 'Uneven surface hazard', severity: 'medium', status: 'in-progress', reported: '10d ago', ward: 6 },
  { id: 8, location: 'V&A Waterfront Clock Tower', issue: 'Signage not Braille-compatible', severity: 'low', status: 'open', reported: '12d ago', ward: 54 },
];

const severityColor = {
  critical: 'bg-red-500/15 text-red-400',
  high: 'bg-orange-500/15 text-orange-400',
  medium: 'bg-amber-500/15 text-amber-400',
  low: 'bg-blue-500/15 text-blue-400',
};

const statusColor = {
  open: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-blue-500/15 text-blue-400',
  escalated: 'bg-red-500/15 text-red-400',
  resolved: 'bg-emerald-500/15 text-emerald-400',
};

const AccessibilityView = memo(({ onUpgrade, onNavigate }: Props) => {
  const stats = {
    total: accessibilityIssues.length,
    critical: accessibilityIssues.filter(i => i.severity === 'critical').length,
    resolved: 24,
    avgResolution: '6.2 days',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Accessibility Auditor</h1>
        <p className="text-muted-foreground mt-1">AI-detected sidewalk & barrier issues with prioritized fix list</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Open Issues', value: stats.total, icon: AlertTriangle, color: 'text-orange-400' },
          { label: 'Critical', value: stats.critical, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Resolved (30d)', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Avg Resolution', value: stats.avgResolution, icon: ArrowUpDown, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl border border-border bg-card">
            <s.icon className={cn("w-5 h-5 mb-2", s.color)} />
            <div className="text-2xl font-black text-foreground">{s.value}</div>
            <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Issues List */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Accessibility className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Prioritized Issue Queue</h3>
        </div>
        <div className="space-y-2">
          {accessibilityIssues.map(issue => (
            <div key={issue.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{issue.issue}</p>
                <p className="text-[10px] text-muted-foreground">{issue.location} · Ward {issue.ward} · {issue.reported}</p>
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", severityColor[issue.severity as keyof typeof severityColor])}>
                {issue.severity}
              </span>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", statusColor[issue.status as keyof typeof statusColor])}>
                {issue.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

AccessibilityView.displayName = 'AccessibilityView';
export default AccessibilityView;
