import { memo, useState } from 'react';
import { Search, Navigation, AlertTriangle, Heart, MapPin, Shield, Phone, Zap } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import type { ViewId } from './GridifyDashboard';

interface CommandPillProps {
  onNavigate: (view: ViewId) => void;
}

const quickActions = [
  { label: 'Safe Route', icon: Navigation, view: 'safe-route' as ViewId, color: 'text-accent-safe' },
  { label: 'Report Incident', icon: AlertTriangle, view: 'community' as ViewId, color: 'text-accent-warning' },
  { label: 'Emergency Contacts', icon: Phone, view: 'emergency' as ViewId, color: 'text-accent-threat' },
  { label: 'Safe Space (GBV)', icon: Heart, view: 'safe-space' as ViewId, color: 'text-accent-gbv' },
  { label: 'Full Map', icon: MapPin, view: 'map-full' as ViewId, color: 'text-accent-info' },
  { label: 'Safety Overview', icon: Shield, view: 'safety-overview' as ViewId, color: 'text-primary' },
  { label: 'Utilities & Services', icon: Zap, view: 'utilities' as ViewId, color: 'text-accent-warning' },
];

const CommandPill = memo(({ onNavigate }: CommandPillProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = quickActions.filter((a) =>
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (view: ViewId) => {
    setOpen(false);
    setSearch('');
    onNavigate(view);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className={cn(
            'fixed bottom-24 left-1/2 -translate-x-1/2 z-[85]',
            'flex items-center gap-2 px-5 py-2.5 rounded-full',
            'bg-card/90 backdrop-blur-xl border border-border-subtle',
            'text-sm font-semibold text-muted-foreground',
            'active:scale-[0.96] transition-all duration-150',
            'shadow-[0_4px_24px_hsl(var(--surface-base)/0.6)]'
          )}
        >
          <Search className="w-4 h-4" />
          Quick Actions
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] bg-card border-border-subtle">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-border-subtle mt-3 mb-4" />
        <div className="px-4 pb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search actions, views…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border-subtle text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            {filtered.map((action) => (
              <button
                key={action.label}
                onClick={() => handleSelect(action.view)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary active:scale-[0.98] transition-all text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <action.icon className={cn('w-4 h-4', action.color)} />
                </div>
                <span className="text-sm font-semibold text-foreground">{action.label}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No actions found
              </p>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
});

CommandPill.displayName = 'CommandPill';
export default CommandPill;
