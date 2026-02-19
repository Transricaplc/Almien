import { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Play, Square, AlertTriangle, Clock, MapPin, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type EscortStatus = 'idle' | 'active' | 'warning' | 'expired';

const PRESET_DURATIONS = [
  { label: '15 min', seconds: 15 * 60 },
  { label: '30 min', seconds: 30 * 60 },
  { label: '1 hour', seconds: 60 * 60 },
];

const VirtualEscortTimer = () => {
  const [status, setStatus] = useState<EscortStatus>('idle');
  const [selectedDuration, setSelectedDuration] = useState(PRESET_DURATIONS[1].seconds);
  const [remaining, setRemaining] = useState(0);
  const [copied, setCopied] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startEscort = useCallback(() => {
    // Get GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords({ lat: -33.9249, lng: 18.4241 }) // fallback CT
      );
    }
    setRemaining(selectedDuration);
    setStatus('active');
  }, [selectedDuration]);

  const checkIn = useCallback(() => {
    setStatus('idle');
    setRemaining(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const copyEmergencyInfo = useCallback(async () => {
    const info = [
      `⚠️ GRIDFY SAFETY ALERT`,
      `Timer expired — no check-in received.`,
      coords ? `📍 Last GPS: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : '',
      coords ? `🗺️ https://www.google.com/maps?q=${coords.lat},${coords.lng}` : '',
      ``,
      `🚔 SAPS Emergency: 10111`,
      `🚑 Ambulance: 10177`,
      `🔥 Fire: 021 480 7700`,
      `📞 Cape Town Emergency: 021 480 7700`,
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(info);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = info;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [coords]);

  useEffect(() => {
    if (status === 'active' || status === 'warning') {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setStatus('expired');
            clearInterval(intervalRef.current!);
            return 0;
          }
          if (prev <= 60 && status !== 'warning') {
            setStatus('warning');
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [status]);

  // Auto-trigger alert on expire
  useEffect(() => {
    if (status === 'expired') {
      copyEmergencyInfo();
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⚠️ Gridfy Safety Alert', {
          body: 'Your virtual escort timer has expired. Emergency info copied to clipboard.',
          icon: '/favicon.ico',
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, [status, copyEmergencyInfo]);

  const progress = status !== 'idle' ? ((selectedDuration - remaining) / selectedDuration) * 100 : 0;

  return (
    <div className={cn(
      "bg-card rounded-xl border overflow-hidden transition-all",
      status === 'expired' ? "border-destructive animate-pulse" :
      status === 'warning' ? "border-amber-500" :
      status === 'active' ? "border-primary" :
      "border-border"
    )}>
      {/* Header */}
      <div className={cn(
        "px-4 py-3 border-b border-border flex items-center justify-between",
        status === 'expired' ? "bg-destructive/20" :
        status === 'warning' ? "bg-amber-500/20" :
        status === 'active' ? "bg-primary/10" :
        "bg-primary/5"
      )}>
        <div className="flex items-center gap-2">
          <Shield className={cn(
            "w-5 h-5",
            status === 'expired' ? "text-destructive" :
            status === 'warning' ? "text-amber-500" :
            "text-primary"
          )} />
          <h3 className="font-bold text-foreground text-sm">Virtual Escort</h3>
        </div>
        {status !== 'idle' && (
          <Badge className={cn(
            "text-[10px]",
            status === 'expired' ? "bg-destructive/20 text-destructive" :
            status === 'warning' ? "bg-amber-500/20 text-amber-500" :
            "bg-primary/20 text-primary"
          )}>
            {status === 'expired' ? 'ALERT' : status === 'warning' ? 'CHECK IN NOW' : 'ACTIVE'}
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-4">
        {status === 'idle' && (
          <>
            <p className="text-xs text-muted-foreground">
              Start a safety session. If you don't check in before the timer ends, your GPS and emergency contacts will be copied to your clipboard.
            </p>
            {/* Duration Selector */}
            <div className="flex gap-2">
              {PRESET_DURATIONS.map((d) => (
                <button
                  key={d.seconds}
                  onClick={() => setSelectedDuration(d.seconds)}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    selectedDuration === d.seconds
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <Button onClick={startEscort} className="w-full" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Start Escort Session
            </Button>
          </>
        )}

        {(status === 'active' || status === 'warning') && (
          <>
            {/* Timer Display */}
            <div className="text-center">
              <div className={cn(
                "text-4xl font-mono font-black tabular-nums",
                status === 'warning' ? "text-amber-500" : "text-foreground"
              )}>
                {formatTime(remaining)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">remaining</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  status === 'warning' ? "bg-amber-500" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>

            {coords && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                <MapPin className="w-3 h-3 text-primary" />
                <span className="font-mono">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={checkIn} className="flex-1" size="sm">
                <Check className="w-4 h-4 mr-2" />
                I'm Safe
              </Button>
              <Button onClick={checkIn} variant="outline" size="sm">
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}

        {status === 'expired' && (
          <>
            <div className="text-center space-y-2">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
              <div className="text-lg font-bold text-destructive">Timer Expired</div>
              <p className="text-xs text-muted-foreground">
                Emergency info has been copied to your clipboard. Share it with a trusted contact now.
              </p>
            </div>

            {coords && (
              <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground">
                📍 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={copyEmergencyInfo} variant="outline" className="flex-1" size="sm">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Again'}
              </Button>
              <Button onClick={checkIn} size="sm">
                Dismiss
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VirtualEscortTimer;
