import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  X, Crown, Building2, Shield, Truck, Plane, MapPin, 
  FileText, Calculator, Route, Calendar, Star, ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import SafetyScoreBadge from './SafetyScoreBadge';
import { capeTownAreas } from '@/data/capeTownSafetyData';

interface ProfessionalToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

type ToolMode = 'real-estate' | 'insurance' | 'logistics' | 'tourism';

const modes: { id: ToolMode; label: string; icon: typeof Building2; desc: string }[] = [
  { id: 'real-estate', label: 'Real Estate', icon: Building2, desc: 'Property safety reports & analysis' },
  { id: 'insurance', label: 'Insurance', icon: Shield, desc: 'Risk assessment & premium data' },
  { id: 'logistics', label: 'Logistics', icon: Truck, desc: 'Route planning & zone analysis' },
  { id: 'tourism', label: 'Tourism', icon: Plane, desc: 'Itinerary builder & safety checker' },
];

const ProfessionalTools = memo(({ isOpen, onClose }: ProfessionalToolsProps) => {
  const [activeMode, setActiveMode] = useState<ToolMode>('real-estate');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const topAreas = [...capeTownAreas].sort((a, b) => b.safetyScore - a.safetyScore).slice(0, 5);

  return (
    <div className="fixed inset-0 z-[90] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-elite-from" />
            <h2 className="text-lg font-bold text-foreground">Professional Tools</h2>
            <span className="text-[8px] bg-elite-gradient text-white px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-border overflow-x-auto px-2">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors",
                activeMode === mode.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <mode.icon className="w-3.5 h-3.5" />
              {mode.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMode === 'real-estate' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Property Safety Report</h3>
                <div className="flex gap-2">
                  <Input placeholder="Enter property address..." value={address} onChange={e => setAddress(e.target.value)} className="flex-1" />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Analyze
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Investment Score', value: '8.2/10', icon: Star },
                  { label: '3-Year Trend', value: '+12%', icon: Building2 },
                  { label: 'Nearby Schools', value: '4 within 2km', icon: MapPin },
                  { label: 'Report Ready', value: 'Generate PDF', icon: FileText },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <item.icon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Comparable Safe Areas</h3>
                <div className="space-y-2">
                  {topAreas.map(area => (
                    <div key={area.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-foreground">{area.name}</div>
                        <div className="text-xs text-muted-foreground">{area.incidentCount.last30Days} incidents/month</div>
                      </div>
                      <SafetyScoreBadge score={area.safetyScore} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeMode === 'insurance' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Risk Level', value: 'Low-Medium', color: 'text-safety-yellow' },
                  { label: 'Claims Index', value: '0.72', color: 'text-primary' },
                  { label: 'Premium Adjustment', value: '-8%', color: 'text-safety-green' },
                  { label: 'Coverage Recommendation', value: 'Standard+', color: 'text-foreground' },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                    <p className={cn("text-sm font-bold mt-1", item.color)}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Risk Assessment Calculator</h3>
                <div className="p-4 rounded-lg border border-border bg-secondary/20 space-y-3">
                  <Input placeholder="Property value (ZAR)" type="number" />
                  <Input placeholder="Building type" />
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Calculate Risk
                  </button>
                </div>
              </div>

              <button className="w-full py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Export Actuarial Data
              </button>
            </>
          )}

          {activeMode === 'logistics' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Multi-Stop Route Planner</h3>
                <div className="space-y-2">
                  <Input placeholder="Start location" />
                  <Input placeholder="Stop 1" />
                  <Input placeholder="Stop 2" />
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Route className="w-4 h-4" />
                    Optimize Route
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Route Safety', value: '7.8' },
                  { label: 'Est. Duration', value: '2h 15m' },
                  { label: 'Risk Zones', value: '2' },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                    <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Delivery Zone Analysis</h3>
                <div className="space-y-2">
                  {capeTownAreas.slice(0, 4).map(area => (
                    <div key={area.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{area.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Best: 9am-3pm</span>
                        <SafetyScoreBadge score={area.safetyScore} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeMode === 'tourism' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Multi-Day Itinerary Builder</h3>
                <div className="space-y-2">
                  {['Day 1: Waterfront & Table Mountain', 'Day 2: Camps Bay & Constantia Wines', 'Day 3: Simon\'s Town & Muizenberg'].map((day, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{day}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Guided Tour Templates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Family-Friendly', days: 3, safety: 8.5 },
                    { name: 'Adventure Seeker', days: 5, safety: 7.2 },
                    { name: 'Cultural Explorer', days: 4, safety: 7.8 },
                    { name: 'Food & Wine Trail', days: 2, safety: 8.8 },
                  ].map(tmpl => (
                    <div key={tmpl.name} className="p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors cursor-pointer">
                      <div className="text-sm font-medium text-foreground">{tmpl.name}</div>
                      <div className="text-xs text-muted-foreground">{tmpl.days} days · Safety {tmpl.safety}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Hidden Gems in Safe Zones</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Kirstenbosch Sunset Concert', area: 'Constantia', score: 9.2 },
                    { name: 'Noordhoek Farm Village', area: 'Noordhoek', score: 8.5 },
                    { name: 'Old Biscuit Mill Saturday', area: 'Woodstock', score: 8.0 },
                  ].map(gem => (
                    <div key={gem.name} className="flex items-center justify-between p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                      <div>
                        <div className="text-sm font-medium text-foreground">{gem.name}</div>
                        <div className="text-xs text-muted-foreground">{gem.area}</div>
                      </div>
                      <SafetyScoreBadge score={gem.score} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ProfessionalTools.displayName = 'ProfessionalTools';
export default ProfessionalTools;
