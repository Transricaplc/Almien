import { memo } from 'react';
import { cn } from '@/lib/utils';
import { User, Crown, MapPin, Shield, Settings, Brain, MessageSquare, ChevronRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const savedLocations = [
  { label: 'Home', name: 'Sea Point', threat: 'elevated' },
  { label: 'Work', name: 'Cape Town CBD', threat: 'high' },
];

const threatColors: Record<string, string> = {
  low: 'bg-accent-safe/15 text-accent-safe',
  elevated: 'bg-accent-warning/15 text-accent-warning',
  high: 'bg-accent-threat/15 text-accent-threat',
};

const safetyContacts = [
  { name: 'Mom', role: 'Primary Contact' },
  { name: 'Partner', role: 'Primary Contact' },
  { name: 'ADT Armed Response', role: 'Armed Response' },
];

const ProfileView = memo(({ onUpgrade, onNavigate }: Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Guest User</h1>
          <p className="text-xs text-muted-foreground">Free Plan</p>
          <button className="text-xs text-primary font-semibold mt-1 hover:underline">Edit Profile →</button>
        </div>
      </div>

      {/* Upgrade CTA */}
      <button
        onClick={() => onUpgrade()}
        className="w-full p-4 rounded-xl bg-elite-gradient text-white text-left hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-5 h-5" />
          <span className="text-sm font-bold">UPGRADE TO ELITE</span>
        </div>
        <p className="text-xs text-white/80">Real-time alerts, Guardian AI, unlimited Safi</p>
      </button>

      {/* My Locations */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">My Locations</h2>
        <div className="space-y-2">
          {savedLocations.map(loc => (
            <div key={loc.label} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{loc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{loc.label}</p>
                </div>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase", threatColors[loc.threat])}>
                {loc.threat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Network */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">My Safety Network</h2>
        <div className="space-y-2">
          {safetyContacts.map(c => (
            <div key={c.name} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-accent-safe" />
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.role}</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => onNavigate('safety-network')} className="text-xs text-primary font-semibold hover:underline">See All →</button>
        </div>
      </div>

      {/* Quick links */}
      <div className="space-y-1">
        {[
          { label: 'Neural Profile', icon: Brain, view: 'neural-profile' as ViewId },
          { label: 'Safi History', icon: MessageSquare, view: 'safi-history' as ViewId },
          { label: 'Settings', icon: Settings, view: 'settings' as ViewId },
        ].map(link => (
          <button
            key={link.label}
            onClick={() => onNavigate(link.view)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-3">
              <link.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{link.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Theme */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border-subtle">
        <span className="text-sm text-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
});

ProfileView.displayName = 'ProfileView';
export default ProfileView;
