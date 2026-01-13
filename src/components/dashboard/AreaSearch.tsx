import { useState, useMemo } from 'react';
import { Search, MapPin, Shield, Cross, Phone, Camera, AlertTriangle, X } from 'lucide-react';
import { areasData, AreaData } from '@/data/emergencyContacts';
import { getSafetyColor, cn } from '@/lib/utils';

const riskBadgeStyles = {
  low: 'bg-safety-good/20 text-safety-good border-safety-good/30',
  moderate: 'bg-safety-moderate/20 text-safety-moderate border-safety-moderate/30',
  high: 'bg-safety-poor/20 text-safety-poor border-safety-poor/30',
  critical: 'bg-destructive/20 text-destructive border-destructive/30',
};

const riskLabels = {
  low: 'LOW RISK',
  moderate: 'MODERATE',
  high: 'HIGH RISK',
  critical: 'CRITICAL',
};

interface AreaCardProps {
  area: AreaData;
  onClose: () => void;
}

const AreaCard = ({ area, onClose }: AreaCardProps) => {
  return (
    <div className="bg-card rounded-xl border-2 border-primary overflow-hidden animate-scale-in">
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-3 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">{area.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-background/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Safety Score & Risk */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Safety Score</div>
            <div 
              className="text-4xl font-black"
              style={{ color: getSafetyColor(area.safetyScore) }}
            >
              {area.safetyScore}
            </div>
          </div>
          <div className={cn(
            'px-3 py-1.5 rounded-lg border font-bold text-sm',
            riskBadgeStyles[area.riskLevel]
          )}>
            {riskLabels[area.riskLevel]}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">Incidents (24h)</span>
            </div>
            <div className="text-xl font-bold text-foreground">{area.incidents24h}</div>
          </div>
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Camera className="w-4 h-4" />
              <span className="text-xs">Camera Coverage</span>
            </div>
            <div className="text-xl font-bold text-foreground">{area.camerasCoverage}%</div>
          </div>
        </div>

        {/* Police Station */}
        <a
          href={`tel:${area.policeNumber.replace(/\s/g, '')}`}
          className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-primary/10 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Shield className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground text-sm">{area.policeStation}</div>
            <div className="text-xs text-muted-foreground">Local Police Station</div>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Phone className="w-4 h-4" />
            <span className="font-mono text-sm font-bold">{area.policeNumber}</span>
          </div>
        </a>

        {/* Hospital */}
        <a
          href={`tel:${area.hospitalNumber.replace(/\s/g, '')}`}
          className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-destructive/10 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center group-hover:bg-destructive transition-colors">
            <Cross className="w-5 h-5 text-destructive group-hover:text-destructive-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground text-sm">{area.nearestHospital}</div>
            <div className="text-xs text-muted-foreground">Nearest Hospital</div>
          </div>
          <div className="flex items-center gap-1 text-destructive">
            <Phone className="w-4 h-4" />
            <span className="font-mono text-sm font-bold">{area.hospitalNumber}</span>
          </div>
        </a>
      </div>
    </div>
  );
};

const AreaSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return areasData.filter(area => 
      area.name.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSelectArea = (area: AreaData) => {
    setSelectedArea(area);
    setSearchQuery('');
    setIsFocused(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className={cn(
          'relative bg-card rounded-xl border-2 transition-all duration-200',
          isFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
        )}>
          <div className="flex items-center px-4 py-3">
            <Search className={cn(
              'w-5 h-5 mr-3 transition-colors',
              isFocused ? 'text-primary' : 'text-muted-foreground'
            )} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search area (e.g., Sea Point, Camps Bay...)"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded hover:bg-background transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isFocused && filteredAreas.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-2xl overflow-hidden z-50 animate-fade-in">
            {filteredAreas.map(area => (
              <button
                key={area.id}
                onClick={() => handleSelectArea(area)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">{area.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Safety: {area.safetyScore} • {area.incidents24h} incidents today
                  </div>
                </div>
                <div 
                  className="text-lg font-bold"
                  style={{ color: getSafetyColor(area.safetyScore) }}
                >
                  {area.safetyScore}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isFocused && searchQuery && filteredAreas.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-2xl p-4 text-center z-50 animate-fade-in">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">No areas found for "{searchQuery}"</div>
          </div>
        )}
      </div>

      {/* Selected Area Card */}
      {selectedArea && (
        <AreaCard area={selectedArea} onClose={() => setSelectedArea(null)} />
      )}

      {/* Quick Area Pills */}
      {!selectedArea && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground py-1">Quick access:</span>
          {areasData.slice(0, 6).map(area => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105',
                'border',
                riskBadgeStyles[area.riskLevel]
              )}
            >
              {area.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaSearch;
