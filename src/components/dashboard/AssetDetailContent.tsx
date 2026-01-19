import { 
  MapPin, Camera, TrafficCone, Shield, Flame, Cross, 
  Car, Bus, HeartPulse, Phone, Clock, Activity, Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SelectedEntity } from '@/contexts/DashboardContext';

/**
 * Unified Asset Detail Content Component
 * 
 * Renders consistent detail view for all fixed urban safety assets:
 * - CCTV Camera, Traffic Signal, Hospital, Police Station, Fire Station
 * - Taxi Rank, Bus Stop, Clinic, Infrastructure
 * 
 * Always displays physical address in a consistent location.
 */

interface AssetDetailContentProps {
  entity: SelectedEntity;
}

// Status color mapping
const getStatusColor = (status: string) => {
  const statusLower = status?.toLowerCase() || '';
  if (statusLower.includes('operational') || statusLower.includes('active') || statusLower.includes('open')) {
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
  if (statusLower.includes('maintenance') || statusLower.includes('warning')) {
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }
  if (statusLower.includes('offline') || statusLower.includes('faulty') || statusLower.includes('closed')) {
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
  return 'bg-muted text-muted-foreground border-muted';
};

// Asset type icon mapping
const getAssetIcon = (type: string) => {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('cctv') || typeLower.includes('camera')) return <Camera className="w-5 h-5" />;
  if (typeLower.includes('traffic') || typeLower.includes('signal')) return <TrafficCone className="w-5 h-5" />;
  if (typeLower.includes('hospital')) return <Cross className="w-5 h-5" />;
  if (typeLower.includes('police') || typeLower.includes('saps')) return <Shield className="w-5 h-5" />;
  if (typeLower.includes('fire')) return <Flame className="w-5 h-5" />;
  if (typeLower.includes('taxi')) return <Car className="w-5 h-5" />;
  if (typeLower.includes('bus')) return <Bus className="w-5 h-5" />;
  if (typeLower.includes('clinic')) return <HeartPulse className="w-5 h-5" />;
  return <Building className="w-5 h-5" />;
};

// Asset type color mapping
const getAssetTypeStyle = (type: string) => {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('cctv') || typeLower.includes('camera')) return { bg: 'bg-violet-500/20', text: 'text-violet-400' };
  if (typeLower.includes('traffic') || typeLower.includes('signal')) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
  if (typeLower.includes('hospital')) return { bg: 'bg-red-500/20', text: 'text-red-400' };
  if (typeLower.includes('police') || typeLower.includes('saps')) return { bg: 'bg-blue-500/20', text: 'text-blue-400' };
  if (typeLower.includes('fire')) return { bg: 'bg-orange-500/20', text: 'text-orange-400' };
  if (typeLower.includes('taxi')) return { bg: 'bg-purple-500/20', text: 'text-purple-400' };
  if (typeLower.includes('bus')) return { bg: 'bg-cyan-500/20', text: 'text-cyan-400' };
  if (typeLower.includes('clinic')) return { bg: 'bg-pink-500/20', text: 'text-pink-400' };
  return { bg: 'bg-primary/20', text: 'text-primary' };
};

// Physical Address Section - Always rendered consistently
const PhysicalAddressSection = ({ data }: { data: Record<string, unknown> }) => {
  const street = String(data?.street || data?.location || '');
  const suburb = String(data?.suburb || '');
  const areaCode = String(data?.area_code || '');
  const ward = data?.ward_id || data?.ward;
  const municipality = String(data?.municipality || 'City of Cape Town');
  
  const hasAddress = street || suburb || areaCode;
  
  if (!hasAddress) return null;
  
  return (
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <MapPin className="w-3 h-3" />
        <span className="text-[10px] font-mono uppercase tracking-wider">Physical Address</span>
      </div>
      <div className="space-y-1">
        {street && (
          <p className="text-sm font-medium text-foreground">{street}</p>
        )}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {suburb && <span>{suburb}</span>}
          {areaCode && <span>• {areaCode}</span>}
          {ward && <span>• Ward {String(ward)}</span>}
        </div>
        <p className="text-[10px] text-muted-foreground/70">{municipality}</p>
      </div>
    </div>
  );
};

// Status Section
const StatusSection = ({ data, type }: { data: Record<string, unknown>; type: string }) => {
  const status = String(data?.status || 'Unknown');
  const lastUpdated = data?.last_updated || data?.updated_at;
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", getAssetTypeStyle(type).bg)}>
          {getAssetIcon(type)}
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5 font-mono">Status</div>
          <Badge className={cn("font-mono text-xs", getStatusColor(status))}>
            {status.toUpperCase()}
          </Badge>
        </div>
      </div>
      {lastUpdated && (
        <div className="text-right">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-mono">UPDATED</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(String(lastUpdated)).toLocaleString('en-ZA', { 
              day: 'numeric', 
              month: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      )}
    </div>
  );
};

