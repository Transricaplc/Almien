import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';
import { useEffect, useState } from 'react';

const DateWeatherWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-ZA', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Mock weather data for Cape Town
  const weather = {
    temp: 24,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 18,
    high: 28,
    low: 16,
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">CPT/SAST</span>
          <span className="text-[10px] font-mono text-primary">WEATHER</span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Date & Time */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-mono font-bold text-foreground tabular-nums tracking-tight">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              {formatDate(currentTime)}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Sun className="w-6 h-6 text-yellow-400" />
              <Cloud className="w-4 h-4 text-muted-foreground -ml-2" />
            </div>
            <div className="text-[10px] text-muted-foreground">Cape Town</div>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center justify-between py-2 border-y border-border/50">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <span className="text-3xl font-mono font-bold text-foreground">{weather.temp}°</span>
          </div>
          <div className="text-right text-xs font-mono">
            <div className="text-muted-foreground">{weather.condition}</div>
            <div className="text-foreground/70">H:{weather.high}° L:{weather.low}°</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-background/50 rounded px-2 py-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <div className="text-xs font-mono font-medium">{weather.humidity}%</div>
              <div className="text-[9px] text-muted-foreground">Humidity</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-background/50 rounded px-2 py-1.5">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <div className="text-xs font-mono font-medium">{weather.wind} km/h</div>
              <div className="text-[9px] text-muted-foreground">Wind SE</div>
            </div>
          </div>
        </div>

        {/* Forecast ticker */}
        <div className="flex items-center gap-2 text-[10px] font-mono overflow-hidden">
          <span className="text-muted-foreground shrink-0">3-DAY:</span>
          <div className="flex items-center gap-3 text-foreground/80">
            <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-yellow-400" />26°</span>
            <span className="flex items-center gap-1"><Cloud className="w-3 h-3 text-muted-foreground" />22°</span>
            <span className="flex items-center gap-1"><CloudRain className="w-3 h-3 text-blue-400" />19°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateWeatherWidget;
