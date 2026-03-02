import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wind, Sun, Volume2, Thermometer, Route, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const hourlyExposure = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  aqi: 20 + Math.sin((h - 12) * 0.4) * 30 + (h >= 7 && h <= 9 ? 25 : 0) + (h >= 16 && h <= 18 ? 20 : 0),
  noise: 30 + (h >= 8 && h <= 18 ? 30 : 0) + Math.random() * 10,
  uv: h >= 6 && h <= 18 ? Math.sin((h - 6) * Math.PI / 12) * 10 : 0,
  heat: 18 + Math.sin((h - 6) * Math.PI / 18) * 14,
}));

const weeklyReport = [
  { metric: 'Pollution', score: 62 },
  { metric: 'Noise', score: 48 },
  { metric: 'UV', score: 75 },
  { metric: 'Heat Stress', score: 40 },
  { metric: 'Carbon', score: 55 },
];

const routeSuggestions = [
  { name: 'Green Point → CBD via Fan Walk', co2: '0.8kg', exposure: 'Low', mode: 'Cycle', time: '18 min' },
  { name: 'Observatory → Rondebosch via River Path', co2: '0.2kg', exposure: 'Very Low', mode: 'Walk', time: '25 min' },
  { name: 'Bellville → Stellenbosch via R304', co2: '2.1kg', exposure: 'Medium', mode: 'Bus', time: '35 min' },
];

export default function ExposureTrackerView() {
  const avgAqi = Math.round(hourlyExposure.reduce((s, h) => s + h.aqi, 0) / 24);
  const avgNoise = Math.round(hourlyExposure.reduce((s, h) => s + h.noise, 0) / 24);
  const maxUv = Math.round(Math.max(...hourlyExposure.map(h => h.uv)));
  const avgHeat = Math.round(hourlyExposure.reduce((s, h) => s + h.heat, 0) / 24);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Personal Urban Exposure Tracker</h2>
        <p className="text-sm text-muted-foreground mt-1">Your daily exposure to pollution, noise, heat & UV · Route-aware health insights</p>
      </div>

      {/* Today's Exposure KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg AQI', value: avgAqi, max: 100, icon: Wind, unit: '', color: avgAqi > 50 ? 'text-amber-500' : 'text-emerald-500' },
          { label: 'Avg Noise', value: avgNoise, max: 85, icon: Volume2, unit: 'dB', color: avgNoise > 60 ? 'text-amber-500' : 'text-emerald-500' },
          { label: 'Peak UV', value: maxUv, max: 11, icon: Sun, unit: '', color: maxUv > 7 ? 'text-destructive' : 'text-amber-500' },
          { label: 'Avg Temp', value: avgHeat, max: 40, icon: Thermometer, unit: '°C', color: avgHeat > 30 ? 'text-destructive' : 'text-foreground' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <k.icon className={`w-4 h-4 ${k.color}`} />
                <span className="text-xs text-muted-foreground">{k.label}</span>
              </div>
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}<span className="text-sm font-normal text-muted-foreground ml-1">{k.unit}</span></div>
              <Progress value={(k.value / k.max) * 100} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* 24h Timeline */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">24h Exposure Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyExposure}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="aqi" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} name="AQI" animationDuration={1000} animationBegin={0} animationEasing="ease-out" />
                  <Area type="monotone" dataKey="noise" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} name="Noise (dB)" animationDuration={1000} animationBegin={200} animationEasing="ease-out" />
                  <Area type="monotone" dataKey="uv" stroke="#ef4444" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="UV Index" animationDuration={1000} animationBegin={400} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Radar */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Weekly Health Report</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={weeklyReport} outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar name="Exposure" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} animationDuration={1000} animationBegin={0} animationEasing="ease-out" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low-Carbon Route Suggestions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><Route className="w-4 h-4 text-emerald-500" />Low-Exposure Route Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {routeSuggestions.map(r => (
              <div key={r.name} className="flex items-center gap-4 px-4 py-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.mode} · {r.time}</div>
                </div>
                <Badge variant="outline" className="text-emerald-600 border-emerald-600/30 text-[10px]">{r.exposure}</Badge>
                <span className="text-xs font-mono text-muted-foreground shrink-0">{r.co2} CO₂</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
