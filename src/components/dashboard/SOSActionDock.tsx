import { Shield, Flame, Waves, Mountain, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SOSButton {
  id: string;
  label: string;
  number: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  hoverColor: string;
  glowColor: string;
}

const sosButtons: SOSButton[] = [
  {
    id: 'ccid',
    label: 'CCID',
    number: '021 426 1325',
    icon: Building2,
    color: 'text-violet-100',
    bgColor: 'bg-violet-600',
    hoverColor: 'hover:bg-violet-500',
    glowColor: 'shadow-violet-500/50',
  },
  {
    id: 'saps',
    label: 'SAPS',
    number: '10111',
    icon: Shield,
    color: 'text-blue-100',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-500',
    glowColor: 'shadow-blue-500/50',
  },
  {
    id: 'fire',
    label: 'FIRE',
    number: '021 480 7700',
    icon: Flame,
    color: 'text-red-100',
    bgColor: 'bg-red-600',
    hoverColor: 'hover:bg-red-500',
    glowColor: 'shadow-red-500/50',
  },
  {
    id: 'sea-rescue',
    label: 'SEA',
    number: '087 094 9774',
    icon: Waves,
    color: 'text-cyan-100',
    bgColor: 'bg-cyan-600',
    hoverColor: 'hover:bg-cyan-500',
    glowColor: 'shadow-cyan-500/50',
  },
  {
    id: 'mtn-rescue',
    label: 'MTN',
    number: '021 937 0300',
    icon: Mountain,
    color: 'text-emerald-100',
    bgColor: 'bg-emerald-600',
    hoverColor: 'hover:bg-emerald-500',
    glowColor: 'shadow-emerald-500/50',
  },
];

interface SOSActionDockProps {
  isTravelerMode?: boolean;
}

const SOSActionDock = ({ isTravelerMode = false }: SOSActionDockProps) => {
  // Use 5-column layout for traveler mode, 5 buttons in command center
  const displayButtons = isTravelerMode ? sosButtons : sosButtons;

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-black/95 backdrop-blur-xl border-t-2 border-primary/30',
      'px-4 py-3 safe-area-bottom'
    )}>
      <div className="max-w-[1400px] mx-auto">
        {/* SOS Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Emergency SOS • One-Tap Dial
          </span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>

        {/* SOS Buttons Grid */}
        <div className={cn(
          'grid gap-2',
          isTravelerMode ? 'grid-cols-5' : 'grid-cols-5'
        )}>
          {displayButtons.map((button) => {
            const Icon = button.icon;
            return (
              <a
                key={button.id}
                href={`tel:${button.number.replace(/\s/g, '')}`}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-200',
                  'border-2 border-white/30',
                  button.bgColor,
                  button.hoverColor,
                  'hover:scale-[1.02] active:scale-[0.98]',
                  'shadow-lg hover:shadow-xl',
                  button.glowColor,
                  isTravelerMode ? 'py-4' : 'py-3'
                )}
              >
                <Icon className={cn(
                  'transition-transform',
                  button.color,
                  isTravelerMode ? 'w-8 h-8' : 'w-6 h-6'
                )} strokeWidth={2.5} />
                <span className={cn(
                  'font-bold tracking-wide',
                  button.color,
                  isTravelerMode ? 'text-sm' : 'text-xs'
                )}>
                  {button.label}
                </span>
                <span className={cn(
                  'font-mono opacity-80',
                  button.color,
                  'text-[10px]'
                )}>
                  {button.number}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SOSActionDock;
