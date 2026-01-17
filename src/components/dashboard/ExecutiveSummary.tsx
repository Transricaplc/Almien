import { useState } from 'react';
import { 
  Shield, TrendingUp, TrendingDown, Minus, 
  AlertTriangle, Activity, Camera, TrafficCone,
  Zap, Wifi, Bell, CheckCircle2, XCircle,
  ChevronRight, RefreshCw, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCityIntelligence, getHealthStatusColor, getPriorityColor, getTrendColor } from '@/hooks/useCityKPIs';
import { useAssets, getStatusColor } from '@/hooks/useAssets';
import { useSuburbIntelligence } from '@/hooks/useSuburbIntelligence';
import { format } from 'date-fns';

// KPI Card Component
const KPICard = ({ 
  label, 
  value, 
  unit, 
  trend, 
  trendPercent,
  target,
  icon: Icon 
}: { 
  label: string;
  value: number;
  unit: string;
  trend: string;
  trendPercent: number | null;
  target: number | null;
  icon: any;
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const progress = target ? Math.min(100, (value / target) * 100) : null;
  
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold">{value.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
            {trendPercent !== null && (
              <div className={cn("flex items-center gap-1 mt-1", getTrendColor(trend))}>
                <TrendIcon className="w-3 h-3" />
                <span className="text-xs">{Math.abs(trendPercent)}%</span>
              </div>
            )}
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
        {progress !== null && (
          <div className="mt-2">
            <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Asset Status Grid
const AssetStatusGrid = () => {
  const { stats, loading } = useAssets();
  
  if (loading) {
    return <div className="animate-pulse bg-muted h-24 rounded-lg" />;
  }
  
  const assetCategories = [
    { 
      label: 'CCTV Cameras', 
      icon: Camera, 
      total: stats.totalCCTV, 
      operational: stats.operationalCCTV,
      color: '#3b82f6'
    },
    { 
      label: 'Traffic Signals', 
      icon: TrafficCone, 
      total: stats.totalSignals, 
      operational: stats.operationalSignals,
      color: '#22c55e'
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {assetCategories.map(cat => {
        const percent = cat.total > 0 ? Math.round((cat.operational / cat.total) * 100) : 0;
        const Icon = cat.icon;
        return (
          <div 
            key={cat.label}
            className="p-3 rounded-lg bg-card/30 border border-border/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="p-1.5 rounded"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <Icon className="w-3 h-3" style={{ color: cat.color }} />
              </div>
              <span className="text-xs font-medium">{cat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold">{cat.operational}</span>
              <span className="text-xs text-muted-foreground">/ {cat.total}</span>
            </div>
            <Progress value={percent} className="h-1 mt-2" />
            <p className="text-[9px] text-muted-foreground mt-1">{percent}% operational</p>
          </div>
        );
      })}
    </div>
  );
};

// Data Source Health Monitor
const DataSourceHealthMonitor = () => {
  const { dataSourceHealth, loading } = useCityIntelligence();
  
  if (loading) {
    return <div className="animate-pulse bg-muted h-20 rounded-lg" />;
  }

  const healthySources = dataSourceHealth.filter(s => s.status === 'healthy').length;
  const totalSources = dataSourceHealth.length;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Data Sources</span>
        <Badge variant="outline" className="text-[9px]">
          {healthySources}/{totalSources} healthy
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1">
        {dataSourceHealth.map(source => (
          <div
            key={source.id}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-card/50 border border-border/30"
            title={`${source.source_name}: ${source.status}`}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full", getHealthStatusColor(source.status))} />
            <span className="text-[9px]">{source.source_name.split('_')[0]}</span>
            {source.is_critical && (
              <AlertTriangle className="w-2 h-2 text-yellow-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Active Alerts Panel
const ActiveAlertsPanel = () => {
  const { activeAlerts, loading } = useCityIntelligence();
  
  if (loading) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg" />;
  }

  if (activeAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
        <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500" />
        <p className="text-xs">No active alerts</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-32">
      <div className="space-y-2">
        {activeAlerts.map(alert => (
          <div 
            key={alert.id}
            className="flex items-start gap-2 p-2 rounded-lg bg-card/30 border border-border/30"
          >
            <Bell className="w-3 h-3 mt-0.5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge className={cn("text-[8px] px-1", getPriorityColor(alert.priority))}>
                  {alert.priority}
                </Badge>
                <span className="text-[9px] text-muted-foreground">
                  {format(new Date(alert.created_at), 'HH:mm')}
                </span>
              </div>
              <p className="text-xs font-medium truncate mt-0.5">{alert.title}</p>
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

// Safety Overview
const SafetyOverview = () => {
  const { suburbs, loading } = useSuburbIntelligence();
  
  if (loading) {
    return <div className="animate-pulse bg-muted h-24 rounded-lg" />;
  }

  const avgSafetyScore = suburbs.length > 0 
    ? Math.round(suburbs.reduce((sum, s) => sum + s.safety_score, 0) / suburbs.length)
    : 0;
  
  const totalIncidents = suburbs.reduce((sum, s) => sum + s.incidents_24h, 0);
  const avgCCTV = suburbs.length > 0
    ? Math.round(suburbs.reduce((sum, s) => sum + s.cctv_coverage, 0) / suburbs.length)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-center p-2 rounded-lg bg-card/30">
        <Shield className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
        <p className="text-lg font-bold">{avgSafetyScore}</p>
        <p className="text-[9px] text-muted-foreground">Avg Safety</p>
      </div>
      <div className="text-center p-2 rounded-lg bg-card/30">
        <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-orange-500" />
        <p className="text-lg font-bold">{totalIncidents}</p>
        <p className="text-[9px] text-muted-foreground">24h Incidents</p>
      </div>
      <div className="text-center p-2 rounded-lg bg-card/30">
        <Camera className="w-4 h-4 mx-auto mb-1 text-blue-500" />
        <p className="text-lg font-bold">{avgCCTV}%</p>
        <p className="text-[9px] text-muted-foreground">CCTV Coverage</p>
      </div>
    </div>
  );
};

// Main Executive Summary Component
const ExecutiveSummary = () => {
  const { kpis, loading, refetch } = useCityIntelligence();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const handleRefresh = async () => {
    await refetch();
    setLastRefresh(new Date());
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 h-full">
      <CardHeader className="py-2 px-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Executive Summary</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {format(lastRefresh, 'HH:mm')}
            </span>
            <button 
              onClick={handleRefresh}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 space-y-4">
        {/* City Safety Overview */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            City Safety Overview
          </h4>
          <SafetyOverview />
        </div>

        {/* Asset Status */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Asset Status
          </h4>
          <AssetStatusGrid />
        </div>

        {/* KPIs Grid */}
        {kpis.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Key Performance Indicators
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {kpis.slice(0, 4).map(kpi => (
                <KPICard
                  key={kpi.id}
                  label={kpi.kpi_name}
                  value={kpi.current_value}
                  unit={kpi.unit}
                  trend={kpi.trend}
                  trendPercent={kpi.trend_percent}
                  target={kpi.target_value}
                  icon={Shield}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Active Alerts
          </h4>
          <ActiveAlertsPanel />
        </div>

        {/* Data Source Health */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            System Health
          </h4>
          <DataSourceHealthMonitor />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummary;
