import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wrench, AlertTriangle, TrendingDown, DollarSign, Zap, Droplets, Lamp, Construction } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface AssetRisk {
  id: string;
  asset: string;
  type: 'road' | 'pipe' | 'bridge' | 'streetlight';
  ward: number;
  riskScore: number;
  predictedFailure: string;
  estimatedCost: number;
  preventiveCost: number;
  trend: 'rising' | 'stable' | 'declining';
}

const generateAssets = (): AssetRisk[] => [
  { id: '1', asset: 'N2 Southbound – Km 14.3', type: 'road', ward: 57, riskScore: 92, predictedFailure: '3 days', estimatedCost: 450000, preventiveCost: 85000, trend: 'rising' },
  { id: '2', asset: 'Hout Bay Main – Water Pipe W-2041', type: 'pipe', ward: 74, riskScore: 87, predictedFailure: '5 days', estimatedCost: 320000, preventiveCost: 60000, trend: 'rising' },
  { id: '3', asset: 'Liesbeek River Bridge – B-019', type: 'bridge', ward: 58, riskScore: 78, predictedFailure: '12 days', estimatedCost: 1200000, preventiveCost: 180000, trend: 'stable' },
  { id: '4', asset: 'Voortrekker Rd Streetlight Cluster SL-440', type: 'streetlight', ward: 6, riskScore: 74, predictedFailure: '8 days', estimatedCost: 28000, preventiveCost: 6500, trend: 'declining' },
  { id: '5', asset: 'R300 Interchange – Surface Crack Zone', type: 'road', ward: 19, riskScore: 71, predictedFailure: '14 days', estimatedCost: 580000, preventiveCost: 110000, trend: 'stable' },
  { id: '6', asset: 'Muizenberg – Sewer Line S-1187', type: 'pipe', ward: 64, riskScore: 68, predictedFailure: '18 days', estimatedCost: 210000, preventiveCost: 45000, trend: 'declining' },
  { id: '7', asset: 'Koeberg Rd Streetlight SL-312', type: 'streetlight', ward: 4, riskScore: 55, predictedFailure: '25 days', estimatedCost: 15000, preventiveCost: 4000, trend: 'stable' },
];

const riskTrendData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  roads: 40 + Math.sin(i * 0.3) * 15 + i * 0.8,
  pipes: 35 + Math.cos(i * 0.25) * 10 + i * 0.5,
  bridges: 20 + Math.sin(i * 0.15) * 8 + i * 0.3,
  lights: 30 + Math.cos(i * 0.4) * 12,
}));

const typeIcon = (t: string) => {
  switch (t) {
    case 'road': return <Construction className="w-4 h-4" />;
    case 'pipe': return <Droplets className="w-4 h-4" />;
    case 'bridge': return <Wrench className="w-4 h-4" />;
    case 'streetlight': return <Lamp className="w-4 h-4" />;
    default: return <Wrench className="w-4 h-4" />;
  }
};

const riskColor = (score: number) => {
  if (score >= 80) return 'text-destructive';
  if (score >= 60) return 'text-amber-500';
  return 'text-emerald-500';
};

export default function PredictiveMaintenanceView() {
  const [assets] = useState(generateAssets);
  const totalReactive = assets.reduce((s, a) => s + a.estimatedCost, 0);
  const totalPreventive = assets.reduce((s, a) => s + a.preventiveCost, 0);
  const savings = totalReactive - totalPreventive;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Predictive Infrastructure Maintenance</h2>
        <p className="text-sm text-muted-foreground mt-1">AI-predicted failures 7–30 days out · Prioritized work orders</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'High-Risk Assets', value: assets.filter(a => a.riskScore >= 75).length.toString(), icon: AlertTriangle, color: 'text-destructive' },
          { label: 'Reactive Cost', value: `R${(totalReactive / 1e6).toFixed(1)}M`, icon: DollarSign, color: 'text-destructive' },
          { label: 'Preventive Cost', value: `R${(totalPreventive / 1e6).toFixed(1)}M`, icon: Wrench, color: 'text-primary' },
          { label: 'Projected Savings', value: `R${(savings / 1e6).toFixed(1)}M`, icon: TrendingDown, color: 'text-emerald-500' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}><kpi.icon className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">{kpi.label}</div>
                <div className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk trend chart */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">30-Day Failure Risk Forecast</CardTitle></CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="roadG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/><stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0}/></linearGradient>
                  <linearGradient id="pipeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="roads" stroke="hsl(var(--destructive))" fill="url(#roadG)" strokeWidth={2} name="Roads" animationDuration={1000} animationBegin={0} animationEasing="ease-out" />
                <Area type="monotone" dataKey="pipes" stroke="hsl(var(--primary))" fill="url(#pipeG)" strokeWidth={2} name="Pipes" animationDuration={1000} animationBegin={200} animationEasing="ease-out" />
                <Area type="monotone" dataKey="bridges" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Bridges" animationDuration={1000} animationBegin={400} animationEasing="ease-out" />
                <Area type="monotone" dataKey="lights" stroke="#6366f1" fill="none" strokeWidth={1.5} name="Lights" animationDuration={1000} animationBegin={600} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Work Order Queue */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Prioritized Work Orders</CardTitle></CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y divide-border">
              {assets.map((a, i) => (
                <div key={a.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                  <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                  <div className="p-1.5 rounded bg-muted">{typeIcon(a.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.asset}</div>
                    <div className="text-xs text-muted-foreground">Ward {a.ward} · Failure in ~{a.predictedFailure}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-bold ${riskColor(a.riskScore)}`}>{a.riskScore}%</div>
                    <Progress value={a.riskScore} className="w-16 h-1.5 mt-1" />
                  </div>
                  <Badge variant={a.riskScore >= 80 ? 'destructive' : a.riskScore >= 60 ? 'secondary' : 'outline'} className="text-[10px] shrink-0">
                    {a.riskScore >= 80 ? 'CRITICAL' : a.riskScore >= 60 ? 'HIGH' : 'MEDIUM'}
                  </Badge>
                  <div className="text-right shrink-0 hidden md:block">
                    <div className="text-[10px] text-muted-foreground line-through">R{(a.estimatedCost / 1000).toFixed(0)}k</div>
                    <div className="text-xs font-medium text-emerald-500">R{(a.preventiveCost / 1000).toFixed(0)}k</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
