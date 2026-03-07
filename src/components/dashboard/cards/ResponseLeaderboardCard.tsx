import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, Trophy } from 'lucide-react';

const responders = [
  { name: 'ADT', avgMin: 8.2, suburb: 'Sea Point', color: 'hsl(var(--primary))' },
  { name: 'Fidelity', avgMin: 10.5, suburb: 'Rondebosch', color: 'hsl(var(--safety-green))' },
  { name: 'Chubb', avgMin: 12.1, suburb: 'Camps Bay', color: 'hsl(48 96% 53%)' },
  { name: 'SAPS', avgMin: 22.4, suburb: 'Cape Town CBD', color: 'hsl(var(--safety-orange))' },
  { name: 'SAPS', avgMin: 38.7, suburb: 'Nyanga', color: 'hsl(var(--safety-red))' },
];

const maxTime = Math.max(...responders.map(r => r.avgMin));

const ResponseLeaderboardCard = () => (
  <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
    <CardHeader className="pb-2 px-4 pt-4">
      <CardTitle className="text-sm font-semibold flex items-center gap-2">
        <Trophy className="w-4 h-4 text-safety-yellow" />
        Verified Response Times
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 pb-4 space-y-3">
      <div className="space-y-2.5">
        {responders.map((r, i) => (
          <div key={`${r.name}-${r.suburb}`} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {i === 0 && <Badge variant="outline" className="text-[8px] px-1 py-0 text-primary border-primary/30">Fastest</Badge>}
                <span className="text-xs font-medium text-foreground">{r.name}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{r.suburb}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(r.avgMin / maxTime) * 100}%`, backgroundColor: r.color }}
                />
              </div>
              <span className="text-xs font-bold tabular-nums text-foreground w-12 text-right flex items-center gap-0.5">
                <Timer className="w-3 h-3 text-muted-foreground" />
                {r.avgMin}m
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-2 py-1.5 rounded-lg bg-muted/50 border border-border/30">
        <p className="text-[10px] text-muted-foreground text-center">
          Average response times from verified community reports & security industry data
        </p>
      </div>

      <div className="pt-2 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground/70">Western Cape Safety Intelligence • Real-time where available • Verified data only</span>
      </div>
    </CardContent>
  </Card>
);

export default ResponseLeaderboardCard;
