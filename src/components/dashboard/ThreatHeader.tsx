import { memo, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, MapPin, Plus, Menu, Locate } from 'lucide-react';
import { useUserLocation } from '@/hooks/useUserLocation';

type ThreatLevel = 'low' | 'elevated' | 'high' | 'critical';

interface SavedZone {
  id: string;
  name: string;
  threatLevel: ThreatLevel;
  label?: string;
}

interface ThreatHeaderProps {
  suburb?: string;
  threatLevel?: ThreatLevel;
  incidentCount?: number;
  onBrowseAllAreas?: () => void;
  onMenuOpen?: () => void;
  onSafiEmergency?: () => void;
}

const levelConfig: Record<ThreatLevel, { label: string; pillBg: string; pillText: string; headerBg: string; barColor: string; pulse?: boolean }> = {
  low: {
    label: 'LOW',
    pillBg: 'bg-accent-safe/15',
    pillText: 'text-accent-safe',
    headerBg: 'bg-surface-base',
    barColor: 'bg-accent-safe',
  },
  elevated: {
    label: 'ELEVATED',
    pillBg: 'bg-accent-warning/15',
    pillText: 'text-accent-warning',
    headerBg: 'bg-surface-base',
    barColor: 'bg-accent-warning',
  },
  high: {
    label: 'HIGH',
    pillBg: 'bg-accent-threat/15',
    pillText: 'text-accent-threat',
    headerBg: 'bg-surface-base',
    barColor: 'bg-accent-threat',
  },
  critical: {
    label: 'CRITICAL',
    pillBg: 'bg-accent-threat/15',
    pillText: 'text-accent-threat',
    headerBg: 'bg-surface-deep',
    barColor: 'bg-accent-threat',
    pulse: true,
  },
};

const defaultSavedZones: SavedZone[] = [
  { id: '1', name: 'Sea Point', threatLevel: 'elevated', label: 'Home' },
  { id: '2', name: 'Cape Town CBD', threatLevel: 'high', label: 'Work' },
  { id: '3', name: 'Camps Bay', threatLevel: 'low' },
];

const ThreatHeader = memo(({
  suburb,
  threatLevel = 'elevated',
  incidentCount = 7,
  onBrowseAllAreas,
  onMenuOpen,
  onSafiEmergency,
}: ThreatHeaderProps) => {
  const userLoc = useUserLocation();
  const detectedSuburb =
    userLoc.nearestArea?.name ?? userLoc.nearestSuburb?.suburb_name ?? suburb ?? 'Sea Point';

  const config = levelConfig[threatLevel];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<string>(detectedSuburb);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync activeZone with detected location once it resolves
  useEffect(() => {
    if (detectedSuburb && activeZone === 'Sea Point' && detectedSuburb !== 'Sea Point') {
      setActiveZone(detectedSuburb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedSuburb]);

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

  const handleUseMyLocation = () => {
    userLoc.refresh();
    setActiveZone(detectedSuburb);
    setDropdownOpen(false);
  };

  return (
    <div className={cn(
      "h-10 shrink-0 flex items-center justify-between px-4 border-b border-border-subtle z-50 relative",
      config.headerBg
    )}>
      {/* Left accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-r", config.barColor, config.pulse && "animate-pulse")} />

      {/* Left — menu button + tappable suburb switcher */}
      <div className="flex items-center gap-2 min-w-0 relative pl-2" ref={dropdownRef}>
        {onMenuOpen && (
          <button
            onClick={onMenuOpen}
            className="p-1.5 -ml-1 rounded-lg hover:bg-secondary min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        )}
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
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-system shrink-0",
          config.pillBg,
          config.pillText,
          config.pulse && "animate-pulse"
        )}>
          {config.label}
        </span>

        {/* Inline dropdown */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-surface-02 border border-border-subtle rounded-xl z-50 animate-fade-in overflow-hidden">
            {/* My Location row */}
            <button
              onClick={handleUseMyLocation}
              className="w-full flex items-center gap-2.5 px-3 py-2 border-b border-border-subtle hover:bg-secondary transition-colors text-left"
            >
              <Locate className="w-3.5 h-3.5 text-accent-safe shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-accent-safe truncate">📍 My Location</p>
                <p className="text-[9px] text-muted-foreground truncate">
                  {userLoc.loading ? 'Detecting…' : userLoc.permissionDenied ? 'Permission denied — using default' : detectedSuburb}
                </p>
              </div>
            </button>
            <div className="p-1.5 space-y-0.5">
              {defaultSavedZones.map(z => {
                const isActive = z.name === activeZone;
                const zConfig = levelConfig[z.threatLevel];
                return (
                  <button
                    key={z.id}
                    onClick={() => handleZoneSelect(z)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive ? "bg-accent-safe/10" : "hover:bg-secondary"
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{z.name}</p>
                      {z.label && <p className="text-[9px] text-muted-foreground">{z.label}</p>}
                    </div>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-system shrink-0",
                      zConfig.pillBg,
                      zConfig.pillText
                    )}>
                      {zConfig.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-border-subtle p-1.5">
              <button
                onClick={() => { setDropdownOpen(false); onBrowseAllAreas?.(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-secondary transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-accent-safe shrink-0" />
                <span className="text-xs font-medium text-accent-safe">Browse All Areas</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right side — Safi emergency pill + incident count */}
      <div className="flex items-center gap-2 shrink-0">
        {onSafiEmergency && (
          <button
            onClick={onSafiEmergency}
            className="md:hidden flex items-center gap-1 px-2 h-7 rounded-full bg-accent-safe/15 hover:bg-accent-safe/25 transition-colors"
            aria-label="Safi emergency"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-safe animate-pulse" />
            <span className="font-neural text-[10px] font-bold text-accent-safe">✦</span>
          </button>
        )}
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          <span className="font-bold text-foreground">{incidentCount}</span> incidents nearby
        </span>
      </div>
    </div>
  );
});

ThreatHeader.displayName = 'ThreatHeader';
export default ThreatHeader;
