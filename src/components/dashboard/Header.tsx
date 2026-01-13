import { useState, useEffect } from 'react';
import { Shield, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gradient-header border-b-2 border-primary/50 shadow-2xl sticky top-0 z-50">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative">
              <div className="w-11 h-11 lg:w-14 lg:h-14 bg-gradient-to-br from-primary to-blue-400 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl glow-blue">
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-safety-good rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-black text-foreground tracking-tight">
                BlueWhale<span className="text-primary">Intelligence</span>
              </h1>
              <p className="text-primary/70 text-[10px] lg:text-xs font-medium tracking-wide uppercase">
                Cape Town Safety Command Center
              </p>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Alerts Button */}
            <button className={cn(
              'relative p-2 lg:p-2.5 rounded-xl transition-all',
              'bg-background/30 hover:bg-background/50 border border-border/50',
              alertCount > 0 && 'text-safety-moderate'
            )}>
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="hidden sm:flex p-2 lg:p-2.5 rounded-xl bg-background/30 hover:bg-background/50 border border-border/50 transition-all">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 bg-safety-good/90 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg shadow-lg pulse-live">
              <div className="w-2 h-2 bg-foreground rounded-full" />
              <span className="text-xs lg:text-sm font-bold text-foreground hidden sm:inline">LIVE</span>
            </div>

            {/* Time Display */}
            <div className="hidden md:block text-right">
              <div className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wide">
                {currentTime.toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="font-mono text-sm lg:text-base font-bold text-foreground tabular-nums">
                {currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
