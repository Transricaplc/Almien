import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSafeZones, getZoneTypeColor } from '@/hooks/useSafeZones';
import { Shield, Cross, Flame, Eye, ShoppingBag, Phone, Clock } from 'lucide-react';

interface SafeZonesLayerProps {
  visible: boolean;
  zoneTypes?: string[];
}

// Create custom icons for different zone types
const createSafeZoneIcon = (type: string) => {
  const color = getZoneTypeColor(type);
  const iconMap: Record<string, string> = {
    police_station: '🛡️',
    hospital: '🏥',
    fire_station: '🚒',
    cid_office: '👁️',
    shopping_mall: '🏬',
    community_center: '🏛️',
  };
  
  const emoji = iconMap[type] || '📍';
  
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      ">
        ${emoji}
      </div>
    `,
    className: 'safe-zone-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const SafeZonesLayer = ({ visible, zoneTypes }: SafeZonesLayerProps) => {
  const { data: safeZones, isLoading } = useSafeZones();
  const map = useMap();

  if (!visible || isLoading || !safeZones) return null;

  const filteredZones = zoneTypes 
    ? safeZones.filter(z => zoneTypes.includes(z.zone_type))
    : safeZones;

  return (
    <>
      {filteredZones.map((zone) => (
        <Marker
          key={zone.id}
          position={[Number(zone.latitude), Number(zone.longitude)]}
          icon={createSafeZoneIcon(zone.zone_type)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex items-start gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${getZoneTypeColor(zone.zone_type)}20` }}
                >
                  {zone.zone_type === 'police_station' && <Shield className="w-4 h-4" style={{ color: getZoneTypeColor(zone.zone_type) }} />}
                  {zone.zone_type === 'hospital' && <Cross className="w-4 h-4" style={{ color: getZoneTypeColor(zone.zone_type) }} />}
                  {zone.zone_type === 'fire_station' && <Flame className="w-4 h-4" style={{ color: getZoneTypeColor(zone.zone_type) }} />}
                  {zone.zone_type === 'cid_office' && <Eye className="w-4 h-4" style={{ color: getZoneTypeColor(zone.zone_type) }} />}
                  {zone.zone_type === 'shopping_mall' && <ShoppingBag className="w-4 h-4" style={{ color: getZoneTypeColor(zone.zone_type) }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground">{zone.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {zone.zone_type.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
              
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span>📍</span>
                  <span>{zone.address}</span>
                </div>
                
                {zone.contact_number && (
                  <a 
                    href={`tel:${zone.contact_number.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{zone.contact_number}</span>
                  </a>
                )}
                
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{zone.is_24_hours ? '24 Hours' : 'See hours'}</span>
                </div>
              </div>

              {zone.is_24_hours && (
                <div className="mt-2 bg-emerald-500/10 text-emerald-600 text-xs px-2 py-1 rounded text-center font-medium">
                  ✓ Open 24/7
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default SafeZonesLayer;
