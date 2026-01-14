import { useState } from 'react';
import { Plane, PlaneTakeoff, PlaneLanding, Search } from 'lucide-react';
import { flightData } from '@/data/infrastructureData';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FlightStatusPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('outbound');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'text-emerald-400';
      case 'boarding': return 'text-blue-400';
      case 'departed': return 'text-cyan-400';
      case 'arrived': return 'text-emerald-400';
      case 'delayed': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-emerald-500/20';
      case 'boarding': return 'bg-blue-500/20 animate-pulse';
      case 'departed': return 'bg-cyan-500/20';
      case 'arrived': return 'bg-emerald-500/20';
      case 'delayed': return 'bg-yellow-500/20';
      case 'cancelled': return 'bg-red-500/20';
      default: return 'bg-muted';
    }
  };

  const filteredFlights = flightData
    .filter(f => f.type === activeTab)
    .filter(f => 
      !searchQuery || 
      f.flightNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.origin.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">CPT International</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">LIVE</span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'inbound' | 'outbound')} className="w-full">
          <TabsList className="grid grid-cols-2 h-7 bg-background/50">
            <TabsTrigger value="outbound" className="text-[10px] h-6 gap-1 data-[state=active]:bg-primary/20">
              <PlaneTakeoff className="w-3 h-3" />
              Departures
            </TabsTrigger>
            <TabsTrigger value="inbound" className="text-[10px] h-6 gap-1 data-[state=active]:bg-primary/20">
              <PlaneLanding className="w-3 h-3" />
              Arrivals
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search flight, airline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Flight List */}
        <div className="space-y-1 max-h-[160px] overflow-y-auto scrollbar-hide">
          {filteredFlights.map(flight => (
            <div 
              key={flight.id}
              className="grid grid-cols-12 gap-2 items-center p-2 bg-background/50 rounded border border-border/30 text-xs"
            >
              <div className="col-span-3 font-mono font-medium text-foreground">{flight.flightNo}</div>
              <div className="col-span-3 text-muted-foreground truncate">{flight.airline}</div>
              <div className="col-span-2 font-mono text-foreground">
                {activeTab === 'outbound' ? flight.destination : flight.origin}
              </div>
              <div className="col-span-2 font-mono text-muted-foreground">{flight.time}</div>
              <div className="col-span-2 flex justify-end">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${getStatusColor(flight.status)} ${getStatusBg(flight.status)}`}>
                  {flight.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[9px] text-muted-foreground font-mono">
          <span>Source: ACSA</span>
          <span className="text-cyan-400">Real-time</span>
        </div>
      </div>
    </div>
  );
};

export default FlightStatusPanel;
