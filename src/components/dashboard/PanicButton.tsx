import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { Siren, X, Check, Mic, Camera, MapPin, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PanicContact {
  name: string;
  role: string;
  notified: boolean;
}

const mockContacts: PanicContact[] = [
  { name: 'Mom', role: 'Primary Contact', notified: false },
  { name: 'Partner', role: 'Primary Contact', notified: false },
  { name: 'ADT Armed Response', role: 'Armed Response', notified: false },
];

const mockStewards = [
  { name: 'Steward J. Mtolo', distance: '120m', notified: false },
  { name: 'Steward N. Davids', distance: '340m', notified: false },
  { name: 'Steward T. Swart', distance: '480m', notified: false },
];

const PanicButton = memo(() => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [panicActive, setPanicActive] = useState(false);
  const [contacts, setContacts] = useState(mockContacts);
  const [stewards, setStewards] = useState(mockStewards);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [photosTaken, setPhotosTaken] = useState(0);
  const [cancelTaps, setCancelTaps] = useState(0);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const photoInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    holdTimer.current = null;
    progressInterval.current = null;
  }, []);

  const triggerPanic = useCallback(() => {
    setPanicActive(true);
    setProgress(100);
    setHolding(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords({ lat: -33.9249, lng: 18.4241 })
      );
    } else {
      setCoords({ lat: -33.9249, lng: 18.4241 });
    }

    mockContacts.forEach((_, i) => {
      setTimeout(() => {
        setContacts(prev => prev.map((c, j) => j <= i ? { ...c, notified: true } : c));
      }, 800 * (i + 1));
    });

    mockStewards.forEach((_, i) => {
      setTimeout(() => {
        setStewards(prev => prev.map((s, j) => j <= i ? { ...s, notified: true } : s));
      }, 1200 * (i + 1) + 2000);
    });

    recordingInterval.current = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 60) {
          if (recordingInterval.current) clearInterval(recordingInterval.current);
          return 60;
        }
        return prev + 1;
      });
    }, 1000);

    photoInterval.current = setInterval(() => {
      setPhotosTaken(prev => prev + 1);
    }, 10000);

    toast.error('🚨 PANIC ALERT ACTIVATED', { duration: 5000 });
  }, []);

  const handleHoldStart = useCallback(() => {
    if (panicActive) return;
    setHolding(true);
    setProgress(0);
    try { navigator.vibrate?.([20]); } catch {}

    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / 1500) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearTimers();
        try { navigator.vibrate?.([100, 50, 100, 50, 200]); } catch {}
        triggerPanic();
      }
    }, 30);
  }, [panicActive, clearTimers, triggerPanic]);

  const handleHoldEnd = useCallback(() => {
    if (!panicActive) {
      setHolding(false);
      setProgress(0);
      clearTimers();
    }
  }, [panicActive, clearTimers]);

  const handleCancel = useCallback(() => {
    setCancelTaps(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setPanicActive(false);
        setProgress(0);
        setContacts(mockContacts);
        setStewards(mockStewards);
        setRecordingSeconds(0);
        setPhotosTaken(0);
        setCoords(null);
        setCancelTaps(0);
        if (recordingInterval.current) clearInterval(recordingInterval.current);
        if (photoInterval.current) clearInterval(photoInterval.current);
        toast.success('Panic alert cancelled');
        return 0;
      }
      toast.warning(`Tap ${3 - next} more time${3 - next > 1 ? 's' : ''} to cancel`);
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      if (recordingInterval.current) clearInterval(recordingInterval.current);
      if (photoInterval.current) clearInterval(photoInterval.current);
    };
  }, [clearTimers]);

  // Panic status overlay
  if (panicActive) {
    return (
      <div className="fixed inset-0 z-[9999] bg-surface-deep/95 backdrop-blur-sm flex flex-col animate-fade-in">
        <div className="bg-accent-threat text-white p-4 flex items-center gap-3">
          <Siren className="w-6 h-6 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold">PANIC ALERT ACTIVE</h2>
            <p className="text-xs opacity-80">
              {coords ? `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Acquiring location...'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="rounded-xl border border-border-subtle bg-card p-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-accent-threat" />
              Trusted Network
            </h3>
            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <div>
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{c.role}</span>
                  </div>
                  {c.notified ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-accent-safe">
                      <Check className="w-3.5 h-3.5" /> Notified
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground animate-pulse">Sending...</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card p-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-accent-safe" />
              Community Stewards (500m radius)
            </h3>
            <div className="space-y-2">
              {stewards.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <div>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{s.distance}</span>
                  </div>
                  {s.notified ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-accent-safe">
                      <Check className="w-3.5 h-3.5" /> Alerted
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground animate-pulse">Locating...</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Evidence Collection</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-threat/10 border border-accent-threat/20">
                <Mic className="w-4 h-4 text-accent-threat" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Audio</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{recordingSeconds}s / 60s</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-threat/10 border border-accent-threat/20">
                <Camera className="w-4 h-4 text-accent-threat" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Photos</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{photosTaken} taken</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-threat/10 border border-accent-threat/20 col-span-2">
                <MapPin className="w-4 h-4 text-accent-threat" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Live Location</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Acquiring...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border-subtle bg-card">
          <Button
            variant="outline"
            className="w-full h-12 text-sm font-bold border-accent-threat/30 text-accent-threat hover:bg-accent-threat/10"
            onClick={handleCancel}
          >
            <X className="w-4 h-4 mr-2" />
            CANCEL ALERT (tap {3 - cancelTaps}x to confirm)
          </Button>
        </div>
      </div>
    );
  }

  // Floating SOS button — the ONLY element with a shadow
  return (
    <div className="fixed z-[95] left-4 md:left-auto md:right-6 md:bottom-6" style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom, 0px) + 16px)' }}>
      <button
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        className={cn(
          "relative w-[64px] h-[64px] rounded-full bg-accent-threat text-white",
          "flex items-center justify-center",
          "transition-transform duration-150",
          holding ? "scale-110" : "hover:scale-105",
          !holding && "pulse-sos"
        )}
        aria-label="SOS Panic Button — hold for 1.5 seconds"
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="29"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray={`${(progress / 100) * 182.2} 182.2`}
            opacity={holding ? 0.9 : 0}
            className="transition-opacity duration-150"
          />
        </svg>
        <span className="relative z-10 text-sm font-bold">SOS</span>
      </button>
      {holding && (
        <p className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-accent-threat bg-card/90 px-2 py-1 rounded-full border border-accent-threat/30">
          Hold to activate SOS...
        </p>
      )}
    </div>
  );
});

PanicButton.displayName = 'PanicButton';
export default PanicButton;
