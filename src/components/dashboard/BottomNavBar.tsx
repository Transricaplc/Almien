import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Home, Map, Navigation, Users, ShieldHalf } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 z-[90] bg-surface-base/80 backdrop-blur-xl border-t border-[hsl(var(--border-subtle)/0.15)] safe-area-bottom">
      <div className="flex items-stretch justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          const isSafeSpace = tab.id === 'safe-space';
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 min-w-[48px] min-h-[48px] transition-all duration-150 active:scale-[0.92]',
                isActive
                  ? isSafeSpace
                    ? 'text-accent-gbv'
                    : 'text-accent-safe'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <tab.icon
                className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-110')}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-semibold leading-none">{tab.label}</span>
              {isActive && (
                <span
                  className={cn(
                    'absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full',
                    isSafeSpace ? 'bg-accent-gbv' : 'bg-accent-safe'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNavBar.displayName = 'BottomNavBar';
export default BottomNavBar;
