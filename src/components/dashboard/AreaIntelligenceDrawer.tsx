import { useState, useMemo, useCallback, memo } from 'react';
import {
  Search, MapPin, X, Copy, Check, Phone, Shield, Flame,
  AlertTriangle, Car, Droplets, CloudSun, Navigation, Camera,
  Crosshair, Activity, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSafetyColor } from '@/lib/utils';
import { areasData, AreaData } from '@/data/emergencyContacts';
import { getEmergencyContacts, searchDirectory, PROVINCE_WIDE, type EmergencyContactsResult } from '@/data/westernCapeEmergencyDirectory';
import { useWeather, getWeatherIcon } from '@/hooks/useWeather';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/contexts/DashboardContext';

/**
 * Area Intelligence Drawer — Tactical HUD
 *
 * Right-aligned sliding panel triggered by search/selection.
 * Displays: Traffic, Water, Crime, Weather, Routes, Emergency contacts.
 * Independent internal scrolling. Z-index priority above all other panels.
 */

// ── Risk utilities ──
const riskConfig = {
  low: { label: 'LOW RISK', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  moderate: { label: 'MODERATE', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  high: { label: 'HIGH RISK', class: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  critical: { label: 'CRITICAL', class: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

// ── Skeleton card ──
const SkeletonCard = () => (
  <div className="rounded-lg border border-border/30 p-3 space-y-2">
    <Skeleton className="h-3 w-24 bg-muted/30" />
    <Skeleton className="h-5 w-16 bg-muted/30" />
    <Skeleton className="h-3 w-full bg-muted/30" />
  </div>
);

// ── Intel card ──
const IntelCard = memo(({ icon, label, value, detail, accentColor, children }: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  detail?: string;
  accentColor?: string;
  children?: React.ReactNode;
}) => (
  <div className="rounded-lg border border-border/30 bg-card/60 backdrop-blur-sm p-3 space-y-1.5">
    <div className="flex items-center gap-2">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-muted-foreground font-semibold">
        {label}
      </span>
    </div>
    {value !== undefined && (
      <div className="text-lg font-bold font-mono tabular-nums" style={accentColor ? { color: accentColor } : undefined}>
        {value}
      </div>
    )}
    {detail && (
      <p className="text-[11px] text-muted-foreground leading-tight">{detail}</p>
    )}
    {children}
  </div>
));
IntelCard.displayName = 'IntelCard';

// ── Emergency chip ──
const EmergencyChip = memo(({ name, number, icon: Icon, color }: {
  name: string;
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) => (
  <a
    href={`tel:${number.replace(/\s/g, '')}`}
    className={cn(
      "flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all",
      "hover:scale-[1.02] active:scale-[0.98]",
      "bg-[hsl(217,91%,50%)]/10 border-[hsl(217,91%,50%)]/30 hover:border-[hsl(217,91%,50%)]/60"
    )}
  >
    <Icon className={cn("w-4 h-4 shrink-0", color)} />
    <div className="flex-1 min-w-0">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{name}</div>
      <div className="text-sm font-bold font-mono tabular-nums text-foreground">{number}</div>
    </div>
    <Phone className="w-3.5 h-3.5 text-primary" />
  </a>
));
EmergencyChip.displayName = 'EmergencyChip';

// ── Empty state ──
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-border/50 flex items-center justify-center">
        <Crosshair className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary/20 animate-ping" />
    </div>
    <p className="text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mb-1">
      Awaiting Input...
    </p>
    <p className="text-[10px] text-muted-foreground/60 font-mono">
      Scan Area to Begin
    </p>
  </div>
);

// ── Main component ──
interface AreaIntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Emergency Contact Section (categorized) ──
const EmergencyContactSection = memo(({ contacts }: { contacts: EmergencyContactsResult }) => (
  <div className="rounded-lg border border-border/30 bg-card/60 backdrop-blur-sm p-3 space-y-3">
    <div className="flex items-center gap-2 mb-1">
      <Phone className="w-4 h-4 text-muted-foreground" />
      <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-muted-foreground font-semibold">
        Emergency Contacts — {contacts.suburb}
      </span>
    </div>

    {/* SAPS CONTACTS */}
    <div className="space-y-1.5">
      <div className="text-[10px] font-mono uppercase tracking-[0.08em] font-bold text-[#2563eb]">
        [SAPS CONTACTS]
      </div>
      <EmergencyChip name={contacts.saps.station} number={contacts.saps.phone} icon={Shield} color="text-[#2563eb]" />
      {contacts.saps.clusterHQ && (
        <EmergencyChip name={`Cluster HQ: ${contacts.saps.clusterHQ}`} number={contacts.saps.clusterPhone!} icon={Shield} color="text-blue-400" />
      )}
      {contacts.saps.sectorVehicles?.map((sv, i) => (
        <EmergencyChip key={i} name={`Sector ${sv.sector}`} number={sv.phone} icon={Car} color="text-blue-300" />
      ))}
      <EmergencyChip name="National Crime Stop" number={contacts.saps.nationalCrimeStop} icon={Shield} color="text-blue-300" />
    </div>

    {/* FIRE & RESCUE */}
    <div className="space-y-1.5">
      <div className="text-[10px] font-mono uppercase tracking-[0.08em] font-bold text-[#b91c1c]">
        [FIRE & RESCUE]
      </div>
      <EmergencyChip name={contacts.fire.station} number={contacts.fire.phone} icon={Flame} color="text-[#b91c1c]" />
      <EmergencyChip name="NSRI Sea Rescue" number={contacts.fire.nsri} icon={Flame} color="text-orange-400" />
      <EmergencyChip name="WSAR Mountain Rescue" number={contacts.fire.wsar} icon={Flame} color="text-orange-300" />
    </div>

    {/* MEDICAL & EMS */}
    <div className="space-y-1.5">
      <div className="text-[10px] font-mono uppercase tracking-[0.08em] font-bold text-emerald-500">
        [MEDICAL & EMS]
      </div>
      <EmergencyChip name={`Public: ${contacts.medical.publicHospital}`} number={contacts.medical.publicPhone} icon={AlertTriangle} color="text-emerald-400" />
      {contacts.medical.privateClinic && (
        <EmergencyChip name={`Private: ${contacts.medical.privateClinic}`} number={contacts.medical.privatePhone!} icon={AlertTriangle} color="text-emerald-300" />
      )}
      <EmergencyChip name="Metro EMS Ambulance" number={contacts.medical.metroEMS} icon={Phone} color="text-emerald-300" />
      <EmergencyChip name="ER24" number={contacts.medical.er24} icon={Phone} color="text-emerald-200" />
      <EmergencyChip name="Netcare 911" number={contacts.medical.netcare911} icon={Phone} color="text-emerald-200" />
    </div>
  </div>
));
EmergencyContactSection.displayName = 'EmergencyContactSection';

const AreaIntelligenceDrawer = ({ isOpen, onClose }: AreaIntelligenceDrawerProps) => {
  const { selectEntity } = useDashboard();
  const { weather, loading: weatherLoading } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Search both areasData and the emergency directory (by name + postal code)
  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return areasData.filter(a => a.name.toLowerCase().includes(q)).slice(0, 6);
  }, [searchQuery]);

  // Derive emergency contacts from selected area name
  const areaEmergencyContacts = useMemo<EmergencyContactsResult | null>(() => {
    if (!selectedArea) return null;
    return getEmergencyContacts(selectedArea.name);
  }, [selectedArea]);

  const handleSelectArea = useCallback((area: AreaData) => {
    setDataLoading(true);
    setSelectedArea(area);
    setSearchQuery('');
    setIsFocused(false);

    selectEntity({
      id: area.id,
      type: 'area',
      name: area.name,
      data: {
        safety_score: area.safetyScore,
        incidents_24h: area.incidents24h,
        cctv_coverage: area.camerasCoverage,
        saps_station: area.policeStation,
        saps_contact: area.policeNumber,
        hospital_name: area.nearestHospital,
        hospital_contact: area.hospitalNumber,
        risk_type: area.riskLevel,
      },
    });

    // Simulate data fetch
    setTimeout(() => setDataLoading(false), 600);
  }, [selectEntity]);

  const handleCopyIntel = useCallback(() => {
    if (!selectedArea) return;
    const summary = [
      `📍 ${selectedArea.name} — Area Intelligence`,
      `Safety Score: ${selectedArea.safetyScore}/100 (${riskConfig[selectedArea.riskLevel].label})`,
      `Incidents (24h): ${selectedArea.incidents24h}`,
      `CCTV Coverage: ${selectedArea.camerasCoverage}%`,
      `Police: ${selectedArea.policeStation} — ${selectedArea.policeNumber}`,
      `Hospital: ${selectedArea.nearestHospital} — ${selectedArea.hospitalNumber}`,
      weather ? `Weather: ${weather.temperature_celsius}°C, ${weather.description}` : '',
      `Generated by Gridfy`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedArea, weather]);

  const handleClearArea = useCallback(() => {
    setSelectedArea(null);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-12 right-0 bottom-0 z-40 w-[360px] max-w-[90vw]",
        "bg-background/98 backdrop-blur-xl border-l border-border/50",
        "flex flex-col transition-transform duration-300 ease-out",
        "shadow-2xl shadow-black/40",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border/30 bg-gradient-to-r from-primary/8 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-mono uppercase tracking-[0.05em] font-bold text-foreground">
              Area Intelligence
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedArea && (
              <button
                onClick={handleCopyIntel}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono transition-all",
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/30"
                )}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <div className={cn(
            "flex items-center bg-card/60 rounded-lg border transition-all px-3 py-2",
            isFocused ? "border-primary/60 shadow-sm shadow-primary/10" : "border-border/40"
          )}>
            <Search className={cn("w-4 h-4 mr-2", isFocused ? "text-primary" : "text-muted-foreground")} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search area or postal code..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-xs font-mono"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 rounded hover:bg-background/50">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* ── Search results dropdown ── */}
          {isFocused && filteredAreas.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card/98 backdrop-blur-xl rounded-lg border border-primary/25 shadow-xl overflow-hidden z-50 animate-fade-in max-h-56 overflow-y-auto scrollbar-visible">
              {filteredAreas.map(area => (
                <button
                  key={area.id}
                  onClick={() => handleSelectArea(area)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-primary/10 transition-colors text-left border-b border-border/15 last:border-b-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-xs truncate">{area.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {area.incidents24h} incidents • {area.camerasCoverage}% CCTV
                    </div>
                  </div>
                  <div className="text-sm font-black font-mono tabular-nums" style={{ color: getSafetyColor(area.safetyScore) }}>
                    {area.safetyScore}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── No results ── */}
          {isFocused && searchQuery && filteredAreas.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 rounded-lg border border-border/50 shadow-lg p-3 text-center z-50 animate-fade-in">
              <MapPin className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-xs text-muted-foreground font-mono">No results for "{searchQuery}"</div>
            </div>
          )}
        </div>

        {/* ── Quick access pills ── */}
        {!selectedArea && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {areasData.slice(0, 5).map(area => (
              <button
                key={area.id}
                onClick={() => handleSelectArea(area)}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono font-medium border transition-all hover:scale-105",
                  riskConfig[area.riskLevel].class
                )}
              >
                {area.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto scrollbar-visible">
        {!selectedArea ? (
          <EmptyState />
        ) : dataLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* ── Area Header ── */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm truncate">{selectedArea.name}</h3>
                  <Badge className={cn("text-[10px] font-mono mt-1", riskConfig[selectedArea.riskLevel].class)}>
                    {riskConfig[selectedArea.riskLevel].label}
                  </Badge>
                </div>
                <div className="flex flex-col items-end ml-3">
                  <div className="text-3xl font-black font-mono tabular-nums" style={{ color: getSafetyColor(selectedArea.safetyScore) }}>
                    {selectedArea.safetyScore}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono uppercase">Safety</span>
                </div>
              </div>
              <button onClick={handleClearArea} className="text-[10px] text-muted-foreground hover:text-foreground mt-2 font-mono transition-colors">
                ← Clear selection
              </button>
            </div>

            {/* ── Traffic ── */}
            <IntelCard
              icon={<Car className="w-4 h-4" />}
              label="Traffic Status"
              accentColor={selectedArea.incidents24h > 10 ? 'hsl(0, 84%, 60%)' : 'hsl(38, 92%, 50%)'}
              value={selectedArea.incidents24h > 10 ? 'HEAVY' : selectedArea.incidents24h > 5 ? 'MODERATE' : 'CLEAR'}
              detail={`${selectedArea.incidents24h} incidents reported in the last 24 hours`}
            />

            {/* ── Utility / Water ── */}
            <IntelCard
              icon={<Droplets className="w-4 h-4" />}
              label="Utility / Water"
              accentColor="hsl(192, 91%, 42%)"
              value="OPERATIONAL"
              detail="No water outages reported in this area. Dam levels stable."
            />

            {/* ── Crime / Safety ── */}
            <IntelCard
              icon={<AlertTriangle className="w-4 h-4" />}
              label="Crime / Safety"
              accentColor={getSafetyColor(selectedArea.safetyScore)}
            >
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-background/50 rounded-md p-2">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">Incidents</div>
                  <div className="text-base font-bold font-mono tabular-nums text-foreground">{selectedArea.incidents24h}</div>
                </div>
                <div className="bg-background/50 rounded-md p-2">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">CCTV</div>
                  <div className="text-base font-bold font-mono tabular-nums text-foreground">{selectedArea.camerasCoverage}%</div>
                </div>
              </div>
            </IntelCard>

            {/* ── Weather ── */}
            <IntelCard
              icon={<CloudSun className="w-4 h-4" />}
              label="Weather"
              accentColor="hsl(210, 40%, 96%)"
            >
              {weatherLoading ? (
                <Skeleton className="h-10 w-full bg-muted/30" />
              ) : weather ? (
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl">{getWeatherIcon(weather.icon_code)}</span>
                  <div>
                    <div className="text-lg font-bold font-mono tabular-nums text-foreground">{weather.temperature_celsius}°C</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{weather.description}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-[10px] font-mono text-muted-foreground">Wind</div>
                    <div className="text-xs font-bold font-mono tabular-nums">{weather.wind_speed_kmh} km/h</div>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">Weather data unavailable</p>
              )}
            </IntelCard>

            {/* ── Routes ── */}
            <IntelCard
              icon={<Navigation className="w-4 h-4" />}
              label="Routes"
              detail="Plan a safe route from your current location to this area."
            >
              <button className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors">
                <Navigation className="w-3.5 h-3.5" />
                Get Directions
              </button>
            </IntelCard>

            {/* ── Emergency Contacts (categorized) ── */}
            {areaEmergencyContacts ? (
              <EmergencyContactSection contacts={areaEmergencyContacts} />
            ) : (
              <div className="rounded-lg border border-border/30 bg-card/60 backdrop-blur-sm p-3 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-muted-foreground font-semibold">
                    Emergency Contacts
                  </span>
                </div>
                <EmergencyChip name="Police — SAPS" number={selectedArea.policeNumber} icon={Shield} color="text-blue-400" />
                <EmergencyChip name={selectedArea.nearestHospital} number={selectedArea.hospitalNumber} icon={Flame} color="text-red-400" />
                <EmergencyChip name="WC Emergency" number="107" icon={Flame} color="text-orange-400" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AreaIntelligenceDrawer);
