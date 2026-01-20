import { useEffect, useState } from 'react';
import { GeoJSON, Popup, useMap, useMapEvents } from 'react-leaflet';
import { supabase } from '@/integrations/supabase/client';
import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson';

interface WardData {
  id: string;
  ward_number: number;
  boundary_geojson: unknown;
}

interface WardBoundariesLayerProps {
  visible?: boolean;
  minZoom?: number;
  onWardClick?: (wardNumber: number) => void;
}

// Sample ward boundaries for Cape Town (demonstration data)
// In production, these would come from geo_wards.boundary_geojson
const sampleWardBoundaries: Record<number, Feature<Polygon>> = {
  77: {
    type: 'Feature',
    properties: { ward_number: 77, name: 'Ward 77 - City Bowl' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.4100, -33.9300],
        [18.4350, -33.9300],
        [18.4350, -33.9100],
        [18.4100, -33.9100],
        [18.4100, -33.9300]
      ]]
    }
  },
  115: {
    type: 'Feature',
    properties: { ward_number: 115, name: 'Ward 115 - Green Point/Sea Point' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.3800, -33.9200],
        [18.4100, -33.9200],
        [18.4100, -33.9000],
        [18.3800, -33.9000],
        [18.3800, -33.9200]
      ]]
    }
  },
  54: {
    type: 'Feature',
    properties: { ward_number: 54, name: 'Ward 54 - Camps Bay' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.3600, -33.9500],
        [18.3900, -33.9500],
        [18.3900, -33.9300],
        [18.3600, -33.9300],
        [18.3600, -33.9500]
      ]]
    }
  },
  62: {
    type: 'Feature',
    properties: { ward_number: 62, name: 'Ward 62 - Constantia' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.4200, -33.9900],
        [18.4500, -33.9900],
        [18.4500, -33.9700],
        [18.4200, -33.9700],
        [18.4200, -33.9900]
      ]]
    }
  },
  64: {
    type: 'Feature',
    properties: { ward_number: 64, name: 'Ward 64 - Claremont/Newlands' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.4600, -33.9700],
        [18.4900, -33.9700],
        [18.4900, -33.9500],
        [18.4600, -33.9500],
        [18.4600, -33.9700]
      ]]
    }
  },
  74: {
    type: 'Feature',
    properties: { ward_number: 74, name: 'Ward 74 - Rondebosch' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.4700, -33.9600],
        [18.5000, -33.9600],
        [18.5000, -33.9400],
        [18.4700, -33.9400],
        [18.4700, -33.9600]
      ]]
    }
  },
  100: {
    type: 'Feature',
    properties: { ward_number: 100, name: 'Ward 100 - Observatory/Mowbray' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.4700, -33.9400],
        [18.4900, -33.9400],
        [18.4900, -33.9250],
        [18.4700, -33.9250],
        [18.4700, -33.9400]
      ]]
    }
  },
  57: {
    type: 'Feature',
    properties: { ward_number: 57, name: 'Ward 57 - Hout Bay' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.3400, -34.0500],
        [18.3800, -34.0500],
        [18.3800, -34.0200],
        [18.3400, -34.0200],
        [18.3400, -34.0500]
      ]]
    }
  },
  69: {
    type: 'Feature',
    properties: { ward_number: 69, name: 'Ward 69 - Fish Hoek' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.4200, -34.1400],
        [18.4500, -34.1400],
        [18.4500, -34.1200],
        [18.4200, -34.1200],
        [18.4200, -34.1400]
      ]]
    }
  },
  16: {
    type: 'Feature',
    properties: { ward_number: 16, name: 'Ward 16 - Milnerton' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.4800, -33.8700],
        [18.5100, -33.8700],
        [18.5100, -33.8500],
        [18.4800, -33.8500],
        [18.4800, -33.8700]
      ]]
    }
  },
  4: {
    type: 'Feature',
    properties: { ward_number: 4, name: 'Ward 4 - Bloubergstrand' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.4500, -33.8100],
        [18.4900, -33.8100],
        [18.4900, -33.7800],
        [18.4500, -33.7800],
        [18.4500, -33.8100]
      ]]
    }
  },
  23: {
    type: 'Feature',
    properties: { ward_number: 23, name: 'Ward 23 - Bellville' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [18.6200, -33.9100],
        [18.6600, -33.9100],
        [18.6600, -33.8800],
        [18.6200, -33.8800],
        [18.6200, -33.9100]
      ]]
    }
  }
};

const WardBoundariesLayer = ({ 
  visible = true, 
  minZoom = 12,
  onWardClick 
}: WardBoundariesLayerProps) => {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());
  const [wards, setWards] = useState<WardData[]>([]);
  const [hoveredWard, setHoveredWard] = useState<number | null>(null);

  // Track zoom level
  useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
    }
  });

  // Fetch ward boundaries from database
  useEffect(() => {
    const fetchWards = async () => {
      const { data, error } = await supabase
        .from('geo_wards')
        .select('id, ward_number, boundary_geojson')
        .not('boundary_geojson', 'is', null);
      
      if (!error && data) {
        setWards(data as WardData[]);
      }
    };
    
    fetchWards();
  }, []);

  // Don't render if not visible or zoom is too low
  if (!visible || currentZoom < minZoom) {
    return null;
  }

  // Combine database wards with sample data for demonstration
  const allWardFeatures: Feature<Polygon>[] = Object.values(sampleWardBoundaries);
  
  // Add any wards from database that have boundaries
  wards.forEach(ward => {
    if (ward.boundary_geojson && !sampleWardBoundaries[ward.ward_number]) {
      const feature = ward.boundary_geojson as Feature<Polygon>;
      if (feature.geometry) {
        allWardFeatures.push({
          ...feature,
          properties: { 
            ...feature.properties, 
            ward_number: ward.ward_number 
          }
        });
      }
    }
  });

  const wardCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: allWardFeatures
  };

  const getWardStyle = (feature: Feature | undefined) => {
    const wardNumber = feature?.properties?.ward_number;
    const isHovered = wardNumber === hoveredWard;
    
    return {
      fillColor: isHovered ? '#3b82f6' : '#6366f1',
      fillOpacity: isHovered ? 0.35 : 0.15,
      color: isHovered ? '#60a5fa' : '#818cf8',
      weight: isHovered ? 3 : 2,
      dashArray: isHovered ? '' : '5, 5'
    };
  };

  const onEachWard = (feature: Feature, layer: L.Layer) => {
    const wardNumber = feature.properties?.ward_number;
    const wardName = feature.properties?.name || `Ward ${wardNumber}`;
    
    layer.bindPopup(`
      <div class="p-2 min-w-[160px]">
        <div class="font-bold text-sm text-primary">${wardName}</div>
        <div class="text-xs text-muted-foreground mt-1">
          Cape Town Metropolitan
        </div>
        <div class="mt-2 text-[10px] text-muted-foreground">
          Click for ward details
        </div>
      </div>
    `);

    layer.on({
      mouseover: () => setHoveredWard(wardNumber),
      mouseout: () => setHoveredWard(null),
      click: () => onWardClick?.(wardNumber)
    });
  };

  return (
    <GeoJSON
      key={`wards-${hoveredWard}`}
      data={wardCollection}
      style={getWardStyle}
      onEachFeature={onEachWard}
    />
  );
};

export default WardBoundariesLayer;
