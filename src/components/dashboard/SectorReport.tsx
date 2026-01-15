import { useState, useEffect } from 'react';
import { 
  MapPin, Shield, Cross, Phone, Camera, AlertTriangle, 
  Flame, Signal, Radio, X, ChevronRight, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SuburbIntelligence, getSafetyColor, estimateFunctioningCCTV } from '@/hooks/useSuburbIntelligence';

const getRiskLabel = (score: number) => {
  if (score >= 80) return { label: 'LOW RISK', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  if (score >= 60) return { label: 'MODERATE', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  if (score >= 40) return { label: 'HIGH RISK', class: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
  return { label: 'CRITICAL', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
};

interface SectorReportProps {
  suburb: SuburbIntelligence | null;
  onClose: () => void;
  loading?: boolean;
}

const SectorReport = ({ suburb, onClose, loading }: SectorReportProps) => {
  const [signalHealth, setSignalHealth] = useState(0);
  const [functioningCCTV, setFunctioningCCTV] = useState(0);

  useEffect(() => {
    if (suburb) {
      // Animate signal health on suburb change
      setSignalHealth(0);
      setFunctioningCCTV(0);
      
      const targetSignal = suburb.cctv_coverage;
      const targetCCTV = estimateFunctioningCCTV(suburb.cctv_coverage, suburb.safety_score);
      const duration = 1000;
      const steps = 20;
      const signalIncrement = targetSignal / steps;
      const cctvIncrement = targetCCTV / steps;
      
      let current = 0;
      let cctvCurrent = 0;
      
      const timer = setInterval(() => {
        current += signalIncrement;
        cctvCurrent += cctvIncrement;
        
        if (current >= targetSignal) {
          setSignalHealth(targetSignal);
          setFunctioningCCTV(targetCCTV);
          clearInterval(timer);
        } else {
          setSignalHealth(Math.round(current));
          setFunctioningCCTV(Math.round(cctvCurrent));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [suburb]);

  if (loading) {
    return (
      <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-8 text-center">
        <Loader2 className="w-12 h-12 text-primary mx-auto mb-3 animate-spin" />
        <p className="text-muted-foreground text-sm font-mono">Loading sector data...</p>
      </div>
    );
  }

  if (!suburb) {
    return (
      <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-6 text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground text-sm">
          Search for an area to view sector intelligence
        </p>
      </div>
    );
  }

  const risk = getRiskLabel(suburb.safety_score);

  return (
    <div className="bg-card/80 backdrop-blur-xl rounded-xl border-2 border-primary/50 overflow-hidden shadow-xl shadow-primary/10 animate-scale-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/30 to-primary/10 px-4 py-3 border-b border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">{suburb.suburb_name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <span>Ward {suburb.ward_id}</span>
                <span>•</span>
                <span>{suburb.area_code}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background/50 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Safety Score & Risk Badge */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-mono">Safety Score</div>
            <div 
              className="text-5xl font-black font-mono tabular-nums"
              style={{ color: getSafetyColor(suburb.safety_score) }}
            >
              {suburb.safety_score}
            </div>
          </div>
          <div className={cn('px-4 py-2 rounded-lg border font-bold text-sm font-mono', risk.class)}>
            {risk.label}
          </div>
        </div>

        {/* Live Signal Health */}
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">CCTV Signal Health</span>
            </div>
            <div className="flex items-center gap-1">
              <Radio className={cn(
                'w-3 h-3',
                signalHealth >= 70 ? 'text-emerald-400' : signalHealth >= 40 ? 'text-yellow-400' : 'text-red-400'
              )} />
              <span className="font-mono text-sm font-bold text-foreground tabular-nums">{signalHealth}%</span>
            </div>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-primary to-cyan-400"
              style={{ width: `${signalHealth}%` }}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-mono">24H INCIDENTS</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-foreground">{suburb.incidents_24h}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Camera className="w-4 h-4" />
              <span className="text-[10px] font-mono">COVERAGE</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-foreground">{suburb.cctv_coverage}%</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Camera className="w-4 h-4" />
              <span className="text-[10px] font-mono">FUNCTIONING</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">{functioningCCTV}%</div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-2">
          {/* SAPS */}
          <a
            href={`tel:${suburb.saps_contact.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Shield className="w-5 h-5 text-blue-400 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">{suburb.saps_station}</div>
              <div className="text-xs text-muted-foreground font-mono">Local SAPS Station</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-400 tabular-nums">{suburb.saps_contact}</span>
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </div>
          </a>

          {/* Fire */}
          <a
            href={`tel:${suburb.fire_contact.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <Flame className="w-5 h-5 text-orange-400 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">{suburb.fire_station}</div>
              <div className="text-xs text-muted-foreground font-mono">Fire & Rescue</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-orange-400 tabular-nums">{suburb.fire_contact}</span>
              <ChevronRight className="w-4 h-4 text-orange-400" />
            </div>
          </a>

          {/* Hospital */}
          <a
            href={`tel:${suburb.hospital_contact.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 transition-colors">
              <Cross className="w-5 h-5 text-red-400 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">{suburb.hospital_name}</div>
              <div className="text-xs text-muted-foreground font-mono">Nearest Hospital</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-red-400 tabular-nums">{suburb.hospital_contact}</span>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SectorReport;
