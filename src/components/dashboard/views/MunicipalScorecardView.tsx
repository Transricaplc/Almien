import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, TrendingDown, Minus, Download, Globe } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const kpis = [
  { category: 'Safety', metric: 'Crime Index', city: 42, national: 55, peer: 48, trend: 'improving' },
  { category: 'Infrastructure', metric: 'Road Quality', city: 68, national: 52, peer: 61, trend: 'stable' },
  { category: 'Services', metric: 'Water Delivery', city: 89, national: 71, peer: 78, trend: 'improving' },
  { category: 'Environment', metric: 'Air Quality', city: 74, national: 62, peer: 70, trend: 'stable' },
  { category: 'Economy', metric: 'Unemployment', city: 24, national: 32, peer: 28, trend: 'declining' },
  { category: 'Digital', metric: 'e-Service Adoption', city: 56, national: 38, peer: 45, trend: 'improving' },
];

const radarData = kpis.map(k => ({
  metric: k.metric,
  city: k.city,
  national: k.national,
  peer: k.peer,
}));

const benchmarkData = kpis.map(k => ({
  name: k.metric.split(' ')[0],
  city: k.city,
  national: k.national,
  peer: k.peer,
}));

const trendIcon = (t: string) => {
  if (t === 'improving') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (t === 'declining') return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

export default function MunicipalScorecardView() {
  const avgCity = Math.round(kpis.reduce((s, k) => s + k.city, 0) / kpis.length);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Municipal Performance Scorecard</h2>
          <p className="text-sm text-muted-foreground mt-1">360° KPI dashboard · National & peer benchmarks · Public transparency</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" />Export PDF</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{avgCity}</div>
            <div className="text-xs text-muted-foreground mt-1">Overall City Score</div>
            <Progress value={avgCity} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-emerald-500">{kpis.filter(k => k.trend === 'improving').length}</div>
            <div className="text-xs text-muted-foreground mt-1">Improving KPIs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-muted-foreground">{kpis.filter(k => k.city > k.national).length}/{kpis.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Above National Avg</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">City vs National vs Peer</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar name="City" dataKey="city" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} animationDuration={1000} animationBegin={0} animationEasing="ease-out" />
                  <Radar name="National" dataKey="national" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={1} strokeDasharray="4 4" animationDuration={1000} animationBegin={200} animationEasing="ease-out" />
                  <Radar name="Peer Avg" dataKey="peer" stroke="#f59e0b" fill="none" strokeWidth={1.5} animationDuration={1000} animationBegin={400} animationEasing="ease-out" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Benchmark Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} barGap={2}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="city" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Cape Town" animationDuration={1200} animationBegin={0} animationEasing="ease-out" />
                  <Bar dataKey="national" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="National" opacity={0.5} animationDuration={1200} animationBegin={200} animationEasing="ease-out" />
                  <Bar dataKey="peer" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Peer Avg" opacity={0.7} animationDuration={1200} animationBegin={400} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">KPI Detail</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {kpis.map(k => (
            <div key={k.metric} className="flex items-center gap-3 px-4 py-3">
              <Badge variant="outline" className="text-[10px] w-20 justify-center">{k.category}</Badge>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{k.metric}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <div className="text-sm font-bold text-primary">{k.city}</div>
                  <div className="text-[9px] text-muted-foreground">City</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{k.national}</div>
                  <div className="text-[9px] text-muted-foreground">National</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{k.peer}</div>
                  <div className="text-[9px] text-muted-foreground">Peer</div>
                </div>
                {trendIcon(k.trend)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
