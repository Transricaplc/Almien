import { useCitizenReports, CitizenReport } from '@/hooks/useCitizenReports';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Flame, 
  Car, 
  AlertTriangle, 
  Construction, 
  Lightbulb, 
  Droplets, 
  TrafficCone,
  Zap,
  Clock,
  MapPin
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const getReportIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    fire: <Flame className="h-4 w-4 text-orange-500" />,
    accident: <Car className="h-4 w-4 text-red-500" />,
    crime: <AlertTriangle className="h-4 w-4 text-red-600" />,
    hazard: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    pothole: <Construction className="h-4 w-4 text-amber-600" />,
    streetlight: <Lightbulb className="h-4 w-4 text-yellow-400" />,
    water_leak: <Droplets className="h-4 w-4 text-blue-500" />,
    traffic_signal: <TrafficCone className="h-4 w-4 text-orange-500" />,
    power_outage: <Zap className="h-4 w-4 text-yellow-500" />,
    infrastructure: <Construction className="h-4 w-4 text-muted-foreground" />,
  };
  return icons[type] || <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    investigating: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return variants[status] || variants.pending;
};

const ReportItem = ({ report }: { report: CitizenReport }) => {
  const timeAgo = formatDistanceToNow(new Date(report.created_at), { addSuffix: true });
  
  return (
    <div className="p-3 border border-border/50 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-muted/50">
          {getReportIcon(report.infrastructure_type || report.report_type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm capitalize truncate">
              {(report.infrastructure_type || report.report_type).replace(/_/g, ' ')}
            </span>
            <Badge variant="outline" className={`text-xs shrink-0 ${getStatusBadge(report.status)}`}>
              {report.status}
            </Badge>
          </div>
          {report.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {report.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
            {report.latitude && report.longitude && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Located
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveReportFeed = () => {
  const { data: reports, isLoading } = useCitizenReports();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No reports yet</p>
        <p className="text-xs">Be the first to report an incident</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Reports
        </h3>
        <Badge variant="secondary" className="text-xs">
          {reports.length} reports
        </Badge>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-2">
          {reports.map((report) => (
            <ReportItem key={report.id} report={report} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LiveReportFeed;
