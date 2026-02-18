import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  X, Bell, Crown, Settings, MapPin, AlertTriangle, Shield,
  Clock, Filter, ToggleLeft, ToggleRight, ChevronRight
} from 'lucide-react';

interface NotificationsHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotifTab = 'feed' | 'zones' | 'settings';

interface NotifItem {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  time: string;
  area: string;
}

const mockNotifications: NotifItem[] = [
  { id: '1', title: 'Armed robbery reported', message: 'Multiple suspects near Long Street', severity: 'critical', time: '5 min ago', area: 'City Centre' },
  { id: '2', title: 'Vehicle break-in cluster', message: '3 incidents in past hour', severity: 'high', time: '18 min ago', area: 'Sea Point' },
  { id: '3', title: 'Load shedding Stage 4', message: 'Affecting multiple suburbs', severity: 'medium', time: '32 min ago', area: 'Cape Town' },
  { id: '4', title: 'Route advisory', message: 'Avoid N2 near Khayelitsha exit', severity: 'high', time: '45 min ago', area: 'Khayelitsha' },
  { id: '5', title: 'Beach safety update', message: 'Strong currents at Muizenberg', severity: 'medium', time: '1h ago', area: 'Muizenberg' },
  { id: '6', title: 'Neighbourhood watch alert', message: 'Suspicious activity reported', severity: 'low', time: '2h ago', area: 'Constantia' },
];

const severityStyles = {
  critical: 'bg-safety-red/10 border-safety-red/30 text-safety-red',
  high: 'bg-safety-orange/10 border-safety-orange/30 text-safety-orange',
  medium: 'bg-safety-yellow/10 border-safety-yellow/30 text-safety-yellow',
  low: 'bg-secondary border-border text-muted-foreground',
};

const severityDots = {
  critical: 'bg-safety-red',
  high: 'bg-safety-orange',
  medium: 'bg-safety-yellow',
  low: 'bg-muted-foreground',
};

const NotificationsHub = memo(({ isOpen, onClose }: NotificationsHubProps) => {
  const [activeTab, setActiveTab] = useState<NotifTab>('feed');
  const [prefs, setPrefs] = useState({
    realtime: true,
    criticalOnly: false,
    routeAlerts: true,
    geofence: true,
    dailyDigest: true,
    weeklyReport: false,
  });

  if (!isOpen) return null;

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-[90] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Notifications</h2>
            <span className="text-[8px] bg-elite-gradient text-white px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-4">
          {([
            { id: 'feed' as const, label: 'Live Feed', icon: AlertTriangle },
            { id: 'zones' as const, label: 'Alert Zones', icon: MapPin },
            { id: 'settings' as const, label: 'Settings', icon: Settings },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors",
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'feed' && (
            <div className="p-3 space-y-2">
              {mockNotifications.map(notif => (
                <div key={notif.id} className={cn("p-3 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity", severityStyles[notif.severity])}>
                  <div className="flex items-start gap-2">
                    <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", severityDots[notif.severity])} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-foreground">{notif.title}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{notif.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{notif.message}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{notif.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground mb-2">
                Set up geofence alerts — get notified when entering orange/red zones.
              </p>
              {['Home — Camps Bay (500m)', 'Office — CBD (1km)', 'School — Claremont (800m)'].map((zone, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{zone}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
              <button className="w-full py-2.5 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                + Add Alert Zone
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-1">
              {([
                { key: 'realtime' as const, label: 'Real-time incident alerts', desc: 'Get notified immediately' },
                { key: 'criticalOnly' as const, label: 'Critical alerts only', desc: 'Only high-severity incidents' },
                { key: 'routeAlerts' as const, label: 'Route safety warnings', desc: '"Avoid this route now" suggestions' },
                { key: 'geofence' as const, label: 'Geofence alerts', desc: 'Alert when entering risk zones' },
                { key: 'dailyDigest' as const, label: 'Daily safety digest', desc: 'Summary every morning at 7am' },
                { key: 'weeklyReport' as const, label: 'Weekly trend report', desc: 'Comprehensive weekly analysis' },
              ]).map(pref => (
                <button
                  key={pref.key}
                  onClick={() => togglePref(pref.key)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">{pref.label}</div>
                    <div className="text-xs text-muted-foreground">{pref.desc}</div>
                  </div>
                  {prefs[pref.key]
                    ? <ToggleRight className="w-6 h-6 text-primary shrink-0" />
                    : <ToggleLeft className="w-6 h-6 text-muted-foreground shrink-0" />
                  }
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

NotificationsHub.displayName = 'NotificationsHub';
export default NotificationsHub;
