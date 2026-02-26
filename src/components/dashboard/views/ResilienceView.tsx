import { memo } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, Droplets, Flame, Wind, Shield, Radio, MapPin } from 'lucide-react';

// Simulated resilience data per region
const resilienceData: Record<string, { loadshedding: number; waterRisk: string; floodRisk: string; fireRisk: string; alerts: { title: string; severity: string; region: string }[] }> = {
  'cape-town': {
    loadshedding: 2,
    waterRisk: 'Low',
    floodRisk: 'Moderate',
    fireRisk: 'High',
    alerts: [
      { title: 'Wildfire warning: Stellenbosch hills', severity: 'high', region: 'Western Cape' },
      { title: 'Dam levels stable at 78%', severity: 'low', region: 'Western Cape' },
    ],
  },
  'johannesburg': {
    loadshedding: 4,
    waterRisk: 'Moderate',
    floodRisk: 'Low',
    fireRisk: 'Low',
    alerts: [
      { title: 'Stage 4 load-shedding until 22:00', severity: 'high', region: 'Gauteng' },
      { title: 'Water pressure low in Sandton', severity: 'medium', region: 'Gauteng' },
    ],
  },
  'durban': {
    loadshedding: 2,
    waterRisk: 'High',
    floodRisk: 'High',
    fireRisk: 'Low',
    alerts: [
      { title: 'Flash flood watch: eThekwini coast', severity: 'high', region: 'KwaZulu-Natal' },
      { title: 'Infrastructure recovery: 67% complete', severity: 'medium', region: 'KwaZulu-Natal' },
    ],
  },
};

const riskColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'high': return 'text-red-400';
    case 'moderate': return 'text-amber-400';
    default: return 'text-emerald-400';
  }
};

const ResilienceView = memo(() => {
  const { activeRegion, isNationalView } = useRegion();
  const data = resilienceData[activeRegion.id] || resilienceData['cape-town'];
  const allAlerts = isNationalView
    ? Object.values(resilienceData).flatMap(d => d.alerts)
    : data.alerts;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          African Resilience & Crisis Layer
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isNationalView ? 'National early-warning overview' : `${activeRegion.name} — hyper-local resilience intelligence`}
        </p>
      </div>

      {/* Risk cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4 text-center">
            <Zap className="w-8 h-8 mx-auto text-amber-400 mb-2" />
            <p className="text-2xl font-black text-foreground">Stage {data.loadshedding}</p>
            <p className="text-xs text-muted-foreground mt-1">Load-shedding</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4 text-center">
            <Droplets className={`w-8 h-8 mx-auto mb-2 ${riskColor(data.waterRisk)}`} />
            <p className={`text-2xl font-black ${riskColor(data.waterRisk)}`}>{data.waterRisk}</p>
            <p className="text-xs text-muted-foreground mt-1">Water Scarcity</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4 text-center">
            <Wind className={`w-8 h-8 mx-auto mb-2 ${riskColor(data.floodRisk)}`} />
            <p className={`text-2xl font-black ${riskColor(data.floodRisk)}`}>{data.floodRisk}</p>
            <p className="text-xs text-muted-foreground mt-1">Flood Risk</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4 text-center">
            <Flame className={`w-8 h-8 mx-auto mb-2 ${riskColor(data.fireRisk)}`} />
            <p className={`text-2xl font-black ${riskColor(data.fireRisk)}`}>{data.fireRisk}</p>
            <p className="text-xs text-muted-foreground mt-1">Wildfire Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Active alerts */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Active Alerts
            <Badge variant="secondary" className="ml-auto">{allAlerts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allAlerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-border/50">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.severity === 'high' ? 'bg-red-400' : alert.severity === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {alert.region}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {alert.severity}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cross-region coordinator */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" />
            Cross-Region Coordination Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">
              Simulate: "What if Cape Town shares 20 MW with Durban during Stage 6?"
            </p>
            <button className="mt-3 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Run Simulation
            </button>
            <p className="text-[10px] text-muted-foreground mt-2">
              All simulations use anonymized, aggregated data only • POPIA-compliant
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Offline & SMS fallback notice */}
      <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 text-center">
        <p className="text-xs text-muted-foreground">
          🔒 All alerts include evacuation routes and offline SMS fallback • Data never leaves its region unless explicitly aggregated and anonymized
        </p>
      </div>
    </div>
  );
});

ResilienceView.displayName = 'ResilienceView';
export default ResilienceView;
