import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, Factory, Home, Car, TrendingDown, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const sectorData = [
  { sector: 'Transport', scope1: 420, scope2: 180, scope3: 310 },
  { sector: 'Residential', scope1: 120, scope2: 380, scope3: 90 },
  { sector: 'Commercial', scope1: 200, scope2: 450, scope3: 250 },
  { sector: 'Industrial', scope1: 680, scope2: 290, scope3: 520 },
  { sector: 'Waste', scope1: 150, scope2: 30, scope3: 70 },
];

const reductionProjects = [
  { name: 'Solar rooftop rollout – Southern Suburbs', tons: 12400, cost: 'R24M', roi: '3.2 years', priority: 'High' },
  { name: 'MyCiti fleet electrification Phase 2', tons: 8900, cost: 'R180M', roi: '5.1 years', priority: 'High' },
  { name: 'Building retrofit program – CBD', tons: 6200, cost: 'R45M', roi: '4.8 years', priority: 'Medium' },
  { name: 'Methane capture – Vissershok Landfill', tons: 4800, cost: 'R18M', roi: '2.1 years', priority: 'High' },
  { name: 'Urban tree canopy expansion', tons: 2100, cost: 'R8M', roi: '7+ years', priority: 'Low' },
];

const pieData = [
  { name: 'Scope 1', value: 1570, color: 'hsl(var(--destructive))' },
  { name: 'Scope 2', value: 1330, color: 'hsl(var(--primary))' },
  { name: 'Scope 3', value: 1240, color: 'hsl(var(--muted-foreground))' },
];

export default function CarbonDashboardView() {
  const totalEmissions = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Carbon Accounting & Net-Zero Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time Scope 1/2/3 emissions · AI reduction engine · Net-zero tracker</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Emissions', value: `${(totalEmissions / 1000).toFixed(1)}k tCO₂e`, icon: Factory, color: 'text-destructive' },
          { label: 'YoY Reduction', value: '-4.2%', icon: TrendingDown, color: 'text-emerald-500' },
          { label: 'Net-Zero Target', value: '2050', icon: Target, color: 'text-primary' },
          { label: 'Progress', value: '18%', icon: Leaf, color: 'text-emerald-500' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <k.icon className={`w-5 h-5 ${k.color}`} />
              <div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Emissions by Sector (tCO₂e)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <XAxis dataKey="sector" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="scope1" stackId="a" fill="hsl(var(--destructive))" radius={[0, 0, 0, 0]} name="Scope 1" animationDuration={1200} animationBegin={0} animationEasing="ease-out" />
                  <Bar dataKey="scope2" stackId="a" fill="hsl(var(--primary))" name="Scope 2" animationDuration={1200} animationBegin={200} animationEasing="ease-out" />
                  <Bar dataKey="scope3" stackId="a" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Scope 3" animationDuration={1200} animationBegin={400} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Scope Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3} animationDuration={800} animationBegin={0} animationEasing="ease-out">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map(d => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">AI Carbon-Reduction Opportunities</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {reductionProjects.map(p => (
            <div key={p.name} className="flex items-center gap-3 px-4 py-3">
              <Leaf className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.cost} · ROI {p.roi}</div>
              </div>
              <span className="text-sm font-bold text-emerald-500 shrink-0">-{(p.tons / 1000).toFixed(1)}k t</span>
              <Badge variant={p.priority === 'High' ? 'default' : 'outline'} className="text-[10px]">{p.priority}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
