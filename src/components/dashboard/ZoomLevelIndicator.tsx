import { Map, Grid3X3, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ZoomLevel } from '@/hooks/useProgressiveZoom';

/**
 * Zoom Level Indicator
 * Shows current zoom level context to user
 */

interface ZoomLevelIndicatorProps {
  zoomLevel: ZoomLevel;
  currentZoom: number;
  className?: string;
}

const ZoomLevelIndicator = ({ zoomLevel, currentZoom, className }: ZoomLevelIndicatorProps) => {
  const config = {
    city: {
      label: 'City Overview',
      icon: Map,
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      description: 'Heatmaps & aggregate scores',
    },
    ward: {
      label: 'Ward Level',
      icon: Grid3X3,
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      description: 'Crime bands & coverage',
    },
    suburb: {
      label: 'Suburb Detail',
      icon: MapPin,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      description: 'Emergency pins & routes',
    },
  }[zoomLevel];

  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-sm transition-all",
        config.color,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {config.label}
        </span>
        <span className="text-[9px] opacity-70 font-mono">
          Zoom {currentZoom.toFixed(0)} • {config.description}
        </span>
      </div>
    </div>
  );
};

export default ZoomLevelIndicator;
