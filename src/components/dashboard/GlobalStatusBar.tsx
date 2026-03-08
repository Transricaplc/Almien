import { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Camera, Activity, Clock, 
  Bell, Zap, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';
import { useCityIntelligence } from '@/hooks/useCityKPIs';
import { useAssets } from '@/hooks/useAssets';

const GlobalStatusBar = () => {
  const { timeFilter, setTimeFilter } = useDashboard();
  const { activeAlerts, kpis, loading: kpiLoading, lastUpdated, refetch, isRefetching } = useCityIntelligence();
  const { stats, loading: assetsLoading } = useAssets();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const safetyKPI = kpis.find(k => k.kpi_code === 'safety_score');
  const cityHealth = safetyKPI?.current_value ?? 78;
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'HEALTHY', color: 'text-accent-safe bg-accent-safe/10 border-accent-safe/30' };
    if (score >= 60) return { label: 'MODERATE', color: 'text-accent-warning bg-accent-warning/10 border-accent-warning/30' };
    if (score >= 40) return { label: 'ELEVATED', color: 'text-accent-warning bg-accent-warning/10 border-accent-warning/30' };
    return { label: 'CRITICAL', color: 'text-accent-threat bg-accent-threat/10 border-accent-threat/30' };
  };

  const healthStatus = getHealthStatus(cityHealth);
  const criticalAlerts = activeAlerts.filter(a => a.priority === 'critical').length;
  const highRiskZones = 3;

  const isLoading = kpiLoading || assetsLoading;

  return (
    <div className="bg-card/80 backdrop-blur-xl border-b border-border-subtle px-4 py-2">
      <div className="max-w-[2000px] mx-auto flex items-center justify-between gap-4">
        {/* Left: City Health Summary */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
            healthStatus.color,
            isLoading && "animate-pulse"
          )}>
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-system">{healthStatus.label}</span>
            <span className="text-sm font-bold tabular-nums">{cityHealth}</span>
          </div>

          {criticalAlerts > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-threat/10 border border-accent-threat/30 text-accent-threat">
              <Bell className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-system">{criticalAlerts} CRITICAL</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-warning/10 border border-accent-warning/30 text-accent-warning">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs uppercase tracking-system">{highRiskZones} HIGH-RISK</span>
          </div>
        </div>

        {/* Center: Quick Stats */}
        <div className="hidden lg:flex items-center gap-6">
          <QuickStat icon={Camera} value={stats.operationalCCTV} total={stats.totalCCTV} label="CCTV" color="text-accent-info" isLoading={isLoading} />
          <QuickStat icon={Zap} value={stats.operationalSignals} total={stats.totalSignals} label="Signals" color="text-accent-safe" isLoading={isLoading} />
          <QuickStat icon={Activity} value={activeAlerts.length} label="Alerts" color="text-accent-warning" isLoading={isLoading} />
        </div>

        {/* Right: Time Context & Sync */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className={cn(
                "p-1.5 rounded-lg transition-all border",
                isRefetching 
                  ? "bg-accent-safe/10 border-accent-safe/30" 
                  : "bg-surface-01 border-border-subtle hover:border-border-active"
              )}
              title="Refresh data"
            >
              <RefreshCw className={cn(
                "w-3.5 h-3.5 text-muted-foreground",
                isRefetching && "animate-spin text-accent-safe"
              )} />
            </button>
            
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-system bg-accent-safe/10 border border-accent-safe/30 text-accent-safe">
              <div className="w-1.5 h-1.5 bg-accent-safe rounded-full animate-pulse" />
              <span>SYNCED</span>
            </div>
          </div>

          <div className="flex items-center bg-surface-01 rounded-lg p-0.5 border border-border-subtle">
            {(['live', '24h', '7d'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-semibold transition-all",
                  timeFilter === filter
                    ? "bg-accent-safe text-text-inverse"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter === 'live' ? '● LIVE' : filter.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs tabular-nums font-light">
              {currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickStatProps {
  icon: typeof Camera;
  value: number;
  total?: number;
  label: string;
  color: string;
  isLoading?: boolean;
}

const QuickStat = ({ icon: Icon, value, total, label, color, isLoading }: QuickStatProps) => (
  <div className="flex items-center gap-2">
    <Icon className={cn("w-3.5 h-3.5", color)} />
    <div className="text-xs">
      {isLoading ? (
        <span className="inline-block w-8 h-4 bg-muted animate-pulse rounded" />
      ) : (
        <>
          <span className={cn("font-bold tabular-nums", color)}>{value}</span>
          {total !== undefined && <span className="text-muted-foreground">/{total}</span>}
        </>
      )}
    </div>
    <span className="text-[9px] text-muted-foreground uppercase tracking-system">{label}</span>
  </div>
);

export default GlobalStatusBar;
