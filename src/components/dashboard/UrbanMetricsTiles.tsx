import { memo, useState, useEffect } from 'react';
import { Wind, Volume2, Zap, Users, Thermometer, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricTile {
  id: string;
  label: string;
  value: number;
  unit: string;
  icon: typeof Wind;
  status: 'good' | 'moderate' | 'poor' | 'hazardous';
  trend: number;
  description: string;
}

const statusColors = {
  good: 'border-l-emerald-500 bg-emerald-500/5',
  moderate: 'border-l-amber-500 bg-amber-500/5',
  poor: 'border-l-orange-500 bg-orange-500/5',
  hazardous: 'border-l-red-500 bg-red-500/5',
};

const statusBadge = {
  good: 'bg-emerald-500/15 text-emerald-400',
  moderate: 'bg-amber-500/15 text-amber-400',
  poor: 'bg-orange-500/15 text-orange-400',
  hazardous: 'bg-red-500/15 text-red-400',
};

const getAQIStatus = (v: number): MetricTile['status'] =>
  v <= 50 ? 'good' : v <= 100 ? 'moderate' : v <= 150 ? 'poor' : 'hazardous';
const getNoiseStatus = (v: number): MetricTile['status'] =>
  v <= 55 ? 'good' : v <= 70 ? 'moderate' : v <= 85 ? 'poor' : 'hazardous';
const getEnergyStatus = (v: number): MetricTile['status'] =>
  v <= 60 ? 'good' : v <= 75 ? 'moderate' : v <= 90 ? 'poor' : 'hazardous';
const getCrowdStatus = (v: number): MetricTile['status'] =>
  v <= 40 ? 'good' : v <= 65 ? 'moderate' : v <= 85 ? 'poor' : 'hazardous';

const generateMetrics = (): MetricTile[] => {
  const aqi = Math.round(30 + Math.random() * 90);
  const noise = Math.round(40 + Math.random() * 45);
  const energy = Math.round(45 + Math.random() * 50);
  const crowd = Math.round(20 + Math.random() * 70);
  const temp = Math.round(18 + Math.random() * 14);
  const humidity = Math.round(40 + Math.random() * 40);

  return [
    { id: 'aqi', label: 'Air Quality Index', value: aqi, unit: 'AQI', icon: Wind, status: getAQIStatus(aqi), trend: +(Math.random() * 10 - 5).toFixed(1), description: aqi <= 50 ? 'Clean air' : aqi <= 100 ? 'Acceptable' : 'Unhealthy for sensitive groups' },
    { id: 'noise', label: 'Noise Level', value: noise, unit: 'dB', icon: Volume2, status: getNoiseStatus(noise), trend: +(Math.random() * 8 - 4).toFixed(1), description: noise <= 55 ? 'Quiet environment' : noise <= 70 ? 'Moderate traffic noise' : 'High urban noise' },
    { id: 'energy', label: 'Grid Load', value: energy, unit: '%', icon: Zap, status: getEnergyStatus(energy), trend: +(Math.random() * 6 - 3).toFixed(1), description: energy <= 60 ? 'Low demand period' : energy <= 75 ? 'Normal load' : 'Peak demand' },
    { id: 'crowd', label: 'Crowd Density', value: crowd, unit: '%', icon: Users, status: getCrowdStatus(crowd), trend: +(Math.random() * 12 - 6).toFixed(1), description: crowd <= 40 ? 'Low foot traffic' : crowd <= 65 ? 'Moderate activity' : 'High congestion' },
    { id: 'temp', label: 'Temperature', value: temp, unit: '°C', icon: Thermometer, status: temp <= 25 ? 'good' : temp <= 32 ? 'moderate' : 'poor', trend: +(Math.random() * 4 - 2).toFixed(1), description: `Feels like ${temp + Math.round(Math.random() * 3)}°C` },
    { id: 'humidity', label: 'Humidity', value: humidity, unit: '%', icon: Droplets, status: humidity <= 60 ? 'good' : humidity <= 75 ? 'moderate' : 'poor', trend: +(Math.random() * 6 - 3).toFixed(1), description: humidity <= 60 ? 'Comfortable' : 'Humid conditions' },
  ];
};

const UrbanMetricsTiles = memo(() => {
  const [metrics, setMetrics] = useState<MetricTile[]>(generateMetrics);

  useEffect(() => {
    const interval = setInterval(() => setMetrics(generateMetrics()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Urban Pulse — Live Metrics</h2>
        <span className="text-[10px] font-mono text-muted-foreground animate-pulse">● LIVE</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map(m => (
          <div key={m.id} className={cn(
            "p-4 rounded-xl border border-border bg-card border-l-4 transition-all hover:shadow-md",
            statusColors[m.status]
          )}>
            <div className="flex items-center justify-between mb-2">
              <m.icon className="w-4.5 h-4.5 text-muted-foreground" />
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", statusBadge[m.status])}>
                {m.status}
              </span>
            </div>
            <div className="text-2xl font-black text-foreground tabular-nums">
              {m.value}<span className="text-sm font-medium text-muted-foreground ml-1">{m.unit}</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">{m.label}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">{m.description}</span>
              <span className={cn("text-[10px] font-bold", m.trend >= 0 ? 'text-red-400' : 'text-emerald-400')}>
                {m.trend >= 0 ? '↑' : '↓'} {Math.abs(m.trend)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

UrbanMetricsTiles.displayName = 'UrbanMetricsTiles';
export default UrbanMetricsTiles;
