import { Phone, MapPin, Shield, AlertTriangle, Navigation, Clock, Cross, Flame, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSafeZones } from '@/hooks/useSafeZones';
import { useNeighborhoodRatings } from '@/hooks/useNeighborhoodRatings';

/**
 * Compact Area Info Card
 * Non-blocking card showing area data on tap/click
 * Displays: area name, ward, crime score, nearby safe spots, emergency contacts
 */

interface AreaInfoCardProps {
  areaName: string;
  wardNumber?: number;
  safetyScore?: number;
  coordinates?: { lat: number; lng: number };
  onClose: () => void;
  onNavigate?: (destination: { lat: number; lng: number }) => void;
}

const getRiskLevel = (score: number) => {
  if (score >= 80) return { label: 'LOW RISK', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  if (score >= 60) return { label: 'MODERATE', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
  if (score >= 40) return { label: 'HIGH RISK', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
  return { label: 'CRITICAL', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
};

const getSafetyColor = (score: number) => {
  if (score >= 80) return 'hsl(142, 76%, 36%)';
  if (score >= 60) return 'hsl(45, 93%, 47%)';
  if (score >= 40) return 'hsl(25, 95%, 53%)';
  return 'hsl(0, 84%, 60%)';
};

const AreaInfoCard = ({
  areaName,
  wardNumber,
  safetyScore = 50,
  coordinates,
  onClose,
  onNavigate,
}: AreaInfoCardProps) => {
  const { data: safeZones } = useSafeZones();
  const risk = getRiskLevel(safetyScore);

  // Find nearest safe zones (limit to 3)
  const nearbySafeZones = safeZones
    ?.filter(z => z.latitude && z.longitude)
    .map(zone => ({
      ...zone,
      distance: coordinates
        ? Math.sqrt(
            Math.pow((zone.latitude! - coordinates.lat) * 111, 2) +
            Math.pow((zone.longitude! - coordinates.lng) * 111 * Math.cos(coordinates.lat * Math.PI / 180), 2)
          )
        : 999
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  const emergencyContacts = [
    { name: 'SAPS Emergency', number: '10111', icon: Shield, color: 'text-blue-400' },
    { name: 'Ambulance', number: '10177', icon: Cross, color: 'text-red-400' },
    { name: 'Fire', number: '021 480 7700', icon: Flame, color: 'text-orange-400' },
  ];

  return (
    <div className="bg-background/98 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl shadow-black/30 overflow-hidden max-w-sm w-full">
      {/* Header with safety score */}
      <div className="p-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/30">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground truncate">{areaName}</h3>
            <div className="flex items-center gap-2 mt-1">
              {wardNumber && (
                <Badge variant="outline" className="text-[10px] font-mono">
                  Ward {wardNumber}
                </Badge>
              )}
              <Badge className={cn('text-[10px] font-mono', risk.color)}>
                {risk.label}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end ml-3">
            <div
              className="text-2xl font-black font-mono tabular-nums"
              style={{ color: getSafetyColor(safetyScore) }}
            >
              {safetyScore}
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">SAFETY</span>
          </div>
        </div>
      </div>

      {/* Nearby Safe Zones */}
      {nearbySafeZones && nearbySafeZones.length > 0 && (
        <div className="p-3 border-b border-border/30">
          <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Nearby Safe Spots
          </h4>
          <div className="space-y-1.5">
            {nearbySafeZones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onNavigate?.({ lat: zone.latitude!, lng: zone.longitude! })}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left group"
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px]",
                  zone.zone_type === 'hospital' && "bg-red-500/20 text-red-400",
                  zone.zone_type === 'police_station' && "bg-blue-500/20 text-blue-400",
                  zone.zone_type === 'fire_station' && "bg-orange-500/20 text-orange-400",
                  zone.zone_type === 'community_center' && "bg-emerald-500/20 text-emerald-400",
                  zone.zone_type === 'clinic' && "bg-pink-500/20 text-pink-400",
                  !['hospital', 'police_station', 'fire_station', 'community_center', 'clinic'].includes(zone.zone_type) && "bg-primary/20 text-primary"
                )}>
                  {zone.zone_type === 'hospital' ? '🏥' :
                   zone.zone_type === 'police_station' ? '👮' :
                   zone.zone_type === 'fire_station' ? '🚒' :
                   zone.zone_type === 'clinic' ? '🩺' : '🏢'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{zone.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {zone.zone_type.replace('_', ' ')} • {zone.distance.toFixed(1)}km
                  </p>
                </div>
                <Navigation className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="p-3 border-b border-border/30">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
          <Phone className="w-3 h-3" />
          Emergency Contacts
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number.replace(/\s/g, '')}`}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <contact.icon className={cn("w-4 h-4", contact.color)} />
              <span className="text-[9px] font-mono font-bold text-foreground">{contact.number}</span>
              <span className="text-[8px] text-muted-foreground text-center leading-tight">{contact.name.split(' ')[0]}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={onClose}
        >
          Close
        </Button>
        {coordinates && (
          <Button
            size="sm"
            className="flex-1 text-xs gap-1"
            onClick={() => onNavigate?.(coordinates)}
          >
            <Navigation className="w-3 h-3" />
            Safe Route
          </Button>
        )}
      </div>
    </div>
  );
};

export default AreaInfoCard;
