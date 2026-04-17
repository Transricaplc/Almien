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
  const [query, setQuery] = useState(initialQuery);
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbIntelligence | null>(null);
  const [selectedArea, setSelectedArea] = useState<AreaSafetyData | null>(null);
  const { suburbs } = useSuburbIntelligence();

  const q = query.trim().toLowerCase();
  const matchedSuburbs = q.length > 0
    ? suburbs.filter(s =>
        s.suburb_name.toLowerCase().includes(q) ||
        s.area_code.toLowerCase().includes(q)
      ).slice(0, 6)
    : [];

  const matchedAreas = q.length > 0 ? searchAreas(query).slice(0, 4) : [];

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

        <div className="flex gap-2">
          <a href={`tel:${selectedSuburb.saps_contact.replace(/[^0-9+]/g, '')}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
            <Shield className="w-3.5 h-3.5" /> SAPS
          </a>
          <a href={`tel:${selectedSuburb.hospital_contact.replace(/[^0-9+]/g, '')}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-bold hover:opacity-90 transition-opacity">
            <Building2 className="w-3.5 h-3.5" /> Medical
          </a>
          <a href={`tel:${selectedSuburb.fire_contact.replace(/[^0-9+]/g, '')}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-safety-orange text-white text-xs font-bold hover:opacity-90 transition-opacity">
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

  // Search state
  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search suburb or area code..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={cn("pl-9 h-9 text-sm", variant === 'popover' && "bg-card/90 backdrop-blur")}
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* DB suburb results */}
      {matchedSuburbs.length > 0 && (
        <div className="space-y-1">
          {matchedSuburbs.map(s => {
            const level = getSuburbSafetyLevel(s.safety_score);
            return (
              <button
                key={s.id}
                onClick={() => { setSelectedSuburb(s); setQuery(''); }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.suburb_name}</p>
                  <p className="text-[10px] text-muted-foreground">Ward {s.ward_id} · {s.incidents_24h} incidents / 24h</p>
                </div>
                <span className={cn("text-sm font-bold tabular-nums", levelColors[level])}>{s.safety_score}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Static area results */}
      {matchedAreas.length > 0 && matchedSuburbs.length === 0 && (
        <div className="space-y-1">
          {matchedAreas.map(a => (
            <button
              key={a.id}
              onClick={() => { setSelectedArea(a); setQuery(''); }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors text-left"
            >
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{a.safetyLevel} · {a.incidentCount.last7Days} / 7d</p>
              </div>
              <SafetyScoreBadge score={a.safetyScore} size="sm" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

AreaIntelCard.displayName = 'AreaIntelCard';
export default AreaIntelCard;
