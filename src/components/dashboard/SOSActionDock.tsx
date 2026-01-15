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
}

const sosButtons: SOSButton[] = [
  {
    id: 'ccid',
    label: 'CCID',
    number: '021 426 1325',
    icon: Building2,
    color: 'text-violet-50',
    bgColor: 'bg-violet-600/90',
    hoverColor: 'hover:bg-violet-500',
  },
  {
    id: 'saps',
    label: 'SAPS',
    number: '10111',
    icon: Shield,
    color: 'text-blue-50',
    bgColor: 'bg-blue-600/90',
    hoverColor: 'hover:bg-blue-500',
  },
  {
    id: 'fire',
    label: 'FIRE',
    number: '021 480 7700',
    icon: Flame,
    color: 'text-red-50',
    bgColor: 'bg-red-600/90',
    hoverColor: 'hover:bg-red-500',
  },
  {
    id: 'sea-rescue',
    label: 'SEA',
    number: '087 094 9774',
    icon: Waves,
    color: 'text-cyan-50',
    bgColor: 'bg-cyan-600/90',
    hoverColor: 'hover:bg-cyan-500',
  },
  {
    id: 'mtn-rescue',
    label: 'MTN',
    number: '021 937 0300',
    icon: Mountain,
    color: 'text-emerald-50',
    bgColor: 'bg-emerald-600/90',
    hoverColor: 'hover:bg-emerald-500',
  },
];

interface SOSActionDockProps {
  isTravelerMode?: boolean;
}

const SOSActionDock = ({ isTravelerMode = false }: SOSActionDockProps) => {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-black/90 backdrop-blur-md border-t border-border/30',
      'px-2 py-1 safe-area-bottom'
    )}>
      <div className="max-w-[1400px] mx-auto">
        {/* SOS Label - Minimal */}
        <div className="flex items-center justify-center gap-1 mb-0.5">
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[6px] font-mono uppercase tracking-widest text-muted-foreground/70">
            SOS • One-Tap
          </span>
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
        </div>

        {/* SOS Buttons Grid - Ultra Compact */}
        <div className="grid grid-cols-5 gap-0.5">
          {sosButtons.map((button) => {
            const Icon = button.icon;
            return (
              <a
                key={button.id}
                href={`tel:${button.number.replace(/\s/g, '')}`}
                className={cn(
                  'flex flex-col items-center justify-center rounded transition-all duration-150',
                  'border border-white/10',
                  button.bgColor,
                  button.hoverColor,
                  'active:scale-95',
                  'py-1'
                )}
              >
                <Icon className={cn(
                  button.color,
                  isTravelerMode ? 'w-3 h-3' : 'w-2.5 h-2.5'
                )} strokeWidth={2.5} />
                <span className={cn(
                  'font-bold tracking-wide',
                  button.color,
                  'text-[6px] mt-0.5'
                )}>
                  {button.label}
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
