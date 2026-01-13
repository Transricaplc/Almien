import { Video, VideoOff, ChevronRight } from 'lucide-react';
import { MajorRoute } from '@/types/dashboard';
import { getSafetyColor, cn } from '@/lib/utils';

interface RouteCardProps {
  route: MajorRoute;
  onClick: () => void;
}

const RouteCard = ({ route, onClick }: RouteCardProps) => {
  const coveragePercent = Math.round((route.functioning / route.total_cameras) * 100);

  return (
    <div 
      className={cn(
        'bg-card rounded-xl p-4 lg:p-5 border-2 border-border cursor-pointer',
        'transition-all duration-300 animate-fade-in group',
        'hover:border-primary hover:shadow-xl hover:shadow-primary/10',
        'hover:-translate-y-1'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg lg:text-xl font-black text-foreground">{route.id}</h3>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{route.name}</div>
        </div>
        <div className="text-right">
          <div 
            className="text-2xl lg:text-3xl font-black transition-transform group-hover:scale-110"
            style={{ color: getSafetyColor(route.safety_score) }}
          >
            {route.safety_score}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase">Safety</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-background rounded-lg p-2.5 flex items-center gap-2">
          <Video className="w-4 h-4 text-safety-good flex-shrink-0" />
          <div>
            <div className="text-base lg:text-lg font-bold text-foreground">{route.functioning}</div>
            <div className="text-[10px] text-muted-foreground">Active</div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-2.5 flex items-center gap-2">
          <VideoOff className="w-4 h-4 text-destructive flex-shrink-0" />
          <div>
            <div className="text-base lg:text-lg font-bold text-foreground">{route.offline}</div>
            <div className="text-[10px] text-muted-foreground">Offline</div>
          </div>
        </div>
      </div>
      
      <div className="bg-background rounded-lg p-2.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
          <span className="uppercase tracking-wide">Coverage</span>
          <span className="font-bold text-foreground">{coveragePercent}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div 
            className="progress-gradient h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${coveragePercent}%` }}
          />
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Incidents (24h)</span>
        <span className={cn(
          'font-bold px-2 py-0.5 rounded',
          route.incidents_24h > 5 ? 'bg-destructive/20 text-destructive' : 'bg-safety-moderate/20 text-safety-moderate'
        )}>
          {route.incidents_24h}
        </span>
      </div>
    </div>
  );
};

export default RouteCard;
