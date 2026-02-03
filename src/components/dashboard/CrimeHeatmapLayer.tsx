import { Circle, Popup, useMap } from 'react-leaflet';
import { useNeighborhoodRatings, getCrimeRateColor, getCrimeRateLabel, getSafetyScoreColor } from '@/hooks/useNeighborhoodRatings';
import { AlertTriangle, Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface CrimeHeatmapLayerProps {
  visible: boolean;
  showLabels?: boolean;
}

const CrimeHeatmapLayer = ({ visible, showLabels = true }: CrimeHeatmapLayerProps) => {
  const { data: neighborhoods, isLoading } = useNeighborhoodRatings();
  const map = useMap();

  if (!visible || isLoading || !neighborhoods) return null;

  // Filter only neighborhoods with coordinates
  const neighborhoodsWithCoords = neighborhoods.filter(n => n.latitude && n.longitude);

  return (
    <>
      {neighborhoodsWithCoords.map((neighborhood) => {
        const lat = Number(neighborhood.latitude);
        const lng = Number(neighborhood.longitude);
        const safetyScore = Number(neighborhood.safety_score);
        const color = getCrimeRateColor(neighborhood.crime_rate);
        
        // Radius based on crime count (more crimes = larger circle)
        const baseRadius = 400;
        const crimeMultiplier = Math.min(neighborhood.crime_count_30d / 50, 3);
        const radius = baseRadius + (baseRadius * crimeMultiplier);
        
        // Opacity based on crime rate
        const opacityMap: Record<string, number> = {
          'very_high': 0.5,
          'high': 0.4,
          'medium': 0.3,
          'low': 0.2,
          'very_low': 0.15,
        };
        const fillOpacity = opacityMap[neighborhood.crime_rate] || 0.25;

        return (
          <Circle
            key={neighborhood.id}
            center={[lat, lng]}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: fillOpacity,
              weight: 2,
              opacity: 0.7,
            }}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-sm">{neighborhood.neighborhood}</div>
                  <div 
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ 
                      backgroundColor: `${color}20`,
                      color: color
                    }}
                  >
                    {getCrimeRateLabel(neighborhood.crime_rate)}
                  </div>
                </div>

                {/* Safety Score */}
                <div className="flex items-center justify-between mb-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Safety Score</span>
                  </div>
                  <span 
                    className="text-lg font-bold"
                    style={{ color: getSafetyScoreColor(safetyScore) }}
                  >
                    {safetyScore.toFixed(1)}/5
                  </span>
                </div>

                {/* Crime Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-1.5">
                    <div className="text-muted-foreground">Total (30d)</div>
                    <div className="font-bold text-foreground">{neighborhood.crime_count_30d}</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-1.5">
                    <div className="text-muted-foreground">Robbery</div>
                    <div className="font-bold text-orange-600">{neighborhood.robbery_count}</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded p-1.5">
                    <div className="text-muted-foreground">Assault</div>
                    <div className="font-bold text-red-600">{neighborhood.assault_count}</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-1.5">
                    <div className="text-muted-foreground">Burglary</div>
                    <div className="font-bold text-amber-600">{neighborhood.burglary_count}</div>
                  </div>
                </div>

                {/* Warning for high crime areas */}
                {(neighborhood.crime_rate === 'high' || neighborhood.crime_rate === 'very_high') && (
                  <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-red-600 dark:text-red-400">
                      High crime area - exercise caution, especially after dark
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </Circle>
        );
      })}
    </>
  );
};

export default CrimeHeatmapLayer;
