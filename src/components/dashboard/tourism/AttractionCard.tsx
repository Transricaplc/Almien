import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock, Users, Navigation, Thermometer, Star, ExternalLink,
  TreePine, Phone, Globe, Award, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Attraction } from '@/data/tourismAttractions';

const crowdColor: Record<string, string> = {
  Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Moderate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Very High': 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function AttractionCard({ a }: { a: Attraction }) {
  // Replace with real API call (Webtickets / GetYourGuide affiliate API or Western Cape Tourism integration) for live availability & commission tracking
  const handleBookNow = () => {
    if (a.bookingUrl) {
      window.open(a.bookingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className={cn(
      'card-hover overflow-hidden group relative',
      a.isFeatured && 'ring-1 ring-amber-500/40'
    )}>
      {/* Sponsored / Featured badges */}
      {(a.isSponsored || a.isFeatured) && (
        <div className="absolute top-0 left-0 z-10 flex gap-1 p-2">
          {a.isFeatured && (
            <Badge className="bg-amber-500/90 text-amber-950 text-[9px] gap-1 border-0">
              <Award className="w-2.5 h-2.5" />Featured Partner
            </Badge>
          )}
          {a.isSponsored && !a.isFeatured && (
            <Badge className="bg-primary/80 text-primary-foreground text-[9px] gap-1 border-0">
              <Sparkles className="w-2.5 h-2.5" />Sponsored
            </Badge>
          )}
        </div>
      )}

      {/* Photo */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={a.photo}
          alt={a.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2 flex gap-1.5">
          <Badge variant="outline" className={cn('text-[10px] border', crowdColor[a.crowdLevel])}>
            <Users className="w-3 h-3 mr-1" />{a.crowdLevel}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <Badge className={cn('text-[10px]', a.isOpen ? 'bg-emerald-600' : 'bg-red-600')}>
            {a.isOpen ? 'Open Now' : 'Closed'}
          </Badge>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{a.rating}
          </div>
        </div>
      </div>

      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-bold leading-tight line-clamp-1">{a.name}</CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{a.description}</p>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {/* Hours */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{a.hours}</span>
        </div>

        {/* Contact row */}
        <div className="flex items-center gap-2 flex-wrap">
          {a.phone && (
            <a href={`tel:${a.phone}`} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
              <Phone className="w-3 h-3" />{a.phone}
            </a>
          )}
          {a.website && (
            <a href={a.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-primary hover:underline">
              <Globe className="w-3 h-3" />Website
            </a>
          )}
        </div>

        {/* Crowd density bar */}
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">Crowd density</span>
            <span className="font-semibold tabular-nums">{a.crowdPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', {
                'bg-emerald-500': a.crowdPercent < 40,
                'bg-amber-500': a.crowdPercent >= 40 && a.crowdPercent < 65,
                'bg-orange-500': a.crowdPercent >= 65 && a.crowdPercent < 80,
                'bg-red-500': a.crowdPercent >= 80,
              })}
              style={{ width: `${a.crowdPercent}%` }}
            />
          </div>
        </div>

        {/* AI Tip */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
          <Thermometer className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
          <p className="text-[10px] text-primary font-medium leading-relaxed">{a.aiTip}</p>
        </div>

        {/* Sustainability */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">Sustainability</span>
          <div className="flex items-center gap-1.5">
            <TreePine className="w-3 h-3 text-emerald-500" />
            <span className="font-bold text-emerald-500">{a.sustainabilityScore}/100</span>
          </div>
        </div>

        {/* Earn with Gridfy badge for sponsored */}
        {a.isSponsored && (
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Earn with Gridfy</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1 h-9 text-xs gap-1.5">
            <Navigation className="w-3.5 h-3.5" />Get There
          </Button>
          {a.bookingUrl ? (
            <Button
              size="sm"
              variant="default"
              className="h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleBookNow}
            >
              <ExternalLink className="w-3.5 h-3.5" />Book Now
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="h-9 text-xs gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />Info
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
