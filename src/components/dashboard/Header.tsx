import { useState, useEffect } from 'react';
import { 
  Shield, Bell, Settings, ToggleLeft, ToggleRight, AlertTriangle, Plane,
  Camera, CameraOff, Route, Train, Car, Activity, Phone, Clock, FileWarning
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CitizenReportModal from './CitizenReportModal';

interface HeaderProps {
  isTravelerMode: boolean;
  onToggleTravelerMode: () => void;
}

// Mock stats data - would come from API in production
const dashboardStats = {
  functioning_cameras: 228,
  offline_cameras: 25,
  major_routes: 6,
  train_lines: 4,
  uber_zones: 6,
  incidents_24h: 47,
  system_uptime: 87,
};

const Header = ({ isTravelerMode, onToggleTravelerMode }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount] = useState(3);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getThreatLevel = () => {
    if (dashboardStats.incidents_24h > 60) return { level: 'CRITICAL', color: 'text-red-400 bg-red-500/20 border-red-500/50' };
    if (dashboardStats.incidents_24h > 40) return { level: 'ELEVATED', color: 'text-amber-400 bg-amber-500/20 border-amber-500/50' };
    if (dashboardStats.incidents_24h > 20) return { level: 'MODERATE', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50' };
    return { level: 'LOW', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50' };
  };

  const threatStatus = getThreatLevel();

  return (
    <header className={cn(
      'border-b shadow-xl sticky top-0 z-50',
      isTravelerMode 
        ? 'bg-black border-red-500/40' 
        : 'bg-gradient-header border-primary/20'
    )}>
      <div className="max-w-[2000px] mx-auto px-3 sm:px-4 lg:px-5 py-1.5">
        {/* Top Row - Branding & Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="relative">
              <div className={cn(
                'w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shadow-xl transition-all',
                isTravelerMode 
                  ? 'bg-red-600 glow-red' 
                  : 'bg-gradient-to-br from-primary to-blue-400 glow-blue'
              )}>
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className={cn(
                'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background',
                isTravelerMode ? 'bg-red-500 pulse-danger' : 'bg-safety-good animate-pulse'
              )} />
            </div>
            <div>
              <h1 className="text-base lg:text-xl font-black text-foreground tracking-tight">
                Safe<span className={isTravelerMode ? 'text-red-400' : 'text-primary'}>Sync</span>
              </h1>
              <p className="text-primary/70 text-[8px] lg:text-[9px] font-tactical tracking-wider uppercase hidden sm:block">
                {isTravelerMode ? 'EMERGENCY MODE' : 'SITUATIONAL AWARENESS'}
              </p>
            </div>
          </div>

          {/* Center - Risk Level Ticker & Stats Summary (Command Center Only) */}
          {!isTravelerMode && (
            <div className="hidden lg:flex items-center gap-4">
              {/* Threat Level Badge */}
              <div className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border',
                threatStatus.color
              )}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-tactical font-bold tracking-wider">
                  THREAT: {threatStatus.level}
                </span>
              </div>

              {/* Mini Stats Row */}
              <div className="flex items-center gap-3 text-[10px] font-tactical">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Camera className="w-3 h-3" />
                  <span className="tabular-nums">{dashboardStats.functioning_cameras}</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                  <CameraOff className="w-3 h-3" />
                  <span className="tabular-nums">{dashboardStats.offline_cameras}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Activity className="w-3 h-3" />
                  <span className="tabular-nums">{dashboardStats.incidents_24h}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Report Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg transition-all border-2',
                'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30 hover:border-amber-400'
              )}
            >
              <FileWarning className="w-3.5 h-3.5" />
              <span className="text-[10px] lg:text-xs font-bold hidden sm:inline">
                REPORT
              </span>
            </button>

            {/* Traveler Mode Toggle */}
            <button
              onClick={onToggleTravelerMode}
              className={cn(
                'flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg transition-all border-2',
                isTravelerMode
                  ? 'bg-red-600 border-red-400 text-white hover:bg-red-500 glow-red'
                  : 'bg-card/50 border-border hover:border-primary/50 text-foreground hover:bg-primary/10'
              )}
            >
              <Plane className="w-3.5 h-3.5" />
              <span className="text-[10px] lg:text-xs font-bold hidden sm:inline">
                {isTravelerMode ? 'EXIT' : 'TRAVELER'}
              </span>
              {isTravelerMode ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Alerts Button (Command Center Only) */}
            {!isTravelerMode && (
              <button className={cn(
                'relative p-1.5 rounded-lg transition-all',
                'bg-background/30 hover:bg-background/50 border border-border/50',
                alertCount > 0 && 'text-safety-moderate'
              )}>
                <Bell className="w-4 h-4" />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </button>
            )}

            {/* Settings (Command Center Only) */}
            {!isTravelerMode && (
              <button className="hidden sm:flex p-1.5 rounded-lg bg-background/30 hover:bg-background/50 border border-border/50 transition-all">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* Live Indicator */}
            <div className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md shadow-lg',
              isTravelerMode ? 'bg-red-600 pulse-danger' : 'bg-safety-good/90 pulse-live'
            )}>
              <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
              <span className="text-[10px] font-bold text-foreground hidden sm:inline">LIVE</span>
            </div>

            {/* Time Display (Command Center Only) */}
            {!isTravelerMode && (
              <div className="hidden md:flex items-center gap-2 text-right">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide font-tactical">
                    {currentTime.toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="font-tactical text-xs font-bold text-foreground tabular-nums">
                    {currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar (Command Center Only) - 6 Key Metrics, Compact */}
        {!isTravelerMode && (
          <div className="mt-1.5 pt-1.5 border-t border-border/20">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-1 lg:gap-1.5">
              <StatMini icon={Camera} value={dashboardStats.functioning_cameras} label="Cams" color="emerald" />
              <StatMini icon={CameraOff} value={dashboardStats.offline_cameras} label="Off" color="red" />
              <StatMini icon={Activity} value={dashboardStats.incidents_24h} label="24h" color="amber" />
              <StatMini icon={Route} value={dashboardStats.major_routes} label="Routes" color="blue" className="hidden lg:flex" />
              <StatMini icon={Train} value={dashboardStats.train_lines} label="Trains" color="purple" className="hidden lg:flex" />
              <StatMini icon={Phone} value="10111" label="SOS" color="red" isPhone className="hidden lg:flex" />
            </div>
          </div>
        )}
      </div>

      {/* Citizen Report Modal */}
      <CitizenReportModal open={reportModalOpen} onOpenChange={setReportModalOpen} />
    </header>
  );
};

interface StatMiniProps {
  icon: typeof Camera;
  value: string | number;
  label: string;
  color: 'emerald' | 'red' | 'blue' | 'purple' | 'orange' | 'amber' | 'teal';
  className?: string;
  isPhone?: boolean;
}

const StatMini = ({ icon: Icon, value, label, color, className, isPhone }: StatMiniProps) => {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
  };

  const content = (
    <div className={cn(
      'flex items-center justify-center gap-1 px-1.5 py-1 rounded border transition-all',
      colorClasses[color],
      className
    )}>
      <Icon className="w-2.5 h-2.5 flex-shrink-0" />
      <span className="font-tactical text-[10px] font-bold tabular-nums">{value}</span>
      <span className="text-[7px] text-muted-foreground uppercase hidden xl:inline">{label}</span>
    </div>
  );

  if (isPhone) {
    return <a href="tel:10111">{content}</a>;
  }
  return content;
};

export default Header;