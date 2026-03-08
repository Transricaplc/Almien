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

    // Get GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords({ lat: -33.9249, lng: 18.4241 }) // fallback Cape Town
      );
    } else {
      setCoords({ lat: -33.9249, lng: 18.4241 });
    }

    // Simulate notifying contacts sequentially
    mockContacts.forEach((_, i) => {
      setTimeout(() => {
        setContacts(prev => prev.map((c, j) => j <= i ? { ...c, notified: true } : c));
      }, 800 * (i + 1));
    });

    // Simulate notifying stewards
    mockStewards.forEach((_, i) => {
      setTimeout(() => {
        setStewards(prev => prev.map((s, j) => j <= i ? { ...s, notified: true } : s));
      }, 1200 * (i + 1) + 2000);
    });

    // Simulate recording
    recordingInterval.current = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 60) {
          if (recordingInterval.current) clearInterval(recordingInterval.current);
          return 60;
        }
        return prev + 1;
      });
    }, 1000);

    // Simulate photos
    photoInterval.current = setInterval(() => {
      setPhotosTaken(prev => prev + 1);
    }, 10000);

    toast.error('🚨 PANIC ALERT ACTIVATED', { duration: 5000 });
  }, []);

  const handleHoldStart = useCallback(() => {
    if (panicActive) return;
    setHolding(true);
    setProgress(0);

    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / 1500) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearTimers();
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
        // Cancel panic
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
      <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-destructive text-destructive-foreground p-4 flex items-center gap-3">
          <Siren className="w-6 h-6 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold">PANIC ALERT ACTIVE</h2>
            <p className="text-xs opacity-80">
              {coords ? `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Acquiring location...'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Contacts status */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-destructive" />
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
                    <span className="flex items-center gap-1 text-xs font-semibold text-safety-green">
                      <Check className="w-3.5 h-3.5" /> Notified
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground animate-pulse">Sending...</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stewards */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-primary" />
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
                    <span className="flex items-center gap-1 text-xs font-semibold text-safety-green">
                      <Check className="w-3.5 h-3.5" /> Alerted
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground animate-pulse">Locating...</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evidence collection */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Evidence Collection</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <Mic className="w-4 h-4 text-destructive" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Audio Recording</p>
                  <p className="text-xs text-muted-foreground">{recordingSeconds}s / 60s</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <Camera className="w-4 h-4 text-destructive" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Photo Capture</p>
                  <p className="text-xs text-muted-foreground">{photosTaken} photos taken</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 col-span-2">
                <MapPin className="w-4 h-4 text-destructive" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Live Location Sharing</p>
                  <p className="text-xs text-muted-foreground">
                    {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Acquiring...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel button */}
        <div className="p-4 border-t border-border bg-card">
          <Button
            variant="outline"
            className="w-full h-12 text-sm font-bold border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={handleCancel}
          >
            <X className="w-4 h-4 mr-2" />
            CANCEL ALERT (tap {3 - cancelTaps}x to confirm)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
      <button
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        className={cn(
          "relative w-16 h-16 rounded-full bg-destructive text-destructive-foreground",
          "flex items-center justify-center shadow-lg shadow-destructive/30",
          "transition-transform duration-150",
          holding ? "scale-110" : "hover:scale-105",
          !holding && "animate-[pulse_2s_ease-in-out_infinite]"
        )}
        aria-label="SOS Panic Button — hold for 1.5 seconds"
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="30"
            fill="none"
            stroke="hsl(var(--destructive-foreground))"
            strokeWidth="3"
            strokeDasharray={`${(progress / 100) * 188.5} 188.5`}
            opacity={holding ? 0.9 : 0}
            className="transition-opacity duration-150"
          />
        </svg>
        <Siren className="w-6 h-6 relative z-10" />
      </button>
      {holding && (
        <p className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-destructive bg-card/90 px-2 py-1 rounded-full border border-destructive/30">
          Hold to activate SOS...
        </p>
      )}
    </div>
  );
});

PanicButton.displayName = 'PanicButton';
export default PanicButton;
