import { useState } from 'react';
import { Car, Search, Clock, Users, MapPin } from 'lucide-react';
import { taxiRankData } from '@/data/infrastructureData';
import { Input } from '@/components/ui/input';

const TaxiRankPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRank, setExpandedRank] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-400 bg-emerald-500/20';
      case 'busy': return 'text-yellow-400 bg-yellow-500/20';
      case 'closed': return 'text-red-400 bg-red-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const filteredData = searchQuery 
    ? taxiRankData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.routes.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : taxiRankData;

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Taxi Ranks</span>
          </div>
          <span className="text-[10px] font-mono text-orange-400">{taxiRankData.length} RANKS</span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search rank or route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Rank List - always visible scrollbar */}
        <div className="space-y-1.5 max-h-[200px] overflow-y-auto scrollbar-visible">
          {filteredData.map(rank => (
            <div 
              key={rank.id}
              className="bg-background/50 rounded border border-border/30 overflow-hidden"
            >
              <button
                onClick={() => setExpandedRank(expandedRank === rank.id ? null : rank.id)}
                className="w-full flex items-center justify-between p-2 hover:bg-background/80 transition-colors"
              >
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground truncate">{rank.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${getStatusColor(rank.status)}`}>
                      {rank.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {rank.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rank.waitTime}
                    </span>
                  </div>
                </div>
                <Users className="w-4 h-4 text-muted-foreground" />
              </button>
              
              {expandedRank === rank.id && (
                <div className="px-2 pb-2 border-t border-border/30">
                  <div className="text-[10px] text-muted-foreground mt-2 mb-1">Routes:</div>
                  <div className="flex flex-wrap gap-1">
                    {rank.routes.map((route, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-orange-500/10 text-orange-300 text-[9px] rounded">
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[9px] text-muted-foreground font-mono">
          <span>Source: SANTACO</span>
          <span className="text-orange-400">Updated 10 min ago</span>
        </div>
      </div>
    </div>
  );
};

export default TaxiRankPanel;
