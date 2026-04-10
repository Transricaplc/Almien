import { memo, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Search, ArrowRight, Crown, Lock, Camera, Users, MapPin, Phone, Shield,
  Navigation, X, AlertTriangle, ExternalLink, Siren, Clock, Route
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import SafetyScoreBadge from '../SafetyScoreBadge';
import {
  getEmergencyContacts, searchDirectory, PROVINCE_WIDE,
  type SuburbEmergencyEntry, type EmergencyContactsResult,
} from '@/data/westernCapeEmergencyDirectory';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

// ── Rideshare SOS protocols ──
const RIDESHARE_SOS = [
  { name: 'Uber SA Incident Line', phone: '080 000 8237', color: 'bg-card border-border', icon: Phone },
  { name: 'Bolt Emergency SOS', phone: '080 072 2658', color: 'bg-card border-border', icon: Siren },
  { name: 'SAPS Emergency', phone: '10111', color: 'bg-[#2563eb]/10 border-[#2563eb]/30', icon: Shield },
  { name: 'Metro EMS Ambulance', phone: '10177', color: 'bg-destructive/10 border-destructive/30', icon: AlertTriangle },
];

const zones = [
  {
    name: 'V&A Waterfront Entrance', score: 9.5, level: 'green' as const, status: 'SAFE',
    features: ['High foot traffic', 'CCTV coverage', 'Security presence'],
    times: { morning: 9.5, day: 9.2, evening: 8.8, night: 8.5 },
    incidents: 0,
    tips: ['Well-lit with security presence', 'Multiple ride options available', 'Safe waiting area with seating'],
  },
  {
    name: 'Camps Bay Main Road', score: 8.8, level: 'green' as const, status: 'SAFE',
    features: ['Well-lit', 'Restaurant strip', 'High visibility'],
    times: { morning: 9.0, day: 8.8, evening: 8.5, night: 7.5 },
    incidents: 0,
    tips: ['Popular dining strip with good visibility', 'Use designated pickup points'],
  },
  {
    name: 'Sea Point Promenade', score: 8.5, level: 'green' as const, status: 'SAFE',
    features: ['Well-patrolled', 'Lit pathway', 'Busy area'],
    times: { morning: 9.0, day: 8.8, evening: 7.5, night: 6.5 },
    incidents: 1,
    tips: ['Promenade area is well-patrolled', 'Avoid quieter side streets at night'],
  },
  {
    name: 'Long Street (Upper)', score: 6.2, level: 'orange' as const, status: 'CAUTION',
    features: ['Moderate traffic', 'Nightlife area'],
    times: { morning: 7.5, day: 7.0, evening: 5.5, night: 4.0 },
    incidents: 4,
    alternatives: [
      { name: "Company's Garden", distance: '700m', score: 8.5 },
      { name: 'City Station', distance: '500m', score: 8.8 },
    ],
    tips: ['Exercise caution especially after dark', 'Use well-known pickup spots'],
  },
  {
    name: 'Observatory Lower Main', score: 5.8, level: 'yellow' as const, status: 'CAUTION',
    features: ['Student area', 'Mixed traffic'],
    times: { morning: 7.0, day: 6.5, evening: 5.0, night: 3.5 },
    incidents: 3,
    alternatives: [
      { name: 'Groote Schuur Hospital', distance: '1.2km', score: 8.0 },
    ],
    tips: ['Stay near main road', 'Avoid side streets at night'],
  },
];

// ── Corridor safety summary ──
const CorridorSummary = memo(({
  pickup, destination, onClear,
}: {
  pickup: EmergencyContactsResult;
  destination: EmergencyContactsResult;
  onClear: () => void;
}) => (
  <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 space-y-4 animate-fade-in">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Route className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
          Corridor Intelligence
        </span>
      </div>
      <button onClick={onClear} className="p-1 rounded hover:bg-background/50"><X className="w-4 h-4 text-muted-foreground" /></button>
    </div>

    {/* Route summary */}
    <div className="flex items-center gap-2 text-sm">
      <div className="flex-1 p-2 rounded-lg bg-background/60 border border-border text-center">
        <div className="text-[10px] text-muted-foreground font-mono uppercase">Pickup</div>
        <div className="font-semibold text-foreground truncate">{pickup.suburb}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-primary shrink-0" />
      <div className="flex-1 p-2 rounded-lg bg-background/60 border border-border text-center">
        <div className="text-[10px] text-muted-foreground font-mono uppercase">Destination</div>
        <div className="font-semibold text-foreground truncate">{destination.suburb}</div>
      </div>
    </div>

    {/* SAPS along corridor */}
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#2563eb] mb-1.5">[SAPS ALONG CORRIDOR]</div>
      <div className="space-y-1.5">
        {[pickup, destination].map((c, i) => (
          <a key={i} href={`tel:${c.saps.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2563eb]/30 bg-[#2563eb]/5 hover:bg-[#2563eb]/10 transition-colors">
            <Shield className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">{c.suburb}</div>
              <div className="text-xs font-bold text-foreground">{c.saps.station}</div>
            </div>
            <span className="text-xs font-mono font-bold text-[#2563eb]">{c.saps.phone}</span>
            <Phone className="w-3 h-3 text-[#2563eb]" />
          </a>
        ))}
      </div>
    </div>

    {/* Medical along corridor */}
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-500 mb-1.5">[MEDICAL ALONG CORRIDOR]</div>
      <div className="space-y-1.5">
        {[pickup, destination].map((c, i) => (
          <a key={i} href={`tel:${c.medical.publicPhone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
            <AlertTriangle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">{c.suburb}</div>
              <div className="text-xs font-bold text-foreground">{c.medical.publicHospital}</div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500">{c.medical.publicPhone}</span>
            <Phone className="w-3 h-3 text-emerald-500" />
          </a>
        ))}
      </div>
    </div>
  </div>
));
CorridorSummary.displayName = 'CorridorSummary';

// ── Suburb search input ──
const SuburbSearchInput = memo(({
  label, value, onChange, onSelect, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (entry: SuburbEmergencyEntry) => void;
  placeholder: string;
}) => {
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => searchDirectory(value), [value]);

  return (
    <div className="relative flex-1">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className={cn(
        'flex items-center px-3 py-2 rounded-lg border transition-all bg-card',
        focused ? 'border-primary shadow-sm shadow-primary/10' : 'border-border'
      )}>
        <MapPin className={cn('w-3.5 h-3.5 mr-2 shrink-0', focused ? 'text-primary' : 'text-muted-foreground')} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-sm"
        />
        {value && (
          <button onClick={() => onChange('')} className="p-0.5 rounded hover:bg-background/50">
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-primary/25 shadow-xl overflow-hidden z-50 animate-fade-in max-h-48 overflow-y-auto">
          {results.map(entry => (
            <button
              key={entry.suburb}
              onClick={() => { onSelect(entry); onChange(entry.suburb); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary/10 transition-colors text-left border-b border-border/15 last:border-b-0"
            >
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{entry.suburb}</div>
                <div className="text-[10px] text-muted-foreground font-mono">{entry.postalCode}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
SuburbSearchInput.displayName = 'SuburbSearchInput';

const RideShareView = memo(({ onUpgrade }: Props) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });

  const [pickupQuery, setPickupQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [pickupEntry, setPickupEntry] = useState<SuburbEmergencyEntry | null>(null);
  const [destEntry, setDestEntry] = useState<SuburbEmergencyEntry | null>(null);

  const pickupContacts = useMemo(() => pickupEntry ? getEmergencyContacts(pickupEntry.suburb) : null, [pickupEntry]);
  const destContacts = useMemo(() => destEntry ? getEmergencyContacts(destEntry.suburb) : null, [destEntry]);

  const clearCorridor = useCallback(() => {
    setPickupQuery('');
    setDestQuery('');
    setPickupEntry(null);
    setDestEntry(null);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rideshare Intelligence</h1>
        <p className="text-muted-foreground mt-1">Current Time: {timeStr} {dayStr}</p>
      </div>

      {/* ── Dual-Input Corridor Search ── */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Rideshare Security — Corridor Monitor</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <SuburbSearchInput
            label="Pickup Location"
            value={pickupQuery}
            onChange={setPickupQuery}
            onSelect={setPickupEntry}
            placeholder="e.g., Sea Point, 8005"
          />
          <div className="flex items-end pb-2">
            <ArrowRight className="w-5 h-5 text-primary shrink-0" />
          </div>
          <SuburbSearchInput
            label="Destination"
            value={destQuery}
            onChange={setDestQuery}
            onSelect={setDestEntry}
            placeholder="e.g., Bellville, 7530"
          />
        </div>
      </div>

      {/* ── Corridor Summary ── */}
      {pickupContacts && destContacts && (
        <CorridorSummary pickup={pickupContacts} destination={destContacts} onClear={clearCorridor} />
      )}

      {/* ── Rideshare SOS Protocols ── */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-destructive mb-1">
          [RIDESHARE SUPPORT & SOS]
        </div>
        <div className="grid grid-cols-2 gap-2">
          {RIDESHARE_SOS.map(item => (
            <a
              key={item.name}
              href={`tel:${item.phone.replace(/\s/g, '')}`}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98]',
                item.color
              )}
            >
              <item.icon className="w-4 h-4 text-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono uppercase text-muted-foreground truncate">{item.name}</div>
                <div className="text-sm font-bold font-mono tabular-nums text-foreground">{item.phone}</div>
              </div>
              <Phone className="w-3.5 h-3.5 text-primary" />
            </a>
          ))}
        </div>
      </div>

      {/* ── Zone Cards (existing) ── */}
      <div className="space-y-4">
        {zones.map(zone => (
          <div key={zone.name} className="p-5 rounded-xl border border-border bg-card card-hover">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">{zone.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{zone.status === 'SAFE' ? 'Safe pickup zone' : '⚠️ Exercise caution'}</p>
              </div>
              <SafetyScoreBadge score={zone.score} size="sm" />
            </div>

            <div className={cn(
              "text-sm font-medium mb-3",
              zone.status === 'SAFE' ? "text-safety-green" : "text-safety-orange"
            )}>
              {zone.status === 'SAFE' ? '✓ Currently SAFE for pickups' : '⚠️ CAUTION recommended'}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              {zone.features.map(f => (
                <span key={f} className="flex items-center gap-1">
                  {f.includes('CCTV') ? <Camera className="w-3 h-3" /> : f.includes('traffic') ? <Users className="w-3 h-3" /> : null}
                  {f}
                </span>
              ))}
              <span>📊 {zone.incidents} incidents this week</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {Object.entries(zone.times).map(([t, score]) => (
                <div key={t} className="text-center p-2 rounded-lg bg-secondary/50">
                  <div className="text-[10px] text-muted-foreground capitalize">{t}</div>
                  <div className="text-sm font-bold text-foreground">{score}</div>
                </div>
              ))}
            </div>

            <div className="space-y-1 mb-3">
              {zone.tips.map((tip, i) => (
                <div key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="text-safety-green">✓</span> {tip}
                </div>
              ))}
            </div>

            {zone.alternatives && (
              <div className="p-3 rounded-lg bg-secondary/50 mt-3">
                <div className="text-xs font-semibold text-foreground mb-2">SAFER ALTERNATIVES NEARBY:</div>
                {zone.alternatives.map(alt => (
                  <div key={alt.name} className="flex items-center justify-between text-xs text-muted-foreground py-1">
                    <span>→ {alt.name} ({alt.distance})</span>
                    <span className="text-safety-green font-medium">{alt.score} 🟢</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Elite */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-elite-from" />
          <h3 className="font-bold text-foreground">Elite Ride Share Features</h3>
        </div>
        <ul className="space-y-1.5 mb-4">
          {['Real-time zone alerts', 'Route safety analysis', 'Auto-find safer alternatives', 'App integration support'].map(f => (
            <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
              <Crown className="w-3 h-3 text-elite-from shrink-0" /> {f}
            </li>
          ))}
        </ul>
        <button onClick={() => onUpgrade()} className="text-sm font-semibold text-primary hover:underline">Upgrade to Elite →</button>
      </div>
    </div>
  );
});

RideShareView.displayName = 'RideShareView';
export default RideShareView;
