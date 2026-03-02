import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CloudRain, Thermometer, Wind, AlertTriangle, Bell } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const forecastData = Array.from({ length: 48 }, (_, h) => ({
  hour: `+${h}h`,
  floodRisk: Math.max(0, Math.sin((h - 20) * 0.2) * 60 + 20 + (h > 24 ? 15 : 0)),
  heatStress: Math.max(0, Math.sin((h % 24 - 6) * Math.PI / 18) * 40),
  windTunnel: 10 + Math.random() * 25,
}));

const zones = [
  { name: 'Liesbeek River – Obs/Mowbray', risk: 'Critical', score: 88, type: 'Flood' },
  { name: 'CBD – Hertzog Blvd', risk: 'High', score: 72, type: 'Wind Tunnel' },
  { name: 'Cape Flats – Khayelitsha', risk: 'High', score: 69, type: 'Flood' },
  { name: 'Table View – Blouberg', risk: 'Moderate', score: 45, type: 'Heat Stress' },
  { name: 'Hout Bay Valley', risk: 'Moderate', score: 41, type: 'Flash Flood' },
];

export default function MicroclimateView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Hyper-Local Microclimate & Flood Warning</h2>
        <p className="text-sm text-muted-foreground mt-1">1–48 hour block-level forecasts · Flood, heat stress, wind tunnels</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Flood Alerts', value: '3', icon: CloudRain, color: 'text-primary' },
          { label: 'Heat Warnings', value: '1', icon: Thermometer, color: 'text-amber-500' },
          { label: 'Wind Advisories', value: '2', icon: Wind, color: 'text-muted-foreground' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <k.icon className={`w-5 h-5 ${k.color}`} />
              <div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">48-Hour Risk Forecast</CardTitle></CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="floodRisk" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} name="Flood Risk %" animationDuration={1000} animationBegin={0} animationEasing="ease-out" />
                <Area type="monotone" dataKey="heatStress" stroke="#f59e0b" fill="none" strokeWidth={1.5} name="Heat Stress" animationDuration={1000} animationBegin={200} animationEasing="ease-out" />
                <Area type="monotone" dataKey="windTunnel" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={1} strokeDasharray="4 4" name="Wind" animationDuration={1000} animationBegin={400} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">High-Risk Zones</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {zones.map(z => (
            <div key={z.name} className="flex items-center gap-3 px-4 py-3">
              <AlertTriangle className={`w-4 h-4 shrink-0 ${z.score >= 70 ? 'text-destructive' : 'text-amber-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{z.name}</div>
                <div className="text-xs text-muted-foreground">{z.type}</div>
              </div>
              <Progress value={z.score} className="w-16 h-1.5" />
              <Badge variant={z.score >= 70 ? 'destructive' : 'secondary'} className="text-[10px]">{z.risk}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
