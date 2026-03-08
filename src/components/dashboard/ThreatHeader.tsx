import { memo, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, MapPin, Plus } from 'lucide-react';

type ThreatLevel = 'low' | 'elevated' | 'high' | 'critical';

interface SavedZone {
  id: string;
  name: string;
  threatLevel: ThreatLevel;
  label?: string; // e.g. "Home", "Work"
}

interface ThreatHeaderProps {
  suburb?: string;
  threatLevel?: ThreatLevel;
  incidentCount?: number;
  onBrowseAllAreas?: () => void;
}

const levelConfig: Record<ThreatLevel, { label: string; color: string; bg: string; pulse?: boolean }> = {
  low: { label: 'LOW', color: 'bg-safety-green text-primary-foreground', bg: 'bg-[hsl(var(--threat-low))]' },
  elevated: { label: 'ELEVATED', color: 'bg-safety-yellow text-primary-foreground', bg: 'bg-[hsl(var(--threat-elevated))]' },
  high: { label: 'HIGH', color: 'bg-safety-red text-destructive-foreground', bg: 'bg-[hsl(var(--threat-high))]' },
  critical: { label: 'CRITICAL', color: 'bg-safety-red text-destructive-foreground', bg: 'bg-[hsl(var(--threat-critical))]', pulse: true },
};

const pillCls: Record<ThreatLevel, string> = {
  low: 'bg-safety-green/15 text-safety-green',
  elevated: 'bg-safety-yellow/15 text-safety-yellow',
  high: 'bg-safety-orange/15 text-safety-orange',
  critical: 'bg-safety-red/15 text-safety-red',
};

// Mock saved zones
const defaultSavedZones: SavedZone[] = [
  { id: '1', name: 'Sea Point', threatLevel: 'elevated', label: 'Home' },
  { id: '2', name: 'Cape Town CBD', threatLevel: 'high', label: 'Work' },
  { id: '3', name: 'Camps Bay', threatLevel: 'low' },
];

const ThreatHeader = memo(({
  suburb = 'Sea Point',
  threatLevel = 'elevated',
  incidentCount = 7,
  onBrowseAllAreas,
}: ThreatHeaderProps) => {
  const config = levelConfig[threatLevel];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeZone, setActiveZone] = useState(suburb);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleZoneSelect = (zone: SavedZone) => {
    setActiveZone(zone.name);
    setDropdownOpen(false);
  };

  return (
    <div className={cn(
      "h-10 shrink-0 flex items-center justify-between px-4 border-b border-border z-50 relative",
      config.bg
    )}>
      {/* Left — tappable suburb switcher */}
      <div className="flex items-center gap-2 min-w-0 relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 min-w-0 hover:opacity-80 transition-opacity"
        >
          <span className="text-sm font-bold text-foreground truncate">{activeZone}</span>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0",
            dropdownOpen && "rotate-180"
          )} />
        </button>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
          config.color,
          config.pulse && "animate-pulse"
        )}>
          {config.label}
        </span>

        {/* Inline dropdown — not a modal */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-lg z-50 animate-fade-in overflow-hidden">
            <div className="p-1.5 space-y-0.5">
              {defaultSavedZones.map(z => {
                const isActive = z.name === activeZone;
                const pl = pillCls[z.threatLevel];
                return (
                  <button
                    key={z.id}
                    onClick={() => handleZoneSelect(z)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive ? "bg-primary/10" : "hover:bg-secondary"
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{z.name}</p>
                      {z.label && <p className="text-[9px] text-muted-foreground">{z.label}</p>}
                    </div>
                    <span className={cn("px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase shrink-0", pl)}>
                      {levelConfig[z.threatLevel].label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-border p-1.5">
              <button
                onClick={() => { setDropdownOpen(false); onBrowseAllAreas?.(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-secondary transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-medium text-primary">Browse All Areas</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
        <span className="font-bold text-foreground">{incidentCount}</span> incidents nearby
      </span>
    </div>
  );
});

ThreatHeader.displayName = 'ThreatHeader';
export default ThreatHeader;
