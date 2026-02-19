import { memo } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Home, BarChart3, MapPin, Clock, Target, Car, Mountain,
  Phone, Briefcase, Users, Bell, Settings, Crown, Shield, User, X,
  TrafficCone, Lightbulb, Plane, Landmark
} from 'lucide-react';
import type { ViewId } from './GridifyDashboard';

interface GridifySidebarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  onUpgrade: () => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const menuItems: { id: ViewId; label: string; icon: typeof Home; elite?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'safety-overview', label: 'Safety Overview', icon: BarChart3 },
  { id: 'areas', label: 'Areas & Zones', icon: MapPin },
  { id: 'time-analytics', label: 'Time Analytics', icon: Clock },
  { id: 'activities', label: 'Safe Activities', icon: Target },
  { id: 'rideshare', label: 'Ride Share Zones', icon: Car },
  { id: 'trails', label: 'Trail Safety', icon: Mountain },
  { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
  { id: 'pro-tools', label: 'Professional Tools', icon: Briefcase, elite: true },
  { id: 'community', label: 'Community Intel', icon: Users },
  { id: 'alerts', label: 'Alerts & Notifications', icon: Bell, elite: true },
  { id: 'traffic', label: 'Traffic & Transport', icon: TrafficCone },
  { id: 'utilities', label: 'Utilities & Services', icon: Lightbulb },
  { id: 'airport', label: 'Airport Info', icon: Plane },
  { id: 'government', label: 'Government Services', icon: Landmark },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const GridifySidebar = memo(({ activeView, onNavigate, onUpgrade, isOpen, onToggle, isMobile }: GridifySidebarProps) => {
  return (
    <aside className={cn(
      "flex flex-col bg-card border-r border-border h-full shrink-0",
      "transition-transform duration-200 ease-out",
      isMobile
        ? "fixed left-0 top-0 z-50 w-[280px] shadow-2xl"
        : "w-[280px]",
      isMobile && !isOpen && "-translate-x-full"
    )}>
      {/* Logo */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-foreground leading-none">GRIDIFY</h1>
            <p className="text-[11px] text-muted-foreground font-medium leading-none mt-0.5">Safety Intelligence</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-secondary">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.elite && (
                  <span className={cn(
                    "ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-elite-gradient text-white"
                  )}>
                    👑
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <div className="p-3 space-y-3 border-t border-border">
        {/* Upgrade CTA */}
        <button
          onClick={onUpgrade}
          className="w-full p-4 rounded-xl bg-elite-gradient text-white text-left hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5" />
            <span className="text-sm font-bold">UPGRADE TO ELITE</span>
          </div>
          <p className="text-xs text-white/80">Real-time alerts, unlimited access</p>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">Guest User</div>
            <div className="text-[11px] text-muted-foreground">Free Plan</div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
});

GridifySidebar.displayName = 'GridifySidebar';
export default GridifySidebar;
