import { useState, useEffect, memo } from 'react';
import { Shield, Flame, Waves, Mountain, Building2, ChevronUp, ChevronDown, Lock, FileText, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SOSButton {
  id: string;
  label: string;
  number: string;
  icon: typeof Shield;
  bgColor: string;
}

const sosButtons: SOSButton[] = [
  { id: 'ccid', label: 'CCID', number: '021 426 1325', icon: Building2, bgColor: 'bg-violet-600' },
  { id: 'saps', label: 'SAPS', number: '10111', icon: Shield, bgColor: 'bg-blue-600' },
  { id: 'fire', label: 'FIRE', number: '021 480 7700', icon: Flame, bgColor: 'bg-red-600' },
  { id: 'sea-rescue', label: 'SEA', number: '087 094 9774', icon: Waves, bgColor: 'bg-cyan-600' },
  { id: 'mtn-rescue', label: 'RESCUE', number: '021 937 0300', icon: Mountain, bgColor: 'bg-emerald-600' },
];

interface SOSActionDockProps {
  isTravelerMode?: boolean;
  /** When true, render as a collapsible FAB suitable for overlaying the map */
  mapMode?: boolean;
}

const SOSActionDock = memo(({ isTravelerMode = false, mapMode = false }: SOSActionDockProps) => {
  const [expanded, setExpanded] = useState(isTravelerMode);
  const [showLegal, setShowLegal] = useState(false);

  // Keep expanded in traveler mode
  useEffect(() => {
    if (isTravelerMode) setExpanded(true);
  }, [isTravelerMode]);

  // ── MAP MODE: collapsible FAB (sits above bottom nav, left side) ──
  if (mapMode) {
    return (
      <div
        className="fixed z-[88] left-4 flex flex-col-reverse items-start gap-2"
        style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom, 0px) + 84px)' }}
      >
        <button
          onClick={() => setExpanded(v => !v)}
          className={cn(
            'flex items-center gap-2 h-11 px-4 rounded-full font-bold shadow-xl transition-all min-w-[44px]',
            expanded
              ? 'bg-[hsl(var(--surface-02))] border border-border-subtle text-foreground'
              : 'bg-accent-threat text-white pulse-sos'
          )}
          aria-label={expanded ? 'Close SOS menu' : 'Open SOS menu'}
        >
          {expanded ? (
            <>
              <X className="w-4 h-4" />
              <span className="text-xs">Close</span>
            </>
          ) : (
            <>
              <Phone className="w-4 h-4" />
              <span className="text-xs font-neural tracking-wider">SOS</span>
            </>
          )}
        </button>

        {expanded && (
          <div className="flex flex-col gap-2 animate-fade-in">
            {sosButtons.map(btn => {
              const Icon = btn.icon;
              return (
                <a
                  key={btn.id}
                  href={`tel:${btn.number.replace(/\s/g, '')}`}
                  className={cn(
                    'flex items-center gap-2 px-3 h-11 rounded-full text-white text-xs font-bold shadow-lg min-w-[44px]',
                    btn.bgColor
                  )}
                  aria-label={`Call ${btn.label} at ${btn.number}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                  <div className="text-left leading-tight">
                    <div className="text-[10px] font-bold">{btn.label}</div>
                    <div className="text-[8px] opacity-80 font-mono">{btn.number}</div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'fixed left-0 right-0 z-[85]',
      'bg-[hsl(210_30%_3%/0.95)] backdrop-blur-md border-t border-[hsl(var(--border-subtle))]',
      // Sit above bottom nav (64px + safe area)
      'bottom-[76px]',
    )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-[1400px] mx-auto px-2">

        {/* ── COLLAPSED BAR ── */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full flex items-center justify-between h-12 px-3"
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono font-bold text-accent-safe tracking-wider">SOS</span>
            </div>
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* ── EXPANDED STATE ── */}
        {expanded && (
          <div className="py-2">
            {/* Collapse toggle */}
            {!isTravelerMode && (
              <button
                onClick={() => setExpanded(false)}
                className="w-full flex items-center justify-center gap-1 py-1 text-[9px] text-muted-foreground/60 hover:text-muted-foreground transition-colors mb-1"
              >
                <ChevronDown className="w-3 h-3" />
                <span>Collapse</span>
              </button>
            )}

            {/* SOS Label */}
            <div className="flex items-center justify-center gap-1 pb-1">
              <div className="w-1 h-1 bg-destructive rounded-full animate-pulse" />
              <span className="text-[7px] font-mono uppercase tracking-widest text-muted-foreground/70">
                SOS • One-Tap Emergency
              </span>
              <div className="w-1 h-1 bg-destructive rounded-full animate-pulse" />
            </div>

            {/* SOS Buttons */}
            <div className="grid grid-cols-5 gap-1">
              {sosButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <a
                    key={button.id}
                    href={`tel:${button.number.replace(/\s/g, '')}`}
                    className={cn(
                      'flex flex-col items-center justify-center rounded-lg transition-all duration-100',
                      'border border-white/10 active:scale-95',
                      button.bgColor,
                      isTravelerMode ? 'py-3' : 'py-2',
                    )}
                    aria-label={`Call ${button.label} at ${button.number}`}
                  >
                    <Icon className={cn(
                      'text-white',
                      isTravelerMode ? 'w-4 h-4' : 'w-3 h-3'
                    )} strokeWidth={2.5} />
                    <span className="text-white font-bold tracking-wide text-[8px] mt-0.5">
                      {button.label}
                    </span>
                    <span className="text-white/70 font-mono text-[7px]">
                      {button.number}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Legal Compliance — collapsible accordion */}
            <Collapsible open={showLegal} onOpenChange={setShowLegal}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-center gap-1 py-1 mt-1 text-[8px] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                  {showLegal ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronUp className="w-2.5 h-2.5" />}
                  <span>{showLegal ? 'Hide' : ''} Legal & Compliance</span>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="py-2 border-t border-[hsl(var(--border-subtle)/0.2)] mt-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[9px]">
                  <LegalCard icon={Shield} title="POPIA Compliant" color="text-primary">
                    Almien complies with POPIA. No personally identifiable surveillance data stored.
                  </LegalCard>
                  <LegalCard icon={Lock} title="CoCT CCTV By-Law" color="text-emerald-400">
                    Adheres to City of Cape Town's CCTV By-Law (2023) for third-party systems.
                  </LegalCard>
                  <LegalCard icon={FileText} title="Data Transparency" color="text-amber-400">
                    Aggregates public OSINT signals and municipal data. No live CCTV footage processed.
                  </LegalCard>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-[8px] text-muted-foreground/70 font-mono">
                    Almien is a product of <span className="font-semibold">Evenor Holdings (Pty) Ltd</span> © {new Date().getFullYear()}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    </div>
  );
});

SOSActionDock.displayName = 'SOSActionDock';

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
