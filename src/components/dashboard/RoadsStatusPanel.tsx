import { useState } from 'react';
import { 
  Route, ChevronDown, ChevronUp, AlertTriangle, 
  Construction, Car, TrendingUp, Clock, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { roadsData, RoadStatus } from '@/data/mapData';

const statusConfig = {
  clear: { label: 'Clear', color: 'text-safety-good bg-safety-good/20', icon: TrendingUp },
  congested: { label: 'Congested', color: 'text-safety-moderate bg-safety-moderate/20', icon: Car },
  incident: { label: 'Incident', color: 'text-safety-critical bg-safety-critical/20', icon: AlertTriangle },
  roadworks: { label: 'Roadworks', color: 'text-safety-poor bg-safety-poor/20', icon: Construction },
  closed: { label: 'Closed', color: 'text-destructive bg-destructive/20', icon: AlertTriangle },
};

const typeColors = {
  national: 'border-l-blue-500',
  municipal: 'border-l-emerald-500',
  regional: 'border-l-purple-500',
};

const RoadCard = ({ road }: { road: RoadStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = statusConfig[road.status];
  const StatusIcon = config.icon;

  return (
    <div className={cn(
      'bg-background/50 rounded-lg border border-border/50 overflow-hidden',
      'border-l-4',
      typeColors[road.type]
    )}>
      <div 
        className="p-3 cursor-pointer hover:bg-background/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">{road.name.split(' - ')[0]}</span>
              <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', config.color)}>
                {config.label}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {road.name.split(' - ')[1]}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-mono text-sm font-bold text-foreground">{road.avgSpeed}<span className="text-[10px] text-muted-foreground">km/h</span></div>
              <div className="text-[10px] text-muted-foreground">{road.length}</div>
            </div>
            {road.sections && (
              isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Traffic flow bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Traffic Flow</span>
            <span>{road.trafficFlow}%</span>
          </div>
          <div className="h-1.5 bg-background rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all',
                road.trafficFlow >= 70 ? 'bg-safety-good' :
                road.trafficFlow >= 40 ? 'bg-safety-moderate' : 'bg-safety-critical'
              )}
              style={{ width: `${road.trafficFlow}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded sections */}
      {isExpanded && road.sections && (
        <div className="px-3 pb-3 pt-0 space-y-1.5 animate-fade-in border-t border-border/30 mt-2 pt-2">
          {road.sections.map((section, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between py-1.5 px-2 rounded bg-background/30"
            >
              <span className="text-xs text-foreground">{section.name}</span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px]',
                  statusConfig[section.status].color
                )}>
                  {statusConfig[section.status].label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{section.speed}km/h</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-1.5 bg-background/30 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{road.lastUpdate}</span>
        </div>
        {road.incidents > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-safety-critical">
            <AlertTriangle className="w-3 h-3" />
            <span>{road.incidents} incident{road.incidents > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const RoadsStatusPanel = () => {
  const [filter, setFilter] = useState<'all' | 'national' | 'municipal' | 'regional'>('all');
  const [search, setSearch] = useState('');

  const filteredRoads = roadsData.filter(road => {
    const matchesFilter = filter === 'all' || road.type === filter;
    const matchesSearch = road.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const nationalCount = roadsData.filter(r => r.type === 'national').length;
  const municipalCount = roadsData.filter(r => r.type === 'municipal').length;
  const regionalCount = roadsData.filter(r => r.type === 'regional').length;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Roads Status</h3>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">N({nationalCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">M({municipalCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">R({regionalCount})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search N1, M3, R300..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-3 py-2 flex gap-2 border-b border-border/50 overflow-x-auto scrollbar-hide">
        {(['all', 'national', 'municipal', 'regional'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
              filter === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            )}
          >
            {type === 'all' ? 'All Roads' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Roads List */}
      <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
        {filteredRoads.map(road => (
          <RoadCard key={road.id} road={road} />
        ))}
        {filteredRoads.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No roads found matching your search
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="px-4 py-2 bg-background/30 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span>TOTAL: {roadsData.length} ROUTES</span>
        <span className="text-safety-critical">
          {roadsData.filter(r => r.status === 'incident').length} INCIDENTS ACTIVE
        </span>
      </div>
    </div>
  );
};

export default RoadsStatusPanel;
