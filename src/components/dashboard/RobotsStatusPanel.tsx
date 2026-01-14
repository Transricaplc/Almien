import { useState } from 'react';
import { TrafficCone, Search, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { robotStatusData } from '@/data/infrastructureData';
import { Input } from '@/components/ui/input';

const RobotsStatusPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-400 bg-emerald-500/20';
      case 'faulty': return 'text-yellow-400 bg-yellow-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-3 h-3" />;
      case 'faulty': return <AlertTriangle className="w-3 h-3" />;
      case 'offline': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredData = searchQuery 
    ? robotStatusData.filter(item => 
        item.intersection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.area.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : robotStatusData;

  const operationalCount = robotStatusData.filter(r => r.status === 'operational').length;
  const faultyCount = robotStatusData.filter(r => r.status === 'faulty').length;
  const offlineCount = robotStatusData.filter(r => r.status === 'offline').length;

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrafficCone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Traffic Robots</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono">
            <span className="text-emerald-400">{operationalCount}✓</span>
            <span className="text-yellow-400">{faultyCount}⚠</span>
            <span className="text-red-400">{offlineCount}✕</span>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search intersection..."
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
                <div className="text-xs font-medium text-foreground truncate">{item.intersection}</div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                  <span>{item.area}</span>
                  <span>•</span>
                  <span>{item.lastChecked}</span>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[9px] text-muted-foreground font-mono">
          <span>Source: CoCT Traffic</span>
          <span className="text-emerald-400">Live monitoring</span>
        </div>
      </div>
    </div>
  );
};

export default RobotsStatusPanel;
