import { useState, useEffect } from 'react';
import { 
  Shield, Bell, AlertTriangle, Clock, Activity, 
  Wifi, WifiOff, Settings, Plane, ToggleLeft, ToggleRight, FileWarning
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import CitizenReportModal from './CitizenReportModal';

/**
 * Top Status Bar - Global Context & Alerts
 * Shows: Branding, Threat Level, Connection Status, Time, Quick Actions
 */

interface TopStatusBarProps {
  isTravelerMode: boolean;
  onToggleTravelerMode: () => void;
  alertCount?: number;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
}

const TopStatusBar = ({
  isTravelerMode,
  onToggleTravelerMode,
  alertCount = 0,
  connectionStatus = 'connected',
}: TopStatusBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const threatLevel = getThreatLevel(alertCount);

  return (
    <header className={cn(
      "h-12 border-b flex items-center justify-between px-4 sticky top-0 z-50",
      isTravelerMode 
        ? "bg-black border-red-500/40" 
        : "bg-card/95 backdrop-blur-xl border-border/50"
    )}>
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isTravelerMode 
              ? "bg-red-600 glow-red" 
              : "bg-gradient-to-br from-primary to-blue-400 glow-blue"
          )}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background",
            isTravelerMode ? "bg-red-500 pulse-danger" : "bg-emerald-500 pulse-live"
          )} />
        </div>
        <div>
          <h1 className="text-sm font-black text-foreground tracking-tight">
            Safe<span className={isTravelerMode ? "text-red-400" : "text-primary"}>Sync</span>
          </h1>
          <p className="text-[8px] text-muted-foreground font-tactical uppercase tracking-wider">
            {isTravelerMode ? "EMERGENCY MODE" : "CITY INTEL • SYNCED SAFE"}
          </p>
        </div>
      </div>

      {/* Center: Status Indicators */}
      {!isTravelerMode && (
        <div className="flex items-center gap-4">
          {/* Threat Level */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-md border",
            threatLevel.color
          )}>
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[10px] font-tactical font-bold tracking-wider">
              THREAT: {threatLevel.level}
            </span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            {connectionStatus === 'connected' ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">LIVE</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="text-amber-400">SYNCING</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-red-400" />
                <span className="text-red-400">OFFLINE</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Report Button */}
        <button
          onClick={() => setReportModalOpen(true)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all border",
            "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
          )}
        >
          <FileWarning className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold hidden sm:inline">REPORT</span>
        </button>

        {/* Traveler Mode Toggle */}
        <button
          onClick={onToggleTravelerMode}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all border",
            isTravelerMode
              ? "bg-red-600 border-red-400 text-white hover:bg-red-500 glow-red"
              : "bg-muted/30 border-border hover:border-primary/50 hover:bg-primary/10"
          )}
        >
          <Plane className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold hidden sm:inline">
            {isTravelerMode ? "EXIT" : "TRAVELER"}
          </span>
          {isTravelerMode ? (
            <ToggleRight className="w-3.5 h-3.5" />
          ) : (
            <ToggleLeft className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Alerts */}
        {!isTravelerMode && (
          <button className={cn(
            "relative p-1.5 rounded-md transition-all",
            "bg-muted/30 hover:bg-muted/50 border border-border/50",
            alertCount > 0 && "text-amber-400"
          )}>
            <Bell className="w-4 h-4" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Staff Link */}
        <Link
          to="/auth"
          className="hidden sm:flex px-2.5 py-1.5 rounded-md bg-muted/30 hover:bg-muted/50 border border-border/50 transition-all text-[10px] font-bold"
        >
          STAFF
        </Link>

        {/* Time */}
        {!isTravelerMode && (
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border/50">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <div className="text-right">
              <div className="text-[8px] text-muted-foreground uppercase font-tactical">
                {currentTime.toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-[10px] font-tactical font-bold text-foreground tabular-nums">
                {currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Citizen Report Modal */}
      <CitizenReportModal open={reportModalOpen} onOpenChange={setReportModalOpen} />
    </header>
  );
};

// Helper to determine threat level
const getThreatLevel = (alertCount: number) => {
  if (alertCount > 10) return { level: 'CRITICAL', color: 'text-red-400 bg-red-500/20 border-red-500/50' };
  if (alertCount > 5) return { level: 'ELEVATED', color: 'text-amber-400 bg-amber-500/20 border-amber-500/50' };
  if (alertCount > 2) return { level: 'MODERATE', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50' };
  return { level: 'LOW', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50' };
};

export default TopStatusBar;
