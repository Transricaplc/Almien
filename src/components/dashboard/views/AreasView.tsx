import { memo, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Search, MapPin, ArrowLeft, Clock, Target, Shield, ArrowRight, X, Phone, Flame, Building2, Radio, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SafetyScoreBadge from '../SafetyScoreBadge';
import { capeTownAreas, searchAreas, type AreaSafetyData } from '@/data/capeTownSafetyData';
import { useSuburbIntelligence, type SuburbIntelligence } from '@/hooks/useSuburbIntelligence';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const safetyFilters = ['all', 'green', 'yellow', 'orange', 'red'] as const;
const filterLabels = { all: 'All', green: '🟢 Green', yellow: '🟡 Yellow', orange: '🟠 Orange', red: '🔴 Red' };

// Map suburb_intelligence to display
const getSuburbSafetyLevel = (score: number) => {
  if (score >= 75) return 'green';
  if (score >= 55) return 'yellow';
  if (score >= 35) return 'orange';
  return 'red';
};

const AreasView = memo(({ onUpgrade, onNavigate }: Props) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<typeof safetyFilters[number]>('all');
  const [selectedArea, setSelectedArea] = useState<AreaSafetyData | null>(null);
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbIntelligence | null>(null);

  const { suburbs, loading: suburbsLoading, searchSuburbs } = useSuburbIntelligence();

  // Search both static areas and live suburb_intelligence (by name or area code)
  const matchedSuburbs = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return suburbs.filter(s =>
      s.suburb_name.toLowerCase().includes(q) ||
      s.area_code.toLowerCase().includes(q) ||
      String(s.ward_id).includes(q)
    ).slice(0, 20);
  }, [query, suburbs]);

  const filtered = useMemo(() => {
    const areas = query ? searchAreas(query) : capeTownAreas;
    return areas
      .filter(a => filter === 'all' || a.safetyLevel === filter)
      .sort((a, b) => b.safetyScore - a.safetyScore);
  }, [query, filter]);

  const filteredSuburbs = useMemo(() => {
    if (filter === 'all') return matchedSuburbs;
    return matchedSuburbs.filter(s => getSuburbSafetyLevel(s.safety_score) === filter);
  }, [matchedSuburbs, filter]);

  // Detail view for a suburb from the database
  if (selectedSuburb) {
    const safetyLevel = getSuburbSafetyLevel(selectedSuburb.safety_score);
    const lastVerified = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedSuburb(null)} className="flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Areas
        </button>

        <div className="flex items-center gap-4">
          <SafetyScoreBadge score={selectedSuburb.safety_score / 10} size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{selectedSuburb.suburb_name}</h1>
            <p className="text-muted-foreground">Ward {selectedSuburb.ward_id} · Area Code {selectedSuburb.area_code} · <span className="capitalize">{safetyLevel}</span> Risk Zone</p>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <div className="text-2xl font-bold text-foreground">{selectedSuburb.safety_score}</div>
            <div className="text-xs text-muted-foreground mt-1">Safety Score</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <div className="text-2xl font-bold text-foreground">{selectedSuburb.incidents_24h}</div>
            <div className="text-xs text-muted-foreground mt-1">Incidents (24h)</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <div className="text-2xl font-bold text-foreground">{selectedSuburb.cctv_coverage}%</div>
            <div className="text-xs text-muted-foreground mt-1">CCTV Coverage</div>
          </div>
        </div>

        {selectedSuburb.risk_type && (
          <div className="p-3 rounded-lg border border-safety-orange/30 bg-safety-orange/5">
            <div className="flex items-center gap-2 text-sm font-semibold text-safety-orange">
              <Radio className="w-4 h-4" />
              Primary Risk: <span className="capitalize">{selectedSuburb.risk_type.replace('_', ' ')}</span>
            </div>
          </div>
        )}

        {/* Emergency Resources - Tactical Panel */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Emergency Resources
          </h2>
          <div className="space-y-3">
            {/* SAPS */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{selectedSuburb.saps_station}</div>
                  <div className="text-xs text-muted-foreground">South African Police Service</div>
                </div>
              </div>
              <a
                href={`tel:${selectedSuburb.saps_contact.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity w-full justify-center"
              >
                <Phone className="w-4 h-4" />
                {selectedSuburb.saps_contact}
              </a>
            </div>

            {/* Hospital */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-safety-red/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-safety-red" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{selectedSuburb.hospital_name}</div>
                  <div className="text-xs text-muted-foreground">Medical Emergency</div>
                </div>
              </div>
              <a
                href={`tel:${selectedSuburb.hospital_contact.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-bold hover:opacity-90 transition-opacity w-full justify-center"
              >
                <Phone className="w-4 h-4" />
                {selectedSuburb.hospital_contact}
              </a>
            </div>

            {/* Fire */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-safety-orange/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-safety-orange" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{selectedSuburb.fire_station}</div>
                  <div className="text-xs text-muted-foreground">Fire & Rescue</div>
                </div>
              </div>
              <a
                href={`tel:${selectedSuburb.fire_contact.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-safety-orange text-white text-sm font-bold hover:opacity-90 transition-opacity w-full justify-center"
              >
                <Phone className="w-4 h-4" />
                {selectedSuburb.fire_contact}
              </a>
            </div>
          </div>
        </div>

        {/* Last Verified */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <CheckCircle2 className="w-3.5 h-3.5 text-safety-green" />
          Data last verified: {lastVerified} · Source: SAPS Station Directory / WC Gov Health
        </div>

        <button onClick={() => onUpgrade('Historical Trends with Elite')} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
          View Historical Trends 👑 <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Detail view for a static area
  if (selectedArea) {
    // Find matching suburb intelligence for this area
    const matchingSuburb = suburbs.find(s =>
      s.suburb_name.toLowerCase() === selectedArea.name.toLowerCase() ||
      selectedArea.name.toLowerCase().includes(s.suburb_name.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedArea(null)} className="flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Areas
        </button>

        <div className="flex items-center gap-4">
          <SafetyScoreBadge score={selectedArea.safetyScore} size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{selectedArea.name}</h1>
            <p className="text-muted-foreground capitalize">{selectedArea.safetyLevel} Risk Zone</p>
          </div>
        </div>

        {/* Time-based safety */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Time-Based Safety</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['morning', 'day', 'evening', 'night'] as const).map(t => {
              const data = selectedArea.timeBasedSafety[t];
              const labels = { morning: '🌅 Morning', day: '☀️ Day', evening: '🌆 Evening', night: '🌙 Night' };
              return (
                <div key={t} className="p-4 rounded-xl border border-border bg-card text-center">
                  <div className="text-sm text-muted-foreground mb-1">{labels[t]}</div>
                  <SafetyScoreBadge score={data.score} size="sm" className="mx-auto" />
                  <div className="text-xs text-muted-foreground mt-1 capitalize">{data.color}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incidents */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">Incident Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div><div className="text-2xl font-bold text-foreground">{selectedArea.incidentCount.last7Days}</div><div className="text-xs text-muted-foreground">Last 7 Days</div></div>
            <div><div className="text-2xl font-bold text-foreground">{selectedArea.incidentCount.last30Days}</div><div className="text-xs text-muted-foreground">Last 30 Days</div></div>
            <div><div className="text-2xl font-bold text-foreground">{selectedArea.incidentCount.last12Months}</div><div className="text-xs text-muted-foreground">Last 12 Months</div></div>
          </div>
        </div>

        {/* Emergency Resources from DB (if matched) */}
        {matchingSuburb && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Emergency Resources
            </h2>
            <div className="space-y-2">
              <a href={`tel:${matchingSuburb.saps_contact.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{matchingSuburb.saps_station}</div>
                  <div className="text-xs text-muted-foreground">SAPS</div>
                </div>
                <span className="text-sm font-bold text-primary">{matchingSuburb.saps_contact}</span>
              </a>
              <a href={`tel:${matchingSuburb.hospital_contact.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors">
                <Building2 className="w-5 h-5 text-destructive shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{matchingSuburb.hospital_name}</div>
                  <div className="text-xs text-muted-foreground">Medical</div>
                </div>
                <span className="text-sm font-bold text-destructive">{matchingSuburb.hospital_contact}</span>
              </a>
              <a href={`tel:${matchingSuburb.fire_contact.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors">
                <Flame className="w-5 h-5 text-safety-orange shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{matchingSuburb.fire_station}</div>
                  <div className="text-xs text-muted-foreground">Fire & Rescue</div>
                </div>
                <span className="text-sm font-bold text-safety-orange">{matchingSuburb.fire_contact}</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-safety-green" />
              Verified: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} · SAPS Directory / WC Gov Health
            </div>
          </div>
        )}

        {/* Activities */}
        {selectedArea.recommendedActivities.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Recommended Activities</h2>
            <div className="space-y-2">
              {selectedArea.recommendedActivities.map(act => (
                <div key={act.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <div>
                    <div className="text-sm font-medium text-foreground">{act.name}</div>
                    <div className="text-xs text-muted-foreground">Best: {act.bestTime} · {act.category}</div>
                  </div>
                  <SafetyScoreBadge score={act.safetyScore} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Nearby Facilities</h2>
          <div className="space-y-2">
            {selectedArea.nearbyFacilities.map(f => (
              <div key={f.name} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{f.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{f.type.replace('_', ' ')} · {f.distance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Safety Tips</h2>
          <ul className="space-y-2">
            {selectedArea.safetyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-secondary/50">
                <span className="text-primary mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => onUpgrade('Historical Trends with Elite')} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
          View Historical Trends 👑 <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Has search with DB results
  const showDbResults = query.trim().length > 0 && filteredSuburbs.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Areas & Zones</h1>
        <p className="text-muted-foreground mt-1">{suburbs.length} suburbs monitored across Western Cape</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by suburb, area code (e.g. 7708), or ward number..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-10"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {safetyFilters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Live Intelligence Results (from DB) */}
      {showDbResults && (
        <div>
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" />
            Live Intelligence — {filteredSuburbs.length} match{filteredSuburbs.length !== 1 ? 'es' : ''}
          </h2>
          <div className="space-y-3">
            {filteredSuburbs.map(suburb => {
              const level = getSuburbSafetyLevel(suburb.safety_score);
              const levelColors = { green: 'text-safety-green', yellow: 'text-safety-yellow', orange: 'text-safety-orange', red: 'text-safety-red' };
              return (
                <div
                  key={suburb.id}
                  className="p-5 rounded-xl border border-border bg-card card-hover cursor-pointer"
                  onClick={() => setSelectedSuburb(suburb)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{suburb.suburb_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Ward {suburb.ward_id} · Area Code {suburb.area_code}
                        {suburb.risk_type && <span className="ml-1 capitalize"> · {suburb.risk_type.replace('_', ' ')}</span>}
                      </p>
                    </div>
                    <div className={cn("text-2xl font-black tabular-nums", levelColors[level])}>
                      {suburb.safety_score}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {suburb.incidents_24h} incidents / 24h</span>
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {suburb.cctv_coverage}% CCTV</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <a href={`tel:${suburb.saps_contact.replace(/[^0-9+]/g, '')}`}
                      onClick={e => e.stopPropagation()}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" /> SAPS
                    </a>
                    <a href={`tel:${suburb.hospital_contact.replace(/[^0-9+]/g, '')}`}
                      onClick={e => e.stopPropagation()}
                      className="text-xs font-semibold text-destructive hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Medical
                    </a>
                    <button className="text-xs font-semibold text-primary hover:underline">View Details</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Static area cards */}
      {(!showDbResults || filtered.length > 0) && (
        <div className="space-y-3">
          {!showDbResults && <h2 className="text-sm font-bold text-foreground mb-1">Cape Town Safety Areas</h2>}
          {filtered.map(area => (
            <div
              key={area.id}
              className="p-5 rounded-xl border border-border bg-card card-hover cursor-pointer"
              onClick={() => setSelectedArea(area)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{area.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{area.safetyLevel} risk zone</p>
                </div>
                <SafetyScoreBadge score={area.safetyScore} size="sm" />
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {area.incidentCount.last7Days} incidents / 7d</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Safest: Morning & Day</span>
                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {area.recommendedActivities.length} activities</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="text-xs font-semibold text-primary hover:underline">View Details</button>
                <button className="text-xs text-muted-foreground hover:text-foreground">Save</button>
                <button className="text-xs text-muted-foreground hover:text-foreground">Directions</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

AreasView.displayName = 'AreasView';
export default AreasView;