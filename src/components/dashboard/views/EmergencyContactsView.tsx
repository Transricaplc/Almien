import { memo, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Phone, MapPin, Clock, ChevronDown, ChevronUp, Shield, Crown, Lock,
  Search, Flame, AlertTriangle, Zap, Filter, X, Navigation,
} from 'lucide-react';
import {
  westernCapeDirectory, getEmergencyContacts, searchDirectory, PROVINCE_WIDE,
  type SuburbEmergencyEntry, type EmergencyContactsResult,
} from '@/data/westernCapeEmergencyDirectory';
import { openDirectionsTo } from '@/utils/locationUtils';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

// ── Filter categories ──
type FilterCategory = 'ALL' | 'POLICE' | 'FIRE' | 'HOSPITAL' | 'UTILITY';

const FILTER_TABS: { id: FilterCategory; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: 'ALL', label: 'All', icon: Phone, color: 'text-foreground' },
  { id: 'POLICE', label: 'Police', icon: Shield, color: 'text-[#2563eb]' },
  { id: 'FIRE', label: 'Fire', icon: Flame, color: 'text-[#b91c1c]' },
  { id: 'HOSPITAL', label: 'Hospital', icon: AlertTriangle, color: 'text-emerald-500' },
  { id: 'UTILITY', label: 'Utility', icon: Zap, color: 'text-amber-500' },
];

// ── Universal numbers ──
const UNIVERSAL_NUMBERS = [
  { name: 'General Emergency (Mobile)', number: '112', color: 'border-destructive/40 bg-destructive/10' },
  { name: 'General Emergency (Landline)', number: '107', color: 'border-destructive/40 bg-destructive/10' },
  { name: 'SAPS National', number: '10111', color: 'border-[#2563eb]/40 bg-[#2563eb]/10' },
  { name: 'Ambulance / Fire', number: '10177', color: 'border-[#b91c1c]/40 bg-[#b91c1c]/10' },
  { name: 'CT Metro Police', number: '0860 765 423', color: 'border-[#2563eb]/30 bg-[#2563eb]/5' },
  { name: 'Mountain / Sea Rescue', number: '021 937 0300', color: 'border-amber-500/30 bg-amber-500/5' },
];

// ── Click-to-call chip ──
const CallChip = memo(({ name, number, colorClass }: { name: string; number: string; colorClass: string }) => (
  <a
    href={`tel:${number.replace(/\s/g, '')}`}
    className={cn(
      'flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98]',
      colorClass
    )}
  >
    <Phone className="w-3.5 h-3.5 shrink-0 text-foreground" />
    <div className="flex-1 min-w-0">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">{name}</div>
      <div className="text-sm font-bold font-mono tabular-nums text-foreground">{number}</div>
    </div>
  </a>
));
CallChip.displayName = 'CallChip';

// ── Suburb contact card (expanded) ──
const SuburbContactCard = memo(({ contacts, filter }: { contacts: EmergencyContactsResult; filter: FilterCategory }) => {
  const showSAPS = filter === 'ALL' || filter === 'POLICE';
  const showFire = filter === 'ALL' || filter === 'FIRE';
  const showMedical = filter === 'ALL' || filter === 'HOSPITAL';
  const showUtility = filter === 'ALL' || filter === 'UTILITY';

  return (
    <div className="rounded-xl border border-primary/30 bg-card overflow-hidden animate-fade-in">
      <div className="px-4 py-3 bg-primary/5 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">{contacts.suburb}</span>
          <span className="text-xs font-mono text-muted-foreground">({contacts.postalCode})</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* SAPS */}
        {showSAPS && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-[0.08em] font-bold text-[#2563eb]">[SAPS CONTACTS]</div>
              <button
                onClick={() => openDirectionsTo(contacts.saps.station)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent-safe/10 hover:bg-accent-safe/20 text-accent-safe border border-accent-safe/20 text-[9px] font-bold transition-colors min-h-[28px]"
                title={`Navigate to ${contacts.saps.station}`}
              >
                <Navigation className="w-2.5 h-2.5" />NAVIGATE
              </button>
            </div>
            <CallChip name={contacts.saps.station} number={contacts.saps.phone} colorClass="border-[#2563eb]/30 bg-[#2563eb]/5" />
            {contacts.saps.clusterHQ && (
              <CallChip name={`Cluster HQ: ${contacts.saps.clusterHQ}`} number={contacts.saps.clusterPhone!} colorClass="border-[#2563eb]/20 bg-[#2563eb]/5" />
            )}
            <CallChip name="National Crime Stop" number={contacts.saps.nationalCrimeStop} colorClass="border-[#2563eb]/20 bg-[#2563eb]/5" />
            <CallChip name="CT Metro Police" number="0860 765 423" colorClass="border-[#2563eb]/15 bg-card" />
          </div>
        )}

        {/* Fire */}
        {showFire && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-[0.08em] font-bold text-[#b91c1c]">[FIRE & RESCUE]</div>
            <CallChip name={contacts.fire.station} number={contacts.fire.phone} colorClass="border-[#b91c1c]/30 bg-[#b91c1c]/5" />
            <CallChip name="WSAR Mountain Rescue" number={contacts.fire.wsar} colorClass="border-[#b91c1c]/20 bg-[#b91c1c]/5" />
            <CallChip name="NSRI Sea Rescue" number={contacts.fire.nsri} colorClass="border-[#b91c1c]/15 bg-card" />
          </div>
        )}

        {/* Medical */}
        {showMedical && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-[0.08em] font-bold text-emerald-500">[MEDICAL INTELLIGENCE]</div>
              <button
                onClick={() => openDirectionsTo(contacts.medical.publicHospital)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold transition-colors min-h-[28px]"
                title={`Navigate to ${contacts.medical.publicHospital}`}
              >
                <Navigation className="w-2.5 h-2.5" />NAVIGATE
              </button>
            </div>
            <CallChip name={`Public: ${contacts.medical.publicHospital}`} number={contacts.medical.publicPhone} colorClass="border-emerald-500/30 bg-emerald-500/5" />
            {contacts.medical.privateClinic && (
              <CallChip name={`Private: ${contacts.medical.privateClinic}`} number={contacts.medical.privatePhone!} colorClass="border-emerald-500/20 bg-emerald-500/5" />
            )}
            <CallChip name="Metro EMS Ambulance" number={contacts.medical.metroEMS} colorClass="border-emerald-500/15 bg-card" />
            <CallChip name="ER24" number={contacts.medical.er24} colorClass="border-emerald-500/15 bg-card" />
            <CallChip name="Netcare 911" number={contacts.medical.netcare911} colorClass="border-emerald-500/15 bg-card" />
          </div>
        )}

        {/* Utility */}
        {showUtility && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-[0.08em] font-bold text-amber-500">[UTILITY & CIVIC]</div>
            <CallChip name="Eskom Loadshedding" number="0860 037 566" colorClass="border-amber-500/20 bg-amber-500/5" />
            <CallChip name="Water / Burst Pipe" number="0860 103 089" colorClass="border-amber-500/20 bg-amber-500/5" />
            <CallChip name="CoCT Service Desk" number="0860 103 089" colorClass="border-amber-500/15 bg-card" />
          </div>
        )}
      </div>
    </div>
  );
});
SuburbContactCard.displayName = 'SuburbContactCard';

