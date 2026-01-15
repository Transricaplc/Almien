import { Dog, MapPin, Clock, Shield, Leaf, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PetZone {
  id: string;
  name: string;
  location: string;
  type: 'off-leash' | 'on-leash' | 'beach';
  hours: string;
  safety_rating: 'high' | 'moderate' | 'low';
  amenities: string[];
  notes: string;
}

const petZones: PetZone[] = [
  { id: '1', name: 'Green Point Dog Park', location: 'Green Point', type: 'off-leash', hours: '06:00-21:00', safety_rating: 'high', amenities: ['Water', 'Waste bags', 'Fenced'], notes: 'Popular, well-lit evening walks' },
  { id: '2', name: 'Sea Point Promenade', location: 'Sea Point', type: 'on-leash', hours: '24hrs', safety_rating: 'high', amenities: ['Water taps', 'Benches'], notes: 'Busy coastal walkway, dogs welcome on leash' },
  { id: '3', name: 'Rondebosch Common', location: 'Rondebosch', type: 'off-leash', hours: '06:00-18:00', safety_rating: 'moderate', amenities: ['Open space', 'Shade'], notes: 'Large open area, watch for cyclists' },
  { id: '4', name: 'Noordhoek Beach', location: 'Noordhoek', type: 'beach', hours: '06:00-20:00', safety_rating: 'high', amenities: ['Beach access', 'Parking'], notes: 'Dogs allowed off-leash, watch tides' },
  { id: '5', name: 'De Waal Park', location: 'Gardens', type: 'on-leash', hours: '06:00-18:00', safety_rating: 'moderate', amenities: ['Shade', 'Paths'], notes: 'Historic park, leash required' },
  { id: '6', name: 'Constantia Greenbelt', location: 'Constantia', type: 'off-leash', hours: '06:00-17:00', safety_rating: 'moderate', amenities: ['Trails', 'Stream'], notes: 'Natural trails, baboon activity possible' },
];

const getTypeColor = (type: PetZone['type']) => {
  switch (type) {
    case 'off-leash': return 'hsl(160 84% 39%)';
    case 'on-leash': return 'hsl(210 84% 55%)';
    case 'beach': return 'hsl(38 92% 50%)';
  }
};

const getTypeIcon = (type: PetZone['type']) => {
  switch (type) {
    case 'off-leash': return '🐕';
    case 'on-leash': return '🦮';
    case 'beach': return '🏖️';
  }
};

const PetFriendlyZonesPanel = () => {
  const offLeashCount = petZones.filter(z => z.type === 'off-leash').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dog className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-foreground/90">Canine Zones</span>
        </div>
        <Badge variant="outline" className="text-[10px] border-amber-400/30 text-amber-400">
          {offLeashCount} Off-Leash
        </Badge>
      </div>

      <ScrollArea className="h-[320px]">
        <div className="space-y-2 pr-2">
          {petZones.map(zone => (
            <div 
              key={zone.id}
              className="bg-background/40 border border-border/30 rounded-lg p-2.5 hover:border-border/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{getTypeIcon(zone.type)}</span>
                    <span className="text-xs font-medium text-foreground/90">{zone.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{zone.location}</span>
                  </div>
                </div>
                <Badge 
                  className="text-[10px] font-mono shrink-0 capitalize"
                  style={{ 
                    backgroundColor: `${getTypeColor(zone.type)}20`,
                    color: getTypeColor(zone.type),
                    border: `1px solid ${getTypeColor(zone.type)}40`
                  }}
                >
                  {zone.type.replace('-', ' ')}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{zone.hours}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  <span className="capitalize">{zone.safety_rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-1.5">
                {zone.amenities.slice(0, 3).map(amenity => (
                  <span key={amenity} className="text-[9px] px-1.5 py-0.5 bg-muted/30 rounded text-muted-foreground">
                    {amenity}
                  </span>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground/70 mt-1.5 line-clamp-1">{zone.notes}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PetFriendlyZonesPanel;
