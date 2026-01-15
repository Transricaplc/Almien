import { useState } from 'react';
import { Waves, Search, AlertTriangle, Users, Shield, Fish } from 'lucide-react';
import { beachSafety, BeachData } from '@/data/suburbIntelligence';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const BeachSafetyPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const getFlagColor = (status: BeachData['flag_status']) => {
    switch (status) {
      case 'green': return 'bg-emerald-500';
      case 'black': return 'bg-gray-800 border border-gray-600';
      case 'red': return 'bg-red-500';
      case 'white': return 'bg-white border border-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getFlagLabel = (status: BeachData['flag_status']) => {
    switch (status) {
      case 'green': return 'Safe';
      case 'black': return 'Caution';
      case 'red': return 'Danger';
      case 'white': return 'No Sharks';
      default: return 'Unknown';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-emerald-400';
    if (rating >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredBeaches = searchQuery
    ? beachSafety.filter(beach =>
        beach.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : beachSafety;

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Beach Safety</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono">
            <Fish className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400">Shark Spotters Active</span>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search beach..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Beach List */}
        <div className="space-y-1.5 max-h-[200px] overflow-y-auto scrollbar-hide">
          {filteredBeaches.map(beach => (
            <div 
              key={beach.id}
              className="p-2 bg-background/50 rounded border border-border/30 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={cn('w-3 h-4 rounded-sm', getFlagColor(beach.flag_status))} />
                  <span className="text-xs font-medium text-foreground">{beach.name}</span>
                </div>
                <div className={cn('text-sm font-bold', getRatingColor(beach.safety_rating))}>
                  {beach.safety_rating}%
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {beach.primary_risk}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                {beach.shark_spotter && (
                  <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 text-[9px] rounded font-mono">
                    SHARK SPOTTER
                  </span>
                )}
                {beach.lifeguards && (
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] rounded font-mono flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" />
                    LIFEGUARDS
                  </span>
                )}
                <span className={cn(
                  'px-1.5 py-0.5 text-[9px] rounded font-mono',
                  beach.flag_status === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                  beach.flag_status === 'red' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                )}>
                  {getFlagLabel(beach.flag_status).toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sea Rescue Quick Dial */}
        <a
          href="tel:0870949774"
          className="flex items-center gap-3 p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded border border-cyan-500/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-foreground">NSRI Sea Rescue</div>
            <div className="text-[10px] text-muted-foreground font-mono">Emergency: 087 094 9774</div>
          </div>
        </a>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[9px] text-muted-foreground font-mono">
          <span>Source: Shark Spotters / NSRI</span>
          <span className="text-cyan-400">Live monitoring</span>
        </div>
      </div>
    </div>
  );
};

export default BeachSafetyPanel;
