import { Cloud, Wind, Dog, Thermometer, Droplets, Eye, AlertTriangle } from 'lucide-react';
import { useWeather, getWeatherIcon, getUVLevel } from '@/hooks/useWeather';
import { useWindReports, getSeverityColor } from '@/hooks/useWindReports';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface EnvironmentalClusterProps {
  className?: string;
  compact?: boolean;
}

/**
 * Environmental Data Cluster Component
 * 
 * Displays Weather, Wind, and Canine (K9) data side-by-side
 * as a context cluster for incident/patrol/ward views.
 */
const EnvironmentalCluster = ({ className, compact = false }: EnvironmentalClusterProps) => {
  const { weather, loading: weatherLoading } = useWeather();
  const { windReports, loading: windLoading } = useWindReports();

  // Get the most severe wind report
  const primaryWindReport = windReports[0];

  // Mock K9 data - would come from a real source
  const k9Units = {
    available: 4,
    deployed: 2,
    nearestETA: '8 min',
    status: 'operational' as const,
  };

  if (weatherLoading || windLoading) {
    return (
      <div className={cn("grid grid-cols-3 gap-3", className)}>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-3",
      compact ? "grid-cols-3" : "grid-cols-1 md:grid-cols-3",
      className
    )}>
      {/* Weather Card */}
      <div className="bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-3 hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium text-foreground">Weather</span>
          {weather && (
            <span className="text-lg ml-auto">{getWeatherIcon(weather.icon_code || '01d')}</span>
          )}
        </div>
        
        {weather ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-foreground">
                {Number(weather.temperature_celsius).toFixed(0)}°
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {weather.description}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>{weather.humidity_percent}%</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="w-3 h-3 text-purple-400" />
                <span>{Number(weather.visibility_km).toFixed(0)}km</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No data</p>
        )}
      </div>

      {/* Wind Card */}
      <div className={cn(
        "bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-3 hover:border-primary/30 transition-colors",
        primaryWindReport?.severity === 'severe' && "border-destructive/50 bg-destructive/5",
        primaryWindReport?.severity === 'high' && "border-orange-500/50 bg-orange-500/5"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <Wind className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium text-foreground">Wind</span>
          {primaryWindReport && (
            <span 
              className={cn(
                "ml-auto px-1.5 py-0.5 rounded text-[9px] font-medium uppercase",
                primaryWindReport.severity === 'severe' && "bg-destructive/20 text-destructive",
                primaryWindReport.severity === 'high' && "bg-orange-500/20 text-orange-400",
                primaryWindReport.severity === 'moderate' && "bg-yellow-500/20 text-yellow-400",
                primaryWindReport.severity === 'low' && "bg-emerald-500/20 text-emerald-400"
              )}
            >
              {primaryWindReport.severity}
            </span>
          )}
        </div>
        
        {primaryWindReport ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-foreground">
                {primaryWindReport.wind_speed_kmh}
              </span>
              <span className="text-xs text-muted-foreground">km/h</span>
              <span className="text-sm text-muted-foreground">
                {primaryWindReport.wind_direction}
              </span>
            </div>
            
            {primaryWindReport.wind_gust_kmh && (
              <div className="flex items-center gap-1 text-xs text-orange-400">
                <AlertTriangle className="w-3 h-3" />
                <span>Gusts to {primaryWindReport.wind_gust_kmh} km/h</span>
              </div>
            )}
            
            {primaryWindReport.advisory && (
              <p className="text-[10px] text-muted-foreground line-clamp-2">
                {primaryWindReport.advisory}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No data</p>
        )}
      </div>

      {/* K9 Units Card */}
      <div className="bg-card/60 backdrop-blur-sm rounded-lg border border-border/40 p-3 hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <Dog className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-foreground">K9 Units</span>
          <span 
            className={cn(
              "ml-auto px-1.5 py-0.5 rounded text-[9px] font-medium uppercase",
              k9Units.status === 'operational' && "bg-emerald-500/20 text-emerald-400"
            )}
          >
            {k9Units.status}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">
              {k9Units.available}
            </span>
            <span className="text-xs text-muted-foreground">available</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>{k9Units.deployed} deployed</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <span>ETA: {k9Units.nearestETA}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalCluster;
