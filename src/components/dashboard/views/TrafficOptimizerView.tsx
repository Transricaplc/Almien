import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrafficCone, Zap, Leaf, Clock, Download, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Intersection {
  id: string;
  name: string;
  baseGreen: number;
  currentDelay: number;
  vehiclesPerHour: number;
}

const intersections: Intersection[] = [
  { id: '1', name: 'N1/N7 Interchange', baseGreen: 45, currentDelay: 120, vehiclesPerHour: 4200 },
  { id: '2', name: 'Voortrekker/Koeberg', baseGreen: 35, currentDelay: 85, vehiclesPerHour: 3100 },
  { id: '3', name: 'Main/Hertzog Blvd', baseGreen: 40, currentDelay: 95, vehiclesPerHour: 3600 },
  { id: '4', name: 'Strand/Adderley', baseGreen: 30, currentDelay: 70, vehiclesPerHour: 2800 },
  { id: '5', name: 'Jan Smuts/Klipfontein', baseGreen: 38, currentDelay: 78, vehiclesPerHour: 2400 },
];

export default function TrafficOptimizerView() {
  const [greenAdjust, setGreenAdjust] = useState([0]); // -20 to +20s
  const [isSimulating, setIsSimulating] = useState(false);
  const adj = greenAdjust[0];

  const simulation = useMemo(() => {
    const reductionFactor = 1 - (adj / 100);
    const totalBaseDelay = intersections.reduce((s, i) => s + i.currentDelay, 0);
    const newDelay = totalBaseDelay * reductionFactor;
    const delaySaved = totalBaseDelay - newDelay;
    const co2Saved = delaySaved * 0.42; // kg per second of idle saved
    const fuelSaved = delaySaved * 0.015; // litres
    return { delaySaved: Math.round(delaySaved), co2Saved: co2Saved.toFixed(1), fuelSaved: fuelSaved.toFixed(1), reductionPct: ((1 - reductionFactor) * 100).toFixed(1) };
  }, [adj]);

  const chartData = intersections.map(i => {
    const newDelay = Math.max(10, i.currentDelay * (1 - adj / 100));
    return { name: i.name.split('/')[0], before: i.currentDelay, after: Math.round(newDelay) };
  });

  const hourlyFlow = Array.from({ length: 24 }, (_, h) => {
    const base = 1000 + Math.sin((h - 8) * 0.5) * 2000 + (h >= 7 && h <= 9 ? 1500 : 0) + (h >= 16 && h <= 18 ? 1800 : 0);
    const optimized = base * (1 + adj / 200);
    return { hour: `${h}:00`, baseline: Math.max(0, Math.round(base)), optimized: Math.max(0, Math.round(optimized)) };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dynamic Traffic Signal Optimizer</h2>
        <p className="text-sm text-muted-foreground mt-1">Simulate adaptive signal timing · See city-wide impact in real time</p>
      </div>

      {/* What-if Slider */}
      <Card className="border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Play className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">What-If Simulator</h3>
            <Badge variant="outline" className="ml-auto">{adj > 0 ? '+' : ''}{adj}s green time</Badge>
          </div>
          <Slider value={greenAdjust} onValueChange={setGreenAdjust} min={-20} max={20} step={1} className="mb-4" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>−20s (shorter greens)</span>
            <span className="font-medium text-foreground">Baseline</span>
            <span>+20s (longer greens)</span>
          </div>
        </CardContent>
      </Card>

      {/* Impact KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Congestion Reduction', value: `${simulation.reductionPct}%`, icon: TrafficCone, color: 'text-primary' },
          { label: 'Delay Saved', value: `${simulation.delaySaved}s`, icon: Clock, color: 'text-amber-500' },
          { label: 'CO₂ Reduction', value: `${simulation.co2Saved}kg`, icon: Leaf, color: 'text-emerald-500' },
          { label: 'Fuel Saved', value: `${simulation.fuelSaved}L`, icon: Zap, color: 'text-primary' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Before/After Delay */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Intersection Delay: Before vs After</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="s" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="before" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Before" opacity={0.5} animationDuration={1200} animationBegin={0} animationEasing="ease-out" />
                  <Bar dataKey="after" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="After" animationDuration={1200} animationBegin={200} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Flow */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">24h Traffic Throughput</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyFlow}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Baseline" animationDuration={1000} animationBegin={0} animationEasing="ease-out" />
                  <Line type="monotone" dataKey="optimized" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Optimized" animationDuration={1000} animationBegin={200} animationEasing="ease-out" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" />Export Signal Timing Plan</Button>
      </div>
    </div>
  );
}
