import { useState } from 'react';
import { Mountain, MapPin, Phone, ChevronDown, ChevronUp, AlertCircle, Clock, Shield } from 'lucide-react';
import { touristSites, TouristSite } from '@/data/suburbIntelligence';
import { cn } from '@/lib/utils';

const TouristProtocolsPanel = () => {
  const [expandedSite, setExpandedSite] = useState<string | null>(null);

  const getTypeIcon = (type: TouristSite['type']) => {
    switch (type) {
      case 'hiking': return <Mountain className="w-3.5 h-3.5" />;
      case 'beach': return <MapPin className="w-3.5 h-3.5" />;
      default: return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const getTypeColor = (type: TouristSite['type']) => {
    switch (type) {
      case 'hiking': return 'text-emerald-400 bg-emerald-500/20';
      case 'attraction': return 'text-purple-400 bg-purple-500/20';
      case 'beach': return 'text-cyan-400 bg-cyan-500/20';
      case 'landmark': return 'text-amber-400 bg-amber-500/20';
      default: return 'text-primary bg-primary/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Tourist Safety Protocols</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-amber-400">
            <Clock className="w-3 h-3" />
            Updated Live
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {/* Sites List */}
        <div className="space-y-1.5 max-h-[250px] overflow-y-auto scrollbar-hide">
          {touristSites.map(site => (
            <div 
              key={site.id}
              className="bg-background/50 rounded border border-border/30 overflow-hidden"
            >
              <button
                onClick={() => setExpandedSite(expandedSite === site.id ? null : site.id)}
                className="w-full flex items-center justify-between p-2 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={cn('p-1 rounded', getTypeColor(site.type))}>
                    {getTypeIcon(site.type)}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium text-foreground">{site.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono capitalize">{site.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm font-bold', getScoreColor(site.safety_score))}>
                    {site.safety_score}
                  </span>
                  {expandedSite === site.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Protocols */}
              {expandedSite === site.id && (
                <div className="px-3 pb-3 space-y-2 border-t border-border/30 pt-2">
                  {/* Protocols */}
                  <div className="space-y-1">
                    {site.protocols.map((protocol, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[10px]">
                        <AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{protocol}</span>
                      </div>
                    ))}
                  </div>

                  {/* Emergency Contact */}
                  <a
                    href={`tel:${site.emergency_contact.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 p-2 bg-destructive/10 hover:bg-destructive/20 rounded border border-destructive/30 transition-colors mt-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-destructive" />
                    <div className="flex-1">
                      <div className="text-[10px] font-medium text-foreground">{site.emergency_name}</div>
                      <div className="text-[9px] text-muted-foreground font-mono">{site.emergency_contact}</div>
                    </div>
                    <Shield className="w-3.5 h-3.5 text-destructive" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mountain Rescue Quick Dial */}
        <a
          href="tel:0214807700"
          className="flex items-center gap-3 p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Mountain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-foreground">Mountain Rescue</div>
            <div className="text-[10px] text-muted-foreground font-mono">Emergency: 021 480 7700</div>
          </div>
        </a>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[9px] text-muted-foreground font-mono">
          <span>Source: SANParks / CoCT</span>
          <span className="text-amber-400">Safety protocols active</span>
        </div>
      </div>
    </div>
  );
};

export default TouristProtocolsPanel;
