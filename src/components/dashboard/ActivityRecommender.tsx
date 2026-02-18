import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  X, Sparkles, Crown, Clock, MapPin, Star, Heart, 
  Users, Briefcase, Compass, Zap, ChevronRight
} from 'lucide-react';
import SafetyScoreBadge from './SafetyScoreBadge';
import { capeTownAreas, type AreaSafetyData } from '@/data/capeTownSafetyData';

interface ActivityRecommenderProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArea: (area: AreaSafetyData) => void;
}

type PersonaType = 'family' | 'solo' | 'business' | 'adventure';

const personas: { id: PersonaType; label: string; icon: typeof Users; desc: string }[] = [
  { id: 'family', label: 'Family', icon: Users, desc: 'Safe for kids & groups' },
  { id: 'solo', label: 'Solo', icon: Compass, desc: 'Independent traveler' },
  { id: 'business', label: 'Business', icon: Briefcase, desc: 'Professional travel' },
  { id: 'adventure', label: 'Adventure', icon: Zap, desc: 'Thrill-seeker' },
];

const getRecommendations = (persona: PersonaType) => {
  const safe = capeTownAreas.filter(a => a.safetyScore >= 7.0);
  const all = capeTownAreas.flatMap(a =>
    a.recommendedActivities.map(act => ({ ...act, area: a }))
  );

  switch (persona) {
    case 'family':
      return all.filter(a => a.safetyScore >= 8.0 && ['beaches', 'culture', 'shopping'].includes(a.category));
    case 'solo':
      return all.filter(a => a.safetyScore >= 7.0);
    case 'business':
      return all.filter(a => a.safetyScore >= 7.5 && ['dining', 'culture'].includes(a.category));
    case 'adventure':
      return all.filter(a => ['hiking', 'beaches'].includes(a.category));
    default:
      return all;
  }
};

const timeSlots = [
  { label: 'Right now', desc: 'Based on current time safety', highlight: true },
  { label: '2-4pm Today', desc: 'Peak safety window' },
  { label: 'Tomorrow AM', desc: 'Best morning activities' },
];

const ActivityRecommender = memo(({ isOpen, onClose, onSelectArea }: ActivityRecommenderProps) => {
  const [persona, setPersona] = useState<PersonaType>('solo');
  const [favorites, setFavorites] = useState<string[]>([]);

  if (!isOpen) return null;

  const recs = getRecommendations(persona).slice(0, 10);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  return (
    <div className="fixed inset-0 z-[90] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-elite-from" />
            <h2 className="text-lg font-bold text-foreground">Smart Recommender</h2>
            <span className="text-[8px] bg-elite-gradient text-white px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Persona selector */}
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Your Profile</h3>
          <div className="grid grid-cols-4 gap-2">
            {personas.map(p => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2.5 rounded-lg border text-center transition-all",
                  persona === p.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                <p.icon className="w-4 h-4" />
                <span className="text-[10px] font-semibold">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* AI suggestion banner */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">AI Recommendation</span>
            </div>
            <p className="text-sm text-foreground">
              Based on safety data and your {persona} profile, we recommend <strong>Waterfront</strong> area activities today.
            </p>
          </div>

          {/* Time-optimized picks */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Best Time to Visit
            </h3>
            <div className="space-y-1.5">
              {timeSlots.map(slot => (
                <div key={slot.label} className={cn(
                  "p-2.5 rounded-lg border transition-colors cursor-pointer hover:bg-secondary/50",
                  slot.highlight ? "border-primary/30 bg-primary/5" : "border-border"
                )}>
                  <div className="text-sm font-medium text-foreground">{slot.label}</div>
                  <div className="text-xs text-muted-foreground">{slot.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Recommended for You</h3>
            <div className="space-y-2">
              {recs.map((rec, i) => (
                <div
                  key={`${rec.area.id}-${rec.name}-${i}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors cursor-pointer"
                  onClick={() => onSelectArea(rec.area)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{rec.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{rec.area.name}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">Best: {rec.bestTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(rec.name); }}
                    className="p-1"
                  >
                    <Heart className={cn("w-4 h-4", favorites.includes(rec.name) ? "fill-safety-red text-safety-red" : "text-muted-foreground")} />
                  </button>
                  <SafetyScoreBadge score={rec.safetyScore} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ActivityRecommender.displayName = 'ActivityRecommender';
export default ActivityRecommender;
