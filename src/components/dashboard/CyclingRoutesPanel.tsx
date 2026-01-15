import { Bike, MapPin, Shield, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CycleRoute {
  id: string;
  name: string;
  distance_km: number;
  surface: 'paved' | 'gravel' | 'mixed';
  safety_rating: 'high' | 'moderate' | 'low';
  lighting: boolean;
  cctv_coverage: number;
  notes: string;
}

const cycleRoutes: CycleRoute[] = [
  { id: '1', name: 'Sea Point Promenade', distance_km: 8, surface: 'paved', safety_rating: 'high', lighting: true, cctv_coverage: 85, notes: 'Scenic coastal route, busy on weekends' },
  { id: '2', name: 'Green Point Urban Park', distance_km: 3, surface: 'paved', safety_rating: 'high', lighting: true, cctv_coverage: 90, notes: 'Family-friendly, well maintained' },
  { id: '3', name: 'Century City Canal', distance_km: 5, surface: 'paved', safety_rating: 'high', lighting: true, cctv_coverage: 75, notes: 'Connects to Intaka Island' },
  { id: '4', name: 'Liesbeek Parkway', distance_km: 6, surface: 'mixed', safety_rating: 'moderate', lighting: false, cctv_coverage: 25, notes: 'Avoid after dark, isolated sections' },
  { id: '5', name: 'Rondebosch Common', distance_km: 2.5, surface: 'gravel', safety_rating: 'moderate', lighting: false, cctv_coverage: 40, notes: 'Popular with joggers, limited parking' },
  { id: '6', name: 'Tokai Forest MTB', distance_km: 12, surface: 'gravel', safety_rating: 'moderate', lighting: false, cctv_coverage: 10, notes: 'Mountain bike trails, group riding recommended' },
];

const getSafetyColor = (rating: CycleRoute['safety_rating']) => {
  switch (rating) {
    case 'high': return 'hsl(160 84% 39%)';
    case 'moderate': return 'hsl(38 92% 50%)';
    case 'low': return 'hsl(0 84% 60%)';
  }
};

const CyclingRoutesPanel = () => {
  const safeRoutes = cycleRoutes.filter(r => r.safety_rating === 'high').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bike className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-foreground/90">Cycling Corridors</span>
        </div>
        <Badge variant="outline" className="text-[10px] border-emerald-400/30 text-emerald-400">
          {safeRoutes}/{cycleRoutes.length} Safe
        </Badge>
      </div>

      <ScrollArea className="h-[320px]">
        <div className="space-y-2 pr-2">
          {cycleRoutes.map(route => (
            <div 
              key={route.id}
              className="bg-background/40 border border-border/30 rounded-lg p-2.5 hover:border-border/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-foreground/90">{route.name}</span>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                    <span className="font-mono">{route.distance_km}km</span>
                    <span className="capitalize">{route.surface}</span>
                    {route.lighting && <span className="text-amber-400">🔦 Lit</span>}
                  </div>
                </div>
                <Badge 
                  className="text-[10px] font-mono shrink-0"
                  style={{ 
                    backgroundColor: `${getSafetyColor(route.safety_rating)}20`,
                    color: getSafetyColor(route.safety_rating),
                    border: `1px solid ${getSafetyColor(route.safety_rating)}40`
                  }}
                >
                  {route.safety_rating}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>{route.cctv_coverage}% CCTV</span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground/70 mt-1.5 line-clamp-1">{route.notes}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CyclingRoutesPanel;
