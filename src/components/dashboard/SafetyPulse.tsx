import { useState, useCallback } from 'react';
import { Shield, ThumbsUp, Minus, AlertTriangle, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type VibeRating = 'safe' | 'neutral' | 'suspicious';

interface PulseEntry {
  rating: VibeRating;
  time: Date;
  area: string;
}

const vibeConfig = {
  safe: { icon: ThumbsUp, label: 'Safe', color: 'bg-safety-green/20 text-safety-green border-safety-green/40 hover:bg-safety-green/30' },
  neutral: { icon: Minus, label: 'Neutral', color: 'bg-safety-yellow/20 text-safety-yellow border-safety-yellow/40 hover:bg-safety-yellow/30' },
  suspicious: { icon: AlertTriangle, label: 'Suspicious', color: 'bg-safety-red/20 text-safety-red border-safety-red/40 hover:bg-safety-red/30' },
} as const;

// Simulated community pulse data
const communityPulse = {
  safe: 67,
  neutral: 22,
  suspicious: 11,
  totalVotes: 342,
};

const SafetyPulse = () => {
  const [selected, setSelected] = useState<VibeRating | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const submitVibe = useCallback((rating: VibeRating) => {
    setSelected(rating);
    setDetecting(true);

    // Get GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetecting(false);
          setHasVoted(true);
          toast.success(`Safety pulse logged: ${vibeConfig[rating].label}`, {
            description: `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          });
        },
        () => {
          setDetecting(false);
          setHasVoted(true);
          toast.success(`Safety pulse logged: ${vibeConfig[rating].label}`);
        },
        { timeout: 5000 }
      );
    } else {
      setDetecting(false);
      setHasVoted(true);
      toast.success(`Safety pulse logged: ${vibeConfig[rating].label}`);
    }
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-foreground text-sm">Safety Pulse</h3>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          <Users className="w-3 h-3 mr-1" />
          {communityPulse.totalVotes} votes
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {/* Community Heatmap Bar */}
        <div>
          <p className="text-[11px] text-muted-foreground mb-2 font-medium uppercase tracking-wider">Community Vibe — Right Now</p>
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="bg-safety-green transition-all" style={{ width: `${communityPulse.safe}%` }} />
            <div className="bg-safety-yellow transition-all" style={{ width: `${communityPulse.neutral}%` }} />
            <div className="bg-safety-red transition-all" style={{ width: `${communityPulse.suspicious}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span className="text-safety-green font-medium">{communityPulse.safe}% Safe</span>
            <span className="text-safety-yellow font-medium">{communityPulse.neutral}% Neutral</span>
            <span className="text-safety-red font-medium">{communityPulse.suspicious}% Alert</span>
          </div>
        </div>

        {/* Vote Buttons */}
        {!hasVoted ? (
          <div>
            <p className="text-xs text-muted-foreground mb-3">How does your area feel right now?</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(vibeConfig) as [VibeRating, typeof vibeConfig.safe][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => submitVibe(key)}
                  disabled={detecting}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-xs font-semibold",
                    selected === key ? config.color : "border-border hover:border-primary/30",
                    detecting && "opacity-50 cursor-wait"
                  )}
                >
                  <config.icon className="w-5 h-5" />
                  {config.label}
                </button>
              ))}
            </div>
            {detecting && (
              <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                <MapPin className="w-3 h-3 animate-pulse text-primary" />
                Detecting location...
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm font-medium text-foreground">
              ✓ Pulse recorded as <span className={cn(
                selected === 'safe' && "text-safety-green",
                selected === 'neutral' && "text-safety-yellow",
                selected === 'suspicious' && "text-safety-red"
              )}>{selected && vibeConfig[selected].label}</span>
            </p>
            <button
              onClick={() => { setHasVoted(false); setSelected(null); }}
              className="text-xs text-primary hover:underline mt-1"
            >
              Update rating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyPulse;
