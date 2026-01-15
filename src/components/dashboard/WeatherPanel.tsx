import { Cloud, Thermometer, Wind, Droplets, Sun, Eye } from 'lucide-react';
import { useWeather, getWeatherIcon, getUVLevel } from '@/hooks/useWeather';
import { Skeleton } from '@/components/ui/skeleton';

const WeatherPanel = () => {
  const { weather, loading } = useWeather();

  if (loading) {
    return (
      <div className="glass-panel p-4 space-y-3">
        <Skeleton className="h-5 w-32 bg-white/10" />
        <Skeleton className="h-20 w-full bg-white/10" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="glass-panel p-4 text-center">
        <span className="text-xs text-white/50">Weather data unavailable</span>
      </div>
    );
  }

  const uvInfo = getUVLevel(weather.uv_index || 0);

  return (
    <div className="glass-panel p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white/90">Cape Town Weather</span>
        </div>
        <span className="text-2xl">{getWeatherIcon(weather.icon_code || '01d')}</span>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-mono font-bold text-white">
              {Number(weather.temperature_celsius).toFixed(0)}
            </span>
            <span className="text-xl text-white/50">°C</span>
          </div>
          <span className="text-xs text-white/50 capitalize">{weather.description}</span>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-white/50">
            <Thermometer className="w-3 h-3" />
            <span className="text-xs font-mono">Feels {Number(weather.feels_like_celsius).toFixed(0)}°</span>
          </div>
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center">
          <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <span className="text-xs font-mono text-white/70">{weather.humidity_percent}%</span>
          <span className="text-xs text-white/40 block">Humidity</span>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center">
          <Wind className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <span className="text-xs font-mono text-white/70">{Number(weather.wind_speed_kmh).toFixed(0)}</span>
          <span className="text-xs text-white/40 block">km/h {weather.wind_direction}</span>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center">
          <Sun className="w-4 h-4 mx-auto mb-1" style={{ color: uvInfo.color }} />
          <span className="text-xs font-mono text-white/70">{weather.uv_index}</span>
          <span className="text-xs text-white/40 block">{uvInfo.label}</span>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center">
          <Eye className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <span className="text-xs font-mono text-white/70">{Number(weather.visibility_km).toFixed(0)}km</span>
          <span className="text-xs text-white/40 block">Visibility</span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-white/30 text-center">
        Updated: {new Date(weather.last_updated).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default WeatherPanel;