// CCTV Specific Content
const CCTVContent = ({ data }: { data: Record<string, unknown> }) => (
  <div className="grid grid-cols-3 gap-2">
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Camera className="w-3 h-3" />
        <span className="text-[10px] font-mono">TYPE</span>
      </div>
      <div className="text-sm font-semibold capitalize">{String(data?.camera_type || 'Fixed')}</div>
    </div>
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Activity className="w-3 h-3" />
        <span className="text-[10px] font-mono">RESOLUTION</span>
      </div>
      <div className="text-sm font-semibold">{String(data?.resolution || '1080p')}</div>
    </div>
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Shield className="w-3 h-3" />
        <span className="text-[10px] font-mono">OWNER</span>
      </div>
      <div className="text-sm font-semibold capitalize">{String(data?.owner || 'City')}</div>
    </div>
  </div>
);

// Traffic Signal Specific Content
const TrafficSignalContent = ({ data }: { data: Record<string, unknown> }) => (
  <div className="grid grid-cols-3 gap-2">
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <TrafficCone className="w-3 h-3" />
        <span className="text-[10px] font-mono">TYPE</span>
      </div>
      <div className="text-sm font-semibold capitalize">{String(data?.intersection_type || 'Standard')}</div>
    </div>
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Activity className="w-3 h-3" />
        <span className="text-[10px] font-mono">CONTROLLER</span>
      </div>
      <div className="text-sm font-semibold capitalize">{String(data?.controller_type || 'Fixed-time')}</div>
    </div>
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Shield className="w-3 h-3" />
        <span className="text-[10px] font-mono">SYNC</span>
      </div>
      <div className="text-sm font-semibold">{data?.is_synchronized ? 'Yes' : 'No'}</div>
    </div>
  </div>
);

// Emergency Service Content (Hospital, Police, Fire)
const EmergencyServiceContent = ({ data, type }: { data: Record<string, unknown>; type: string }) => {
  const contact = String(data?.contact || data?.saps_contact || data?.fire_contact || data?.hospital_contact || '');
  
  return (
    <div className="space-y-3">
      {contact && (
        <a
          href={`tel:${contact.replace(/\s/g, '')}`}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-all group",
            type.includes('police') && "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30",
            type.includes('fire') && "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30",
            type.includes('hospital') && "bg-red-500/10 hover:bg-red-500/20 border-red-500/30",
            type.includes('clinic') && "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            type.includes('police') && "bg-blue-500/20 group-hover:bg-blue-500",
            type.includes('fire') && "bg-orange-500/20 group-hover:bg-orange-500",
            type.includes('hospital') && "bg-red-500/20 group-hover:bg-red-500",
            type.includes('clinic') && "bg-pink-500/20 group-hover:bg-pink-500"
          )}>
            <Phone className="w-5 h-5 group-hover:text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Emergency Contact</div>
            <div className="text-xs text-muted-foreground font-mono">{contact}</div>
          </div>
        </a>
      )}
      
      {data?.coverage_area && (
        <div className="p-3 rounded-lg bg-background/50 border border-border/30">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">COVERAGE AREA</div>
          <div className="text-sm">{String(data.coverage_area)}</div>
        </div>
      )}
      
      {data?.cluster && (
        <div className="p-3 rounded-lg bg-background/50 border border-border/30">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">CLUSTER</div>
          <div className="text-sm">{String(data.cluster)}</div>
        </div>
      )}
    </div>
  );
};

// Transport Content (Taxi Rank, Bus Stop)
const TransportContent = ({ data }: { data: Record<string, unknown> }) => {
  const routes = data?.routes as string[] | undefined;
  
  return (
    <div className="space-y-3">
      {data?.operating_hours && (
        <div className="p-3 rounded-lg bg-background/50 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-mono">OPERATING HOURS</span>
          </div>
          <div className="text-sm font-semibold">{String(data.operating_hours)}</div>
        </div>
      )}
      
      {routes && routes.length > 0 && (
        <div className="p-3 rounded-lg bg-background/50 border border-border/30">
          <div className="text-[10px] font-mono text-muted-foreground mb-2">ROUTES</div>
          <div className="flex flex-wrap gap-1.5">
            {routes.map((route, idx) => (
              <Badge key={idx} variant="outline" className="text-[10px]">
                {route}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AssetDetailContent = ({ entity }: AssetDetailContentProps) => {
  const data = (entity.data || {}) as Record<string, unknown>;
  const type = entity.type || '';
  
  // Determine specific content based on asset type
  const renderTypeSpecificContent = () => {
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('cctv') || typeLower.includes('camera')) {
      return <CCTVContent data={data} />;
    }
    if (typeLower.includes('traffic') || typeLower.includes('signal')) {
      return <TrafficSignalContent data={data} />;
    }
    if (typeLower.includes('hospital') || typeLower.includes('police') || 
        typeLower.includes('fire') || typeLower.includes('clinic')) {
      return <EmergencyServiceContent data={data} type={typeLower} />;
    }
    if (typeLower.includes('taxi') || typeLower.includes('bus')) {
      return <TransportContent data={data} />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Status Section - Always first */}
      <StatusSection data={data} type={type} />
      
      {/* Physical Address - Always second, consistent location */}
      <PhysicalAddressSection data={data} />
      
      <Separator />
      
      {/* Type-specific content */}
      {renderTypeSpecificContent()}
      
      {/* Coordinates if available */}
      {entity.coordinates && (
        <>
          <Separator />
          <div className="p-3 rounded-lg bg-background/30 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-mono">COORDINATES</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              {entity.coordinates.lat.toFixed(6)}, {entity.coordinates.lng.toFixed(6)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AssetDetailContent;
