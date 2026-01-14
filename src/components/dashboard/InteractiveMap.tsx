import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, Camera, TrafficCone, AlertTriangle, 
  MapPin, ZoomIn, ZoomOut, Locate, Filter,
  Eye, EyeOff, Search, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  MAP_CENTER, MAP_ZOOM, 
  cctvMarkers, trafficLightMarkers, highRiskMarkers, accidentHotspots,
  MapMarker
} from '@/data/mapData';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const createIcon = (color: string, type: string) => {
  const iconHtml = `
    <div style="
      background: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const cctvIcon = createIcon('#3b82f6', 'cctv');
const trafficIcon = createIcon('#22c55e', 'traffic');
const riskIcon = createIcon('#ef4444', 'risk');
const hotspotIcon = createIcon('#f97316', 'hotspot');

// Map Controls Component
const MapControls = () => {
  const map = useMap();

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button 
        onClick={() => map.zoomIn()}
        className="p-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border shadow-lg hover:bg-card transition-colors"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button 
        onClick={() => map.zoomOut()}
        className="p-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border shadow-lg hover:bg-card transition-colors"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button 
        onClick={() => map.setView(MAP_CENTER, MAP_ZOOM)}
        className="p-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border shadow-lg hover:bg-card transition-colors"
      >
        <Locate className="w-4 h-4" />
      </button>
    </div>
  );
};

interface LayerToggle {
  id: string;
  name: string;
  icon: any;
  color: string;
  enabled: boolean;
}

const InteractiveMap = () => {
  const [layers, setLayers] = useState<LayerToggle[]>([
    { id: 'cctv', name: 'CCTV Cameras', icon: Camera, color: '#3b82f6', enabled: true },
    { id: 'traffic', name: 'Traffic Lights', icon: TrafficCone, color: '#22c55e', enabled: true },
    { id: 'risk', name: 'High-Risk Zones', icon: AlertTriangle, color: '#ef4444', enabled: true },
    { id: 'hotspots', name: 'Accident Hotspots', icon: MapPin, color: '#f97316', enabled: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(l => 
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ));
  };

  const getMarkersByType = (type: string): MapMarker[] => {
    switch(type) {
      case 'cctv': return cctvMarkers;
      case 'traffic': return trafficLightMarkers;
      case 'risk': return highRiskMarkers;
      case 'hotspots': return accidentHotspots;
      default: return [];
    }
  };

  const getIconByType = (type: string) => {
    switch(type) {
      case 'cctv': return cctvIcon;
      case 'traffic_light': return trafficIcon;
      case 'high_risk': return riskIcon;
      case 'accident_hotspot': return hotspotIcon;
      default: return cctvIcon;
    }
  };

  const allMarkers = layers
    .filter(l => l.enabled)
    .flatMap(l => getMarkersByType(l.id));

  const filteredMarkers = searchQuery 
    ? allMarkers.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.area.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allMarkers;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Interactive Map</h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showFilters ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Layer Controls */}
      {showFilters && (
        <div className="p-3 border-b border-border space-y-3 animate-fade-in">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-background/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Layer Toggles */}
          <div className="grid grid-cols-2 gap-2">
            {layers.map(layer => {
              const Icon = layer.icon;
              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg border transition-all',
                    layer.enabled 
                      ? 'bg-primary/10 border-primary/50 text-foreground'
                      : 'bg-background/50 border-border text-muted-foreground hover:border-primary/30'
                  )}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: layer.enabled ? layer.color : 'transparent', border: `2px solid ${layer.color}` }}
                  >
                    <Icon className="w-3 h-3" style={{ color: layer.enabled ? 'white' : layer.color }} />
                  </div>
                  <span className="text-xs font-medium">{layer.name}</span>
                  {layer.enabled ? <Eye className="w-3 h-3 ml-auto" /> : <EyeOff className="w-3 h-3 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative h-[400px]">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredMarkers.map(marker => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={getIconByType(marker.type)}
            >
              <Popup>
                <div className="p-2 min-w-[180px]">
                  <div className="font-bold text-sm">{marker.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{marker.area}</div>
                  {marker.status && (
                    <div className={cn(
                      'inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-2',
                      marker.status === 'operational' ? 'bg-safety-good/20 text-safety-good' :
                      marker.status === 'faulty' ? 'bg-safety-moderate/20 text-safety-moderate' :
                      'bg-safety-critical/20 text-safety-critical'
                    )}>
                      {marker.status.toUpperCase()}
                    </div>
                  )}
                  {marker.lastInspection && (
                    <div className="text-[10px] text-muted-foreground mt-2">
                      Last inspection: {marker.lastInspection}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapControls />
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 bg-background/30 border-t border-border flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-3">
          {layers.filter(l => l.enabled).map(layer => (
            <span key={layer.id} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
              <span className="text-muted-foreground">{layer.name}</span>
            </span>
          ))}
        </div>
        <span className="font-mono text-muted-foreground">
          {filteredMarkers.length} markers
        </span>
      </div>
    </div>
  );
};

export default InteractiveMap;
