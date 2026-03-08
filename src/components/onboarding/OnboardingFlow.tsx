import { useState, memo } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, UserPlus, Bell, Locate, ArrowRight, Check, SkipForward, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const crimeTypes = [
  { id: 'robbery', label: 'Robbery & Mugging' },
  { id: 'burglary', label: 'Home Burglary' },
  { id: 'vehicle', label: 'Vehicle Crime' },
  { id: 'assault', label: 'Assault' },
  { id: 'gbv', label: 'Gender-Based Violence' },
  { id: 'drugs', label: 'Drug Activity' },
  { id: 'hijacking', label: 'Hijacking' },
  { id: 'housebreaking', label: 'Housebreaking' },
];

const OnboardingFlow = memo(({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [suburb, setSuburb] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set(['robbery', 'burglary']));

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const skip = () => next();

  const toggleAlert = (id: string) => {
    setSelectedAlerts((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => next(), () => next());
    } else {
      next();
    }
  };

  const enableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => onComplete());
    } else {
      onComplete();
    }
  };

  const screens = [
    // Screen 1: Identity
    <div key="welcome" className="flex flex-col items-center justify-center text-center gap-8 px-8 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center">
        <Shield className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Gridfy</h1>
        <p className="text-lg text-foreground mt-2">Safety Intelligence.</p>
        <p className="text-lg text-foreground">Every South African.</p>
        <p className="text-sm text-muted-foreground mt-3">Built for Cape Town. Built for real life.</p>
      </div>
      <Button size="lg" className="mt-4 min-w-[200px] min-h-[48px] text-base font-bold rounded-full" onClick={next}>
        Get Started <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>,

    // Screen 2: Location permission
    <div key="location" className="flex flex-col items-center text-center gap-6 px-8 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
        <Locate className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Know your risk in real time</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          Gridfy uses your location to show live crime data for your exact area.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
        <Button className="min-h-[48px] text-base font-bold rounded-full" onClick={requestLocation}>
          Allow Location
        </Button>
        <Button variant="outline" className="min-h-[48px] rounded-full" onClick={skip}>
          Set Manually
        </Button>
      </div>
    </div>,

    // Screen 3: Home suburb
    <div key="suburb" className="flex flex-col items-center text-center gap-6 px-8 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
        <MapPin className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Where do you spend most of your time?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          Your daily briefing is built around this area.
        </p>
      </div>
      <Input
        placeholder="e.g. Rondebosch, Khayelitsha, Stellenbosch"
        value={suburb}
        onChange={(e) => setSuburb(e.target.value)}
        className="max-w-xs min-h-[48px] text-base rounded-xl"
      />
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="min-h-[48px] rounded-full" onClick={skip}>
          <SkipForward className="w-4 h-4 mr-2" /> Skip
        </Button>
        <Button className="min-h-[48px] min-w-[120px] rounded-full" onClick={next} disabled={!suburb.trim()}>
          Continue <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>,

    // Screen 4: Trusted Contact
    <div key="contact" className="flex flex-col items-center text-center gap-6 px-8 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
        <UserPlus className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Who should know if you need help?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          They'll be notified immediately in a panic event.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Input placeholder="Contact name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="min-h-[48px] rounded-xl" />
        <Input placeholder="Phone number" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="min-h-[48px] rounded-xl" />
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={skip} className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2">
          Skip
        </button>
        <Button className="min-h-[48px] min-w-[120px] rounded-full" onClick={next}>
          Continue <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>,

    // Screen 5: Notifications
    <div key="notifications" className="flex flex-col items-center text-center gap-6 px-8 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
        <Bell className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Never miss a threat in your area</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          Gridfy alerts you to incidents near you, in real time.
        </p>
      </div>
      {/* Alert preferences */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {crimeTypes.map((ct) => (
          <button
            key={ct.id}
            onClick={() => toggleAlert(ct.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium min-h-[48px] transition-colors',
              selectedAlerts.has(ct.id)
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {selectedAlerts.has(ct.id) && <Check className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate text-xs">{ct.label}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
        <Button className="min-h-[48px] text-base font-bold rounded-full" onClick={enableNotifications}>
          Enable Alerts
        </Button>
        <button onClick={onComplete} className="text-sm font-medium text-muted-foreground hover:text-foreground py-2">
          Skip
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-8 pb-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === step ? 'w-8 bg-primary' : i < step ? 'w-2 bg-primary/50' : 'w-2 bg-border'
            )}
          />
        ))}
      </div>

      {/* Screen content */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        {screens[step]}
      </div>
    </div>
  );
});

OnboardingFlow.displayName = 'OnboardingFlow';
export default OnboardingFlow;
