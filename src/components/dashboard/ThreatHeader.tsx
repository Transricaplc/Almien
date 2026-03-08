import { memo } from 'react';
import { cn } from '@/lib/utils';

type ThreatLevel = 'low' | 'elevated' | 'high' | 'critical';

interface ThreatHeaderProps {
  suburb?: string;
  threatLevel?: ThreatLevel;
  incidentCount?: number;
}

const levelConfig: Record<ThreatLevel, { label: string; color: string; bg: string; pulse?: boolean }> = {
  low: { label: 'LOW', color: 'bg-safety-green text-primary-foreground', bg: 'bg-[hsl(var(--threat-low))]' },
  elevated: { label: 'ELEVATED', color: 'bg-safety-yellow text-primary-foreground', bg: 'bg-[hsl(var(--threat-elevated))]' },
  high: { label: 'HIGH', color: 'bg-safety-red text-destructive-foreground', bg: 'bg-[hsl(var(--threat-high))]' },
  critical: { label: 'CRITICAL', color: 'bg-safety-red text-destructive-foreground', bg: 'bg-[hsl(var(--threat-critical))]', pulse: true },
};

const ThreatHeader = memo(({
  suburb = 'Sea Point',
  threatLevel = 'elevated',
  incidentCount = 7,
}: ThreatHeaderProps) => {
  const config = levelConfig[threatLevel];

  return (
    <div className={cn(
      "h-10 shrink-0 flex items-center justify-between px-4 border-b border-border z-50",
      config.bg
    )}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-bold text-foreground truncate">{suburb}</span>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
          config.color,
          config.pulse && "animate-pulse"
        )}>
          {config.label}
        </span>
      </div>
      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
        <span className="font-bold text-foreground">{incidentCount}</span> incidents nearby
      </span>
    </div>
  );
});

ThreatHeader.displayName = 'ThreatHeader';
export default ThreatHeader;
