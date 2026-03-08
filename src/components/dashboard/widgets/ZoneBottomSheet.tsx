import { memo } from 'react';
import { cn } from '@/lib/utils';
import { X, Shield, MapPin, Clock, Navigation, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ViewId } from '../GridifyDashboard';

export interface ZoneData {
  id: string;
  name: string;
  precinct: string;
  riskLevel: 'low' | 'elevated' | 'high' | 'critical';
  topCrimes: { type: string; icon: string; count: number }[];
  peakWindow: string;
}

interface Props {
  zone: ZoneData | null;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
  onSaveZone?: (zone: ZoneData) => void;
}

const riskPill: Record<string, { label: string; cls: string }> = {
  low: { label: 'LOW', cls: 'bg-safety-green/15 text-safety-green' },
  elevated: { label: 'ELEVATED', cls: 'bg-safety-yellow/15 text-safety-yellow' },
  high: { label: 'HIGH', cls: 'bg-safety-orange/15 text-safety-orange' },
  critical: { label: 'CRITICAL', cls: 'bg-safety-red/15 text-safety-red' },
};

const ZoneBottomSheet = memo(({ zone, onClose, onNavigate, onSaveZone }: Props) => {
  if (!zone) return null;
  const pill = riskPill[zone.riskLevel];

  return (
    <div className="animate-fade-in p-4 space-y-3 border-t border-border bg-card rounded-t-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">{zone.name}</h3>
          <p className="text-[10px] text-muted-foreground">{zone.precinct}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase", pill.cls)}>
            {pill.label}
          </span>
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Top 3 crimes */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Top crimes (7 days)</p>
        {zone.topCrimes.map(c => (
          <div key={c.type} className="flex items-center gap-2">
            <span className="text-xs">{c.icon}</span>
            <span className="text-xs text-foreground flex-1">{c.type}</span>
            <span className="text-xs font-bold text-foreground tabular-nums">{c.count}</span>
          </div>
        ))}
      </div>

      {/* Peak risk window */}
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Most active: <strong className="text-foreground">{zone.peakWindow}</strong></span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs"
          onClick={() => onSaveZone?.(zone)}
        >
          <Bookmark className="w-3.5 h-3.5 mr-1" /> Set as My Area
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onNavigate('safe-route')}
        >
          <Navigation className="w-3.5 h-3.5 mr-1" /> Safe Route Here
        </Button>
      </div>
    </div>
  );
});

ZoneBottomSheet.displayName = 'ZoneBottomSheet';
export default ZoneBottomSheet;
