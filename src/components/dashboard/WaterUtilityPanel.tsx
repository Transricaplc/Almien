import { Droplet, AlertTriangle, Gauge, Clock } from 'lucide-react';
import { useWaterStatus, getDamStatusColor, getOutageTypeIcon } from '@/hooks/useWaterStatus';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const WaterUtilityPanel = () => {
  const { dams, outages, loading, averageLevel, activeOutages } = useWaterStatus();

  if (loading) {
    return (
      <div className="glass-panel p-4 space-y-3">
        <Skeleton className="h-5 w-32 bg-white/10" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-12 w-full bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplet className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-white/90">Water Utility</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400/70" />
            <span className="text-xs font-mono text-cyan-400">{averageLevel.toFixed(1)}%</span>
          </div>
          {activeOutages > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs font-mono text-red-400">{activeOutages}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dam Levels */}
      <div className="space-y-2">
        <span className="text-xs text-white/50 uppercase tracking-wider">Dam Levels</span>
        <div className="grid grid-cols-2 gap-2">
          {dams.slice(0, 4).map(dam => (
            <div 
              key={dam.id}
              className="bg-black/30 border border-white/5 rounded-lg p-2 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70 truncate">{dam.dam_name.replace(' Dam', '')}</span>
                <span 
                  className="text-xs font-mono font-bold"
                  style={{ color: getDamStatusColor(Number(dam.current_level)) }}
                >
                  {Number(dam.current_level).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${dam.current_level}%`,
                    backgroundColor: getDamStatusColor(Number(dam.current_level))
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Outages */}
      {outages.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-white/50 uppercase tracking-wider">Active Outages</span>
          <ScrollArea className="h-24">
            <div className="space-y-2">
              {outages.map(outage => (
                <div 
                  key={outage.id}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-2"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">{getOutageTypeIcon(outage.outage_type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-white/90">{outage.suburb}</span>
                        <span className="text-xs text-red-400 uppercase">{outage.outage_type}</span>
                      </div>
                      <p className="text-xs text-white/50 truncate">{outage.area_description}</p>
                      {outage.estimated_end_time && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-white/40" />
                          <span className="text-xs font-mono text-white/40">
                            Est: {new Date(outage.estimated_end_time).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* No Outages Message */}
      {outages.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-2 text-green-400/70">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs">No active outages</span>
        </div>
      )}
    </div>
  );
};

export default WaterUtilityPanel;
