import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Bell, Crown, Lock, AlertTriangle, MapPin, Clock, Shield } from 'lucide-react';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const sampleAlerts = [
  { priority: 'high', title: 'Active robbery reported', area: 'Long Street, City Centre', time: '5 min ago', detail: 'Multiple reports of armed robbery. SAPS en route. Avoid area.' },
  { priority: 'high', title: 'Vehicle hijacking attempt', area: 'N2 Highway, Khayelitsha exit', time: '18 min ago', detail: 'Hijacking attempt at off-ramp. Flying squad dispatched.' },
  { priority: 'high', title: 'Protest action blocking road', area: 'Klipfontein Road, Athlone', time: '32 min ago', detail: 'Road blocked. Alternative routes via N1 recommended.' },
  { priority: 'medium', title: 'Suspicious activity reported', area: 'Sea Point Promenade', time: '1 hr ago', detail: 'Group reported behaving suspiciously near benches. Security alerted.' },
  { priority: 'medium', title: 'Power outage affecting CCTV', area: 'Woodstock Industrial', time: '2 hrs ago', detail: 'Load shedding Stage 4 affecting camera coverage in area.' },
  { priority: 'low', title: 'Community patrol active', area: 'Constantia, Upper', time: '3 hrs ago', detail: 'Neighbourhood watch conducting scheduled patrol.' },
  { priority: 'low', title: 'New safety cameras installed', area: 'V&A Waterfront Extension', time: '5 hrs ago', detail: '12 new HD cameras installed covering parking areas.' },
];

const priorityConfig = {
  high: { color: 'border-l-safety-red', badge: 'bg-safety-red text-white', label: '🔴 HIGH PRIORITY' },
  medium: { color: 'border-l-safety-yellow', badge: 'bg-safety-yellow text-white', label: '🟡 MEDIUM PRIORITY' },
  low: { color: 'border-l-safety-green', badge: 'bg-safety-green text-white', label: '🟢 LOW PRIORITY' },
};

const AlertsView = memo(({ onUpgrade }: Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          Alerts & Notifications
          <span className="text-sm font-bold bg-elite-gradient text-white px-2 py-0.5 rounded-full">👑 ELITE</span>
        </h1>
        <p className="text-muted-foreground mt-1">Real-time safety alerts for your locations</p>
      </div>

      {/* Free user preview */}
      <div className="p-6 rounded-xl border-2 border-elite-from/30 bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-elite-from" />
          <h3 className="text-lg font-bold text-foreground">⚠️ Elite Members Only</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Unlock real-time safety alerts tailored to your locations and routes.</p>
        <ul className="space-y-1.5 mb-4">
          {[
            'Instant incident notifications near saved locations',
            'Route safety alerts while traveling',
            'Geofence warnings entering risk zones',
            'Daily/weekly safety digests',
            'Custom quiet hours',
            'SMS alerts for high-priority events (Enterprise)',
          ].map(f => (
            <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
              <Crown className="w-3 h-3 text-elite-from shrink-0" /> {f}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onUpgrade('Unlock Real-Time Alerts')}
          className="px-6 py-3 rounded-xl bg-elite-gradient text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Crown className="w-4 h-4" />
          UPGRADE TO ELITE
        </button>
      </div>

      {/* Sample alerts (blurred/preview) */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Sample Alerts Preview</h3>
        <div className="space-y-3 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10 pointer-events-none" />
          {sampleAlerts.map((alert, i) => {
            const config = priorityConfig[alert.priority as keyof typeof priorityConfig];
            return (
              <div key={i} className={cn("p-4 rounded-xl border border-border bg-card border-l-4", config.color, i > 2 && "opacity-40 blur-[1px]")}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">{alert.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.area}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{alert.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

AlertsView.displayName = 'AlertsView';
export default AlertsView;
