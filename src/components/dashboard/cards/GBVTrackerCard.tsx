import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShieldCheck, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const gbvScore = 68;
const gaugeData = [{ value: gbvScore, fill: gbvScore >= 70 ? 'hsl(142 71% 45%)' : gbvScore >= 45 ? 'hsl(48 96% 53%)' : 'hsl(0 72% 51%)' }];

const safeRouteRating = [
  { label: 'Well-lit streets', score: 72 },
  { label: 'CCTV coverage', score: 58 },
  { label: 'Foot patrols', score: 45 },
  { label: 'Safe transport', score: 63 },
];

const GBVTrackerCard = () => (
  <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
    <CardHeader className="pb-2 px-4 pt-4">
      <CardTitle className="text-sm font-semibold flex items-center gap-2">
        <Heart className="w-4 h-4 text-destructive" />
        GBV & Vulnerable Safety
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 pb-4 space-y-3">
      {/* Gauge */}
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="65%" outerRadius="100%" data={gaugeData} startAngle={180} endAngle={0} barSize={10}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
            <RadialBar dataKey="value" cornerRadius={5} animationDuration={1000} animationEasing="ease-out" isAnimationActive={true} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center -mt-4">
        <span className="text-lg font-bold tabular-nums text-foreground">{gbvScore}/100</span>
        <p className="text-[10px] text-muted-foreground">Women & Children Safety Index</p>
      </div>

      {/* Safe Route Factors */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Safe Route Factors</p>
        {safeRouteRating.map(f => (
          <div key={f.label} className="flex items-center gap-2">
            <span className="text-[11px] text-foreground w-24 truncate">{f.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{
                width: `${f.score}%`,
                backgroundColor: f.score >= 65 ? 'hsl(var(--primary))' : f.score >= 45 ? 'hsl(var(--safety-yellow))' : 'hsl(var(--safety-red))',
              }} />
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground w-6 text-right">{f.score}%</span>
          </div>
        ))}
      </div>

      {/* Hotline */}
      <Button variant="outline" size="sm" className="w-full text-xs border-destructive/30 text-destructive hover:bg-destructive/10" asChild>
        <a href="tel:0800428428">
          <Phone className="w-3 h-3 mr-1" /> GBV Helpline: 0800 428 428
        </a>
      </Button>

      <div className="pt-2 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground/70">Western Cape Safety Intelligence • Real-time where available • Verified data only</span>
      </div>
    </CardContent>
  </Card>
);

export default GBVTrackerCard;
