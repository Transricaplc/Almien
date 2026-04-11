import { useState, memo } from 'react';
import { cn } from '@/lib/utils';
import { X, Navigation, ShieldOff } from 'lucide-react';
import type { ViewId } from './AlmienDashboard';

interface Props {
  onNavigate?: (view: ViewId) => void;
  onDismiss?: () => void;
}

const GuardianPriorityAlert = memo(({ onNavigate, onDismiss }: Props) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={cn(
      "relative w-full rounded-xl overflow-hidden animate-slide-up",
      "bg-[hsl(var(--threat-critical))] border-l-[6px] border-accent-threat"
    )}>
      {/* Data stream shimmer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent-warning/10 to-transparent animate-data-stream" />
      </div>

      <div className="relative p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-neural text-[10px] font-bold text-accent-warning uppercase tracking-wider animate-pulse">
              ⚠ GUARDIAN ALERT — PRIORITY ONE
            </p>
            <p className="text-sm text-foreground mt-2 leading-relaxed">
              Stage 4 + Night + 4 incidents = Critical risk corridor. Avoid High Level Road.
            </p>
          </div>
          <button
            onClick={() => { setDismissed(true); onDismiss?.(); }}
            className="p-1.5 rounded-lg hover:bg-secondary shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-2 rounded-lg border border-accent-threat/30 text-accent-threat text-xs font-bold flex items-center gap-1.5 min-h-[36px] hover:bg-accent-threat/10 transition-colors">
            <ShieldOff className="w-3.5 h-3.5" /> Avoid Area
          </button>
          <button
            onClick={() => onNavigate?.('safe-route')}
            className="px-3 py-2 rounded-lg bg-accent-safe text-white text-xs font-bold flex items-center gap-1.5 min-h-[36px] hover:opacity-90 transition-opacity"
          >
            <Navigation className="w-3.5 h-3.5" /> Navigate Home
          </button>
        </div>
      </div>
    </div>
  );
});

GuardianPriorityAlert.displayName = 'GuardianPriorityAlert';
export default GuardianPriorityAlert;
