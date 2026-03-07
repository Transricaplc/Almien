import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(220 18% 10%)',
    border: '1px solid hsl(220 14% 18%)',
    borderRadius: 8,
    fontSize: 12,
    color: 'hsl(210 40% 98%)',
  },
};

const areaRisk = [
  { area: 'Nyanga', crime: 92, traffic: 45 },
  { area: 'Mfuleni', crime: 85, traffic: 38 },
  { area: 'CBD', crime: 78, traffic: 82 },
  { area: 'Khayelitsha', crime: 88, traffic: 35 },
  { area: 'Camps Bay', crime: 22, traffic: 55 },
  { area: 'Sea Point', crime: 35, traffic: 65 },
  { area: 'Stellenbosch', crime: 30, traffic: 42 },
  { area: 'Woodstock', crime: 55, traffic: 70 },
];

const getRiskColor = (value: number) => {
  if (value >= 80) return 'hsl(0 72% 51%)';
  if (value >= 60) return 'hsl(25 95% 53%)';
  if (value >= 40) return 'hsl(48 96% 53%)';
  return 'hsl(142 71% 45%)';
};

const HeatmapCard = () => (
  <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
    <CardHeader className="pb-2 px-4 pt-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Map className="w-4 h-4 text-primary" />
          Live Hotspot Heatmap
        </CardTitle>
        <Badge variant="outline" className="text-[9px] text-muted-foreground border-border/50">
          <Layers className="w-2.5 h-2.5 mr-1" /> Crime + Traffic
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="px-4 pb-4 space-y-4">
      {/* Heatmap grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
        {areaRisk.map(a => (
          <div
            key={a.area}
            className="aspect-square rounded-md flex flex-col items-center justify-center p-1 transition-transform duration-300 hover:scale-110 cursor-pointer"
            style={{ backgroundColor: getRiskColor(a.crime), opacity: 0.7 + (a.crime / 300) }}
            title={`${a.area}: Crime ${a.crime}, Traffic ${a.traffic}`}
          >
            <span className="text-[8px] text-white font-bold leading-none text-center drop-shadow">{a.area}</span>
            <span className="text-[10px] text-white font-bold tabular-nums drop-shadow">{a.crime}</span>
          </div>
        ))}
      </div>

      {/* Bar chart overlay */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={areaRisk} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="area" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="crime" name="Crime Risk" animationDuration={1000} animationEasing="ease-out" animationBegin={0} isAnimationActive={true} radius={[3, 3, 0, 0]}>
              {areaRisk.map((entry, i) => <Cell key={i} fill={getRiskColor(entry.crime)} />)}
            </Bar>
            <Bar dataKey="traffic" name="Traffic" fill="hsl(var(--primary))" fillOpacity={0.5} animationDuration={1000} animationEasing="ease-out" animationBegin={200} isAnimationActive={true} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(0 72% 51%)' }} />High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(25 95% 53%)' }} />Med-High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(48 96% 53%)' }} />Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(142 71% 45%)' }} />Low</span>
      </div>

      <div className="pt-2 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground/70">Western Cape Safety Intelligence • Real-time where available • Verified data only</span>
      </div>
    </CardContent>
  </Card>
);

export default HeatmapCard;
