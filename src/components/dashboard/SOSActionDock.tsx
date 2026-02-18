import { useState, memo } from 'react';
import { Shield, Flame, Waves, Mountain, Building2, ChevronUp, ChevronDown, Lock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

/**
 * SOS Action Dock — v1.1 Stabilized
 * 
 * Fixed bottom, z-50
 * Compact: 40px collapsed, expands for legal
 * Never obstructs map gestures on mobile
 */

interface SOSButton {
  id: string;
  label: string;
  number: string;
  icon: typeof Shield;
  bgColor: string;
  hoverColor: string;
}

const sosButtons: SOSButton[] = [
  { id: 'ccid', label: 'CCID', number: '021 426 1325', icon: Building2, bgColor: 'bg-violet-600/90', hoverColor: 'hover:bg-violet-500' },
  { id: 'saps', label: 'SAPS', number: '10111', icon: Shield, bgColor: 'bg-blue-600/90', hoverColor: 'hover:bg-blue-500' },
  { id: 'fire', label: 'FIRE', number: '021 480 7700', icon: Flame, bgColor: 'bg-red-600/90', hoverColor: 'hover:bg-red-500' },
  { id: 'sea-rescue', label: 'SEA', number: '087 094 9774', icon: Waves, bgColor: 'bg-cyan-600/90', hoverColor: 'hover:bg-cyan-500' },
  { id: 'mtn-rescue', label: 'MTN', number: '021 937 0300', icon: Mountain, bgColor: 'bg-emerald-600/90', hoverColor: 'hover:bg-emerald-500' },
];

interface SOSActionDockProps {
  isTravelerMode?: boolean;
}

const SOSActionDock = memo(({ isTravelerMode = false }: SOSActionDockProps) => {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-background/90 backdrop-blur-md border-t border-border/30',
      'px-2 safe-area-bottom'
    )}>
      <div className="max-w-[1400px] mx-auto">
        {/* Legal/Compliance — collapsible */}
        <Collapsible open={showLegal} onOpenChange={setShowLegal}>
          <CollapsibleContent className="py-2 border-b border-border/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[9px]">
              <LegalCard icon={Shield} title="POPIA Compliant" color="text-primary">
                Gridfy complies with POPIA. No personally identifiable surveillance data stored.
              </LegalCard>
              <LegalCard icon={Lock} title="CoCT CCTV By-Law" color="text-emerald-400">
                Adheres to City of Cape Town's CCTV By-Law (2023) for third-party systems.
              </LegalCard>
              <LegalCard icon={FileText} title="Data Transparency" color="text-amber-400">
                Aggregates public OSINT signals and municipal data. No live CCTV footage processed.
              </LegalCard>
            </div>
            <div className="mt-2 p-1.5 bg-muted/20 rounded text-center">
              <p className="text-[8px] text-muted-foreground font-mono">
                Gridfy provides aggregated safety intelligence for informational purposes. In emergencies, always contact official services directly.
              </p>
            </div>
            <div className="mt-1 text-center">
              <p className="text-[8px] text-muted-foreground/70">
                Gridfy is a product of <span className="font-semibold">Evenor Holdings (Pty) Ltd</span> © {new Date().getFullYear()}
              </p>
            </div>
          </CollapsibleContent>

          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-center gap-1 py-0.5 text-[8px] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              {showLegal ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronUp className="w-2.5 h-2.5" />}
              <span>{showLegal ? 'Hide' : ''} Legal & Compliance</span>
            </button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* SOS Label */}
        <div className="flex items-center justify-center gap-1 py-0.5">
          <div className="w-1 h-1 bg-destructive rounded-full animate-pulse" />
          <span className="text-[6px] font-mono uppercase tracking-widest text-muted-foreground/70">
            SOS • One-Tap
          </span>
          <div className="w-1 h-1 bg-destructive rounded-full animate-pulse" />
        </div>

        {/* SOS Buttons — fixed height grid */}
        <div className="grid grid-cols-5 gap-0.5 pb-1">
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
                  'text-white',
                  isTravelerMode ? 'w-3 h-3' : 'w-2.5 h-2.5'
                )} strokeWidth={2.5} />
                <span className="text-white font-bold tracking-wide text-[6px] mt-0.5">
                  {button.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
});

SOSActionDock.displayName = 'SOSActionDock';

// Sub-component
const LegalCard = memo(({ icon: Icon, title, color, children }: {
  icon: any; title: string; color: string; children: React.ReactNode;
}) => (
  <div className="flex items-start gap-2 p-2 rounded bg-card/20">
    <Icon className={cn("w-3 h-3 shrink-0 mt-0.5", color)} />
    <div>
      <span className="font-semibold">{title}</span>
      <p className="text-muted-foreground leading-tight">{children}</p>
    </div>
  </div>
));

LegalCard.displayName = 'LegalCard';

export default SOSActionDock;
