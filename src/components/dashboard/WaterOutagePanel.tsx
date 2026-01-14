import { useState } from 'react';
import { Droplets, Search, AlertTriangle, Wrench, CheckCircle } from 'lucide-react';
import { waterOutageData, capeMetroSuburbs, majorTowns } from '@/data/infrastructureData';
import { Input } from '@/components/ui/input';

const WaterOutagePanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const allAreas = [...capeMetroSuburbs, ...majorTowns];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'text-red-400 bg-red-500/20';
      case 'planned': return 'text-blue-400 bg-blue-500/20';
      case 'none': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-3 h-3" />;
      case 'planned': return <Wrench className="w-3 h-3" />;
      case 'none': return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredData = searchQuery 
    ? waterOutageData.filter(item => 
        item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.postalCode.includes(searchQuery)
      )
    : waterOutageData;

  const emergencyCount = waterOutageData.filter(w => w.type === 'emergency').length;
  const plannedCount = waterOutageData.filter(w => w.type === 'planned').length;

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Water Status</span>
          </div>
          <div className="flex items-center gap-2">
            {emergencyCount > 0 && (
              <span className="px-1.5 py-0.5 bg-red-500/30 text-red-400 text-[10px] font-mono rounded">
                {emergencyCount} ALERT
              </span>
            )}
            {plannedCount > 0 && (
              <span className="px-1.5 py-0.5 bg-blue-500/30 text-blue-400 text-[10px] font-mono rounded">
                {plannedCount} PLANNED
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Status List */}
        <div className="space-y-1.5 max-h-[150px] overflow-y-auto scrollbar-hide">
          {filteredData.map(item => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-2 bg-background/50 rounded border border-border/30"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground truncate">{item.area}</span>
                  <span className="text-[9px] font-mono text-muted-foreground">{item.postalCode}</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {item.type === 'none' ? 'Supply Normal' : `${item.status} • Restore: ${item.estimatedRestore}`}
                </div>
              </div>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${getTypeColor(item.type)}`}>
                {getTypeIcon(item.type)}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[9px] text-muted-foreground font-mono">
          <span>Source: CoCT Water</span>
          <span className="text-blue-400">Updated 5 min ago</span>
        </div>
      </div>
    </div>
  );
};

export default WaterOutagePanel;