const EmergencyContactsView = memo(({ onUpgrade }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterCategory>('ALL');
  const [selectedContacts, setSelectedContacts] = useState<EmergencyContactsResult | null>(null);

  const searchResults = useMemo(() => searchDirectory(searchQuery), [searchQuery]);

  const handleSelect = (entry: SuburbEmergencyEntry) => {
    const contacts = getEmergencyContacts(entry.suburb);
    setSelectedContacts(contacts);
    setSearchQuery('');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Emergency Contacts</h1>
        <p className="text-muted-foreground mt-1">Universal directory — {westernCapeDirectory.length} Western Cape suburbs</p>
      </div>

      {/* ── Universal Emergency Numbers ── */}
      <div className="p-4 rounded-xl border-2 border-destructive/40 bg-card">
        <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-destructive mb-3">
          [UNIVERSAL EMERGENCY — ALWAYS AVAILABLE]
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {UNIVERSAL_NUMBERS.map(n => (
            <a
              key={n.number}
              href={`tel:${n.number.replace(/\s/g, '')}`}
              className={cn(
                'flex flex-col items-center p-3 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98] text-center',
                n.color
              )}
            >
              <div className="text-lg font-black font-mono tabular-nums text-foreground">{n.number}</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">{n.name}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <div className="flex items-center bg-card rounded-xl border-2 border-border px-4 py-3 focus-within:border-primary transition-colors">
          <Search className="w-4 h-4 mr-3 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suburb name or postal code (e.g., Claremont, 7708)..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 rounded hover:bg-background transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {searchQuery && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-2xl overflow-hidden z-50 animate-fade-in max-h-64 overflow-y-auto">
            {searchResults.map(entry => (
              <button
                key={entry.suburb}
                onClick={() => handleSelect(entry)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left border-b border-border/30 last:border-0"
              >
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">{entry.suburb}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{entry.postalCode} · {entry.saps.station}</div>
                </div>
                <Shield className="w-3.5 h-3.5 text-[#2563eb]" />
              </button>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-2xl p-4 text-center z-50 animate-fade-in">
            <MapPin className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">No suburbs found for "{searchQuery}"</div>
            <div className="text-xs text-muted-foreground mt-1">Default: WC Emergency <span className="font-mono font-bold">107</span></div>
          </div>
        )}
      </div>

      {/* ── Quick Filter ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        {FILTER_TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0',
                filter === tab.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40'
              )}
            >
              <Icon className={cn('w-3 h-3', filter === tab.id ? 'text-primary-foreground' : tab.color)} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Selected Suburb Card ── */}
      {selectedContacts && (
        <div className="relative">
          <button
            onClick={() => setSelectedContacts(null)}
            className="absolute top-3 right-3 p-1 rounded hover:bg-background/50 z-10"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <SuburbContactCard contacts={selectedContacts} filter={filter} />
        </div>
      )}

      {/* ── Quick Access: Popular Suburbs ── */}
      {!selectedContacts && (
        <div className="space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Quick Access — Key Hubs</div>
          <div className="flex flex-wrap gap-2">
            {['Cape Town CBD', 'Sea Point', 'Camps Bay', 'Bellville', 'Stellenbosch', 'George', 'Khayelitsha', 'Hermanus', 'Atlantis', 'Paarl'].map(name => (
              <button
                key={name}
                onClick={() => {
                  const contacts = getEmergencyContacts(name);
                  if (contacts) setSelectedContacts(contacts);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Elite */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-elite-from" />
          <h3 className="font-bold text-foreground">Save Personal Emergency Contacts</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Family, friends, hotel, tour guide — all in one place</p>
        <button onClick={() => onUpgrade()} className="text-sm font-semibold text-primary hover:underline">Upgrade to Elite →</button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Export All (vCard)</button>
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Print Card</button>
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Email to Self</button>
      </div>
    </div>
  );
});

EmergencyContactsView.displayName = 'EmergencyContactsView';
export default EmergencyContactsView;
