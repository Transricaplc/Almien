import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Shield, Phone, Building2, Flame, X, Target, Clock, Radio, CheckCircle2, Navigation } from 'lucide-react';
import SafetyScoreBadge from '../SafetyScoreBadge';
import { type AreaSafetyData } from '@/data/capeTownSafetyData';
import { type SuburbIntelligence } from '@/hooks/useSuburbIntelligence';
import { openDirectionsTo } from '@/utils/locationUtils';
import SuburbSearchInput from '../SuburbSearchInput';

const getSuburbSafetyLevel = (score: number) => {
  if (score >= 75) return 'green';
  if (score >= 55) return 'yellow';
  if (score >= 35) return 'orange';
  return 'red';
};

const levelColors: Record<string, string> = {
  green: 'text-safety-green',
  yellow: 'text-safety-yellow',
  orange: 'text-safety-orange',
  red: 'text-safety-red',
};

interface Props {
  /** 'inline' = search + results inside a container, 'popover' = minimal display for map overlay */
  variant?: 'inline' | 'popover';
  /** Pre-fill search for a specific suburb */
  initialQuery?: string;
  className?: string;
}

const AreaIntelCard = memo(({ variant = 'inline', initialQuery = '', className }: Props) => {
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbIntelligence | null>(null);
  const [selectedArea, setSelectedArea] = useState<AreaSafetyData | null>(null);

  // Suburb detail
  if (selectedSuburb) {
    const level = getSuburbSafetyLevel(selectedSuburb.safety_score);
    return (
      <div className={cn("rounded-xl border border-border bg-card p-4 space-y-3 animate-fade-in", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafetyScoreBadge score={selectedSuburb.safety_score / 10} size="sm" />
            <div>
              <h4 className="text-sm font-bold text-foreground">{selectedSuburb.suburb_name}</h4>
              <p className="text-[10px] text-muted-foreground">Ward {selectedSuburb.ward_id} · {selectedSuburb.area_code}</p>
            </div>
          </div>
          <button onClick={() => setSelectedSuburb(null)} className="p-1 rounded hover:bg-secondary">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-secondary text-center">
            <div className="text-lg font-bold text-foreground">{selectedSuburb.safety_score}</div>
            <div className="text-[9px] text-muted-foreground">Safety</div>
          </div>
          <div className="p-2 rounded-lg bg-secondary text-center">
            <div className="text-lg font-bold text-foreground">{selectedSuburb.incidents_24h}</div>
            <div className="text-[9px] text-muted-foreground">24h Inc.</div>
          </div>
          <div className="p-2 rounded-lg bg-secondary text-center">
            <div className="text-lg font-bold text-foreground">{selectedSuburb.cctv_coverage}%</div>
            <div className="text-[9px] text-muted-foreground">CCTV</div>
          </div>
        </div>

        {selectedSuburb.risk_type && (
          <div className="flex items-center gap-1.5 text-[10px] text-safety-orange font-medium">
            <Radio className="w-3 h-3" />
            Primary risk: <span className="capitalize">{selectedSuburb.risk_type.replace('_', ' ')}</span>
          </div>
        )}

        {/* SAPS + Hospital with Navigate buttons */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-foreground">
            <Shield className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="truncate">{selectedSuburb.saps_station}</span>
            <button
              onClick={() => openDirectionsTo(selectedSuburb.saps_station)}
              className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-accent-safe/10 hover:bg-accent-safe/20 text-accent-safe border border-accent-safe/20 text-[9px] font-bold transition-colors"
              title={`Navigate to ${selectedSuburb.saps_station}`}
            >
              <Navigation className="w-2.5 h-2.5" />NAVIGATE
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-foreground">
            <Building2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{selectedSuburb.hospital_name}</span>
            <button
              onClick={() => openDirectionsTo(selectedSuburb.hospital_name)}
              className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold transition-colors"
              title={`Navigate to ${selectedSuburb.hospital_name}`}
            >
              <Navigation className="w-2.5 h-2.5" />NAVIGATE
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <a href={`tel:${selectedSuburb.saps_contact.replace(/[^0-9+]/g, '')}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity min-h-[44px]">
            <Phone className="w-3.5 h-3.5" /> SAPS
          </a>
          <a href={`tel:${selectedSuburb.hospital_contact.replace(/[^0-9+]/g, '')}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-bold hover:opacity-90 transition-opacity min-h-[44px]">
            <Phone className="w-3.5 h-3.5" /> Medical
          </a>
          <a href={`tel:${selectedSuburb.fire_contact.replace(/[^0-9+]/g, '')}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-safety-orange text-white text-xs font-bold hover:opacity-90 transition-opacity min-h-[44px]">
            <Flame className="w-3.5 h-3.5" /> Fire
          </a>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
          <CheckCircle2 className="w-3 h-3 text-safety-green" />
          Verified · SAPS Directory / WC Gov Health
        </div>
      </div>
    );
  }

  // Area detail (static data)
  if (selectedArea) {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-4 space-y-3 animate-fade-in", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafetyScoreBadge score={selectedArea.safetyScore} size="sm" />
            <div>
              <h4 className="text-sm font-bold text-foreground">{selectedArea.name}</h4>
              <p className="text-[10px] text-muted-foreground capitalize">{selectedArea.safetyLevel} risk zone</p>
            </div>
          </div>
          <button onClick={() => setSelectedArea(null)} className="p-1 rounded hover:bg-secondary">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Time-based safety mini grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {(['morning', 'day', 'evening', 'night'] as const).map(t => {
            const data = selectedArea.timeBasedSafety[t];
            const icons = { morning: '🌅', day: '☀️', evening: '🌆', night: '🌙' };
            return (
              <div key={t} className="p-2 rounded-lg bg-secondary text-center">
                <span className="text-xs">{icons[t]}</span>
                <div className="text-sm font-bold text-foreground">{data.score}</div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{selectedArea.incidentCount.last7Days} / 7d</span>
          <span className="flex items-center gap-1"><Target className="w-3 h-3" />{selectedArea.recommendedActivities.length} activities</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Safest: AM</span>
        </div>

        {selectedArea.safetyTips.slice(0, 2).map((tip, i) => (
          <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
            <span className="text-primary mt-0.5">•</span>{tip}
          </p>
        ))}
      </div>
    );
  }

  // Search state — uses unified SuburbSearchInput
  return (
    <div className={cn('space-y-2', className)}>
      <SuburbSearchInput
        placeholder="Search suburb, ward, or area code..."
        initialValue={initialQuery}
        onSelect={r => {
          if (r.suburbData) {
            // Build a SuburbIntelligence-like object for downstream display
            setSelectedSuburb({
              id: r.suburbData.id,
              suburb_name: r.suburbData.suburb_name,
              area_code: r.suburbData.area_code,
              ward_id: r.suburbData.ward_id,
              safety_score: r.suburbData.safety_score,
              cctv_coverage: r.suburbData.cctv_coverage,
              incidents_24h: r.suburbData.incidents_24h,
              saps_station: r.suburbData.saps_station,
              saps_contact: r.suburbData.saps_contact,
              fire_station: r.suburbData.fire_station,
              fire_contact: r.suburbData.fire_contact,
              hospital_name: r.suburbData.hospital_name,
              hospital_contact: r.suburbData.hospital_contact,
              risk_type: r.suburbData.risk_type ?? null,
            });
          } else if (r.areaData) {
            setSelectedArea(r.areaData);
          }
        }}
      />
    </div>
  );
});

AreaIntelCard.displayName = 'AreaIntelCard';
export default AreaIntelCard;
