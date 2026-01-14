import { useState } from 'react';
import { Zap, Search, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { loadsheddingData, capeMetroSuburbs, majorTowns, coastalCentres } from '@/data/infrastructureData';
import { Input } from '@/components/ui/input';

const LoadsheddingPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const allAreas = [...capeMetroSuburbs, ...majorTowns, ...coastalCentres];
  
  const currentStage = 4;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-400 bg-red-500/20';
      case 'scheduled': return 'text-yellow-400 bg-yellow-500/20';
      case 'clear': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-3 h-3" />;
      case 'scheduled': return <Clock className="w-3 h-3" />;
      case 'clear': return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredData = searchQuery 
    ? loadsheddingData.filter(item => 
        item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.postalCode.includes(searchQuery)
      )
    : loadsheddingData;

  const matchedAreas = searchQuery
    ? allAreas.filter(area => 
        area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.postalCode.includes(searchQuery)
      ).slice(0, 3)
    : [];

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Loadshedding</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground">STAGE</span>
            <span className="px-1.5 py-0.5 bg-red-500/30 text-red-400 text-xs font-mono font-bold rounded">
              {currentStage}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search area or postal code (6500-8099)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Area Suggestions */}
        {matchedAreas.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {matchedAreas.map(area => (
              <button
                key={area.name}
                onClick={() => setSearchQuery(area.name)}
                className="px-2 py-0.5 text-[10px] bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
              >
                {area.name} ({area.postalCode})
              </button>
            ))}
          </div>
        )}

        {/* Status List */}
        <div className="space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-hide">
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
                  {item.status === 'clear' ? 'No scheduled outage' : `Next: ${item.nextOutage}`}
                </div>
              </div>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
                <span className="uppercase">{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[9px] text-muted-foreground font-mono">
          <span>Source: Eskom SE Push</span>
          <span className="text-yellow-400">Updated 2 min ago</span>
        </div>
      </div>
    </div>
  );
};

export default LoadsheddingPanel;
