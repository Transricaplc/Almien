import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Home, Map, Navigation, Users, ShieldHalf, User } from 'lucide-react';
import type { ViewId } from './GridifyDashboard';

interface BottomNavBarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

const tabs: { id: ViewId; label: string; icon: typeof Map }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'map-full', label: 'Map', icon: Map },
  { id: 'safe-route', label: 'Routes', icon: Navigation },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'safe-space', label: 'Safe Space', icon: ShieldHalf },
];

const BottomNavBar = memo(({ activeView, onNavigate }: BottomNavBarProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[90] border-t border-border safe-area-bottom"
      style={{ backgroundColor: 'hsl(213 30% 3%)' }}>
      <div className="flex items-stretch justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          const isSafeSpace = tab.id === 'safe-space';
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 min-w-[48px] min-h-[48px] transition-colors',
                isActive
                  ? isSafeSpace
                    ? 'text-[hsl(270,95%,75%)]'
                    : 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNavBar.displayName = 'BottomNavBar';
export default BottomNavBar;
