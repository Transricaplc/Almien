import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search, MapPin, Clock, Users, Star, Filter,
  Mountain, Waves, Wine, Landmark, Camera, TreePine,
  ChevronRight, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { attractions, categories, type Category } from '@/data/tourismAttractions';
import AttractionCard from '../tourism/AttractionCard';
import SponsorBanner from '../tourism/SponsorBanner';
import TourismRevenuePanel from '../tourism/TourismRevenuePanel';

const categoryIcons: Record<Category, typeof Mountain> = {
  All: MapPin,
  Nature: TreePine,
  History: Landmark,
  Adventure: Mountain,
  Wine: Wine,
  Beach: Waves,
  Culture: Camera,
  Family: Star,
};

export default function TourismHubView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [tab, setTab] = useState<'cards' | 'map'>('cards');
  const [showRevenue, setShowRevenue] = useState(false);

  const filtered = useMemo(() => {
    const matches = attractions.filter(a => {
      const matchCat = category === 'All' || a.category === category;
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
    // Featured/Sponsored sort to top
    return matches.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      if (a.isSponsored !== b.isSponsored) return a.isSponsored ? -1 : 1;
      return 0;
    });
  }, [search, category]);

  if (showRevenue) {
    return <TourismRevenuePanel onBack={() => setShowRevenue(false)} />;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tourism Hub</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cape Town attractions with real-time crowd intelligence & AI recommendations
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs shrink-0"
          onClick={() => setShowRevenue(true)}
        >
          <BarChart3 className="w-3.5 h-3.5" />Revenue
        </Button>
      </div>

      {/* Sponsor Banner */}
      <SponsorBanner />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Attractions', value: attractions.length, icon: MapPin },
          { label: 'Open Now', value: attractions.filter(a => a.isOpen).length, icon: Clock },
          { label: 'Low Crowd', value: attractions.filter(a => a.crowdPercent < 40).length, icon: Users },
          { label: 'Avg Rating', value: (attractions.reduce((s, a) => s + a.rating, 0) / attractions.length).toFixed(1), icon: Star },
        ].map(s => (
          <Card key={s.label} className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground tabular-nums">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search attractions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Tabs value={tab} onValueChange={v => setTab(v as 'cards' | 'map')} className="shrink-0">
          <TabsList className="h-9">
            <TabsTrigger value="cards" className="text-xs">Cards</TabsTrigger>
            <TabsTrigger value="map" className="text-xs">Map</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Category Pills */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {categories.map(cat => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border',
                  category === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                )}
              >
                <Icon className="w-3.5 h-3.5" />{cat}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Content */}
      {tab === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => <AttractionCard key={a.id} a={a} />)}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No attractions found for this filter.
            </div>
          )}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="h-[500px] bg-muted flex items-center justify-center text-sm text-muted-foreground">
            <div className="text-center space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-primary/40" />
              <p>Interactive map with {filtered.length} attraction pins</p>
              <p className="text-xs">Integrates with existing Leaflet map layers</p>
            </div>
          </div>
        </Card>
      )}

      {/* AI Day Planner CTA */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">AI Perfect Day Planner</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Let our AI plan an optimized itinerary based on crowd levels, weather, and your interests
            </p>
          </div>
          <Button size="sm" className="shrink-0 gap-1.5 text-xs">
            Plan My Day <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
