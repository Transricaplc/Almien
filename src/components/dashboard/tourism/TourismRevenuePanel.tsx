import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DollarSign, Eye, MousePointerClick, ShoppingCart,
  TrendingUp, ArrowLeft, BarChart3
} from 'lucide-react';
import { attractions } from '@/data/tourismAttractions';

interface Props {
  onBack: () => void;
}

export default function TourismRevenuePanel({ onBack }: Props) {
  const totals = attractions.reduce(
    (acc, a) => ({
      impressions: acc.impressions + a.impressions,
      clicks: acc.clicks + a.clicks,
      bookings: acc.bookings + a.bookings,
      revenue: acc.revenue + a.estimatedRevenue,
    }),
    { impressions: 0, clicks: 0, bookings: 0, revenue: 0 }
  );

  const ctr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(1) : '0';
  const convRate = totals.clicks > 0 ? ((totals.bookings / totals.clicks) * 100).toFixed(1) : '0';

  const sponsoredAttractions = attractions.filter(a => a.isSponsored || a.isFeatured);

  const stats = [
    { label: 'Total Impressions', value: totals.impressions.toLocaleString(), icon: Eye, color: 'text-blue-400' },
    { label: 'Total Clicks', value: totals.clicks.toLocaleString(), icon: MousePointerClick, color: 'text-amber-400' },
    { label: 'Bookings', value: totals.bookings.toLocaleString(), icon: ShoppingCart, color: 'text-emerald-400' },
    { label: 'Est. Revenue', value: `R ${totals.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" />Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tourism Revenue Overview</h2>
          <p className="text-sm text-muted-foreground">Admin dashboard — simulated affiliate & sponsor metrics</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground tabular-nums">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Funnel metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">Click-Through Rate</span>
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums">{ctr}%</div>
          <p className="text-[10px] text-muted-foreground mt-1">Impressions → Clicks</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">{convRate}%</div>
          <p className="text-[10px] text-muted-foreground mt-1">Clicks → Bookings</p>
        </Card>
      </div>

      {/* Per-attraction table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Attraction Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[400px]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left p-3 font-medium">Attraction</th>
                  <th className="text-right p-3 font-medium">Views</th>
                  <th className="text-right p-3 font-medium">Clicks</th>
                  <th className="text-right p-3 font-medium">Bookings</th>
                  <th className="text-right p-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {[...attractions].sort((a, b) => b.estimatedRevenue - a.estimatedRevenue).map(a => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {a.name}
                        {a.isFeatured && <Badge className="bg-amber-500/80 text-[8px] px-1 py-0 border-0 text-amber-950">Featured</Badge>}
                        {a.isSponsored && !a.isFeatured && <Badge className="bg-primary/60 text-[8px] px-1 py-0 border-0">Sponsored</Badge>}
                      </div>
                    </td>
                    <td className="p-3 text-right tabular-nums text-muted-foreground">{a.impressions.toLocaleString()}</td>
                    <td className="p-3 text-right tabular-nums text-muted-foreground">{a.clicks.toLocaleString()}</td>
                    <td className="p-3 text-right tabular-nums text-muted-foreground">{a.bookings.toLocaleString()}</td>
                    <td className="p-3 text-right tabular-nums font-semibold text-foreground">R {a.estimatedRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Sponsored partners summary */}
      <Card className="p-4">
        <h3 className="text-sm font-bold text-foreground mb-3">Sponsored Partners ({sponsoredAttractions.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sponsoredAttractions.map(a => (
            <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-xs font-medium text-foreground truncate">{a.name}</span>
              <span className="text-xs font-bold text-primary tabular-nums">R {a.estimatedRevenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
