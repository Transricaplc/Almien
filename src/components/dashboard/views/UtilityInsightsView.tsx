import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Droplets, Flame, AlertTriangle, TrendingDown, Lightbulb } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const anomalies = [
  { id: '1', location: 'Block 14 – Rondebosch', type: 'electricity', anomaly: 'Spike: 340% above baseline', severity: 'Critical', action: 'Possible meter bypass' },
  { id: '2', location: 'Pipe W-3021 – Constantia', type: 'water', anomaly: '18L/hr night flow', severity: 'High', action: 'Suspected leak' },
  { id: '3', location: 'Unit 8B – Sea Point', type: 'electricity', anomaly: '220% above avg', severity: 'Medium', action: 'HVAC fault probable' },
  { id: '4', location: 'Block 7 – Bellville', type: 'water', anomaly: 'Gradual increase +12%/week', severity: 'Medium', action: 'Aging pipe degradation' },
  { id: '5', location: 'Ward 19 Gas Main', type: 'gas', anomaly: 'Pressure drop detected', severity: 'High', action: 'Auto-alert sent to utility' },
];

const usageData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  electricity: 120 + Math.random() * 40,
  water: 80 + Math.random() * 30,
  gas: 30 + Math.random() * 15,
}));

const tips = [
  { tip: 'Shift washing machine to off-peak (22:00–06:00)', saving: 'R180/mo' },
  { tip: 'Set geyser timer to 2 hours before use', saving: 'R350/mo' },
  { tip: 'Fix running toilet in bathroom 2', saving: 'R120/mo' },
];

export default function UtilityInsightsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Smart Utility & Billing Insights</h2>
        <p className="text-sm text-muted-foreground mt-1">Consumption anomalies · AI leak/theft detection · Saving tips</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Anomalies Detected', value: anomalies.length.toString(), icon: AlertTriangle, color: 'text-amber-500' },
          { label: 'Est. Monthly Savings', value: 'R650', icon: TrendingDown, color: 'text-emerald-500' },
          { label: 'Leak Alerts Sent', value: '2', icon: Droplets, color: 'text-primary' },
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

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Weekly Consumption (kWh / kL / m³)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="electricity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Electricity" animationDuration={1200} animationBegin={0} animationEasing="ease-out" />
                <Bar dataKey="water" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Water" animationDuration={1200} animationBegin={200} animationEasing="ease-out" />
                <Bar dataKey="gas" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Gas" animationDuration={1200} animationBegin={400} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Anomaly Alerts</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {anomalies.map(a => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3">
              {a.type === 'electricity' ? <Zap className="w-4 h-4 text-amber-500 shrink-0" /> : a.type === 'water' ? <Droplets className="w-4 h-4 text-primary shrink-0" /> : <Flame className="w-4 h-4 text-destructive shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{a.location}</div>
                <div className="text-xs text-muted-foreground">{a.anomaly} · {a.action}</div>
              </div>
              <Badge variant={a.severity === 'Critical' ? 'destructive' : a.severity === 'High' ? 'secondary' : 'outline'} className="text-[10px]">{a.severity}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" />Saving Tips</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {tips.map(t => (
            <div key={t.tip} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 text-sm">{t.tip}</div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-600/30 text-[10px]">{t.saving}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
