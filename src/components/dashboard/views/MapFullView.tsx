import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, MapPin, Layers, Locate, Plus, Minus, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { ViewId } from '../GridifyDashboard';
import TimeRiskStrip from '../widgets/TimeRiskStrip';
import AreaIntelCard from '../widgets/AreaIntelCard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const crimeTypes = [
  { id: 'all', label: 'All', active: true },
  { id: 'theft', label: 'Theft', active: false },
  { id: 'robbery', label: 'Robbery', active: false },
  { id: 'assault', label: 'Assault', active: false },
  { id: 'gbv', label: 'GBV', active: false },
  { id: 'drugs', label: 'Drugs', active: false },
  { id: 'hijacking', label: 'Hijacking', active: false },
];

const MapFullView = memo(({}: Props) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="relative -mx-4 -my-6 sm:-mx-12 sm:-my-10" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Map area */}
      <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{
          background: 'radial-gradient(circle at 45% 45%, hsl(var(--primary) / 0.4), transparent 50%)'
        }} />
        <div className="text-center z-10">
          <Map className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Full-screen crime map</p>
          <p className="text-xs text-muted-foreground mt-1">Spatial navigation view</p>
        </div>
      </div>

      {/* Top search bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search suburb..."
            className="pl-10 bg-card/90 backdrop-blur border-border rounded-xl h-10"
          />
        </div>
        <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors">
          <Layers className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Map controls */}
      <div className="absolute top-16 right-3 z-20 flex flex-col gap-2">
        <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors">
          <Plus className="w-4 h-4 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors">
          <Minus className="w-4 h-4 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors">
          <Locate className="w-4 h-4 text-primary" />
        </button>
      </div>

      {/* Legend pill */}
      <button
        onClick={() => setShowLegend(!showLegend)}
        className="absolute bottom-20 left-3 z-20 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur border border-border text-xs font-medium text-foreground hover:bg-card transition-colors"
      >
        <MapPin className="w-3 h-3 inline mr-1.5" />
        Crime Types
      </button>

      {showLegend && (
        <div className="absolute bottom-32 left-3 z-20 p-3 rounded-xl bg-card/95 backdrop-blur border border-border animate-fade-in w-48">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Legend</p>
          <div className="space-y-1.5">
            {[
              { label: 'Theft', color: 'bg-safety-yellow' },
              { label: 'Robbery', color: 'bg-safety-orange' },
              { label: 'Assault', color: 'bg-safety-red' },
              { label: 'GBV', color: 'bg-[hsl(270,95%,75%)]' },
              { label: 'Drugs', color: 'bg-muted-foreground' },
              { label: 'Hijacking', color: 'bg-destructive' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                <span className="text-xs text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom incident sheet (collapsed) */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-card/95 backdrop-blur border-t border-border rounded-t-2xl px-4 pt-3 pb-4">
          <div className="w-10 h-1 rounded-full bg-border mx-auto mb-3" />

          {/* Time-of-day risk pills */}
          <TimeRiskStrip variant="compact" className="mb-3" />

          {/* Crime type filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {crimeTypes.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                  activeFilter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Area intelligence search */}
          <div className="mt-3 border-t border-border pt-3">
            <AreaIntelCard variant="popover" />
          </div>

          <p className="text-xs text-muted-foreground mt-2">Drag up to see incident list</p>
        </div>
      </div>
    </div>
  );
});

MapFullView.displayName = 'MapFullView';
export default MapFullView;
