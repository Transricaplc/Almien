import { memo } from 'react';
import { TrendingDown, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileHeroHeaderProps {
  score: number;
  changePercent: number;
  suburb: string;
}

const MobileHeroHeader = memo(({ score, changePercent, suburb }: MobileHeroHeaderProps) => {
  const isImproving = changePercent >= 0;

  return (
    <div className="rounded-2xl bg-card border border-border-subtle p-6 relative overflow-hidden">
      {/* Subtle mesh gradient bg */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, hsl(var(--accent-safe)), transparent 60%), radial-gradient(ellipse at 80% 20%, hsl(var(--accent-info)), transparent 50%)',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-system">
            {suburb} · Safety Index
          </span>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-6xl font-black text-foreground tabular-nums leading-none">
            {score.toFixed(1)}
          </span>
          <span className="text-lg text-muted-foreground font-medium mb-1">/ 10</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold',
              isImproving
                ? 'bg-accent-safe/15 text-accent-safe'
                : 'bg-accent-threat/15 text-accent-threat'
            )}
          >
            {isImproving ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isImproving ? '+' : ''}
            {changePercent}% today
          </span>
          <span className="text-[10px] text-muted-foreground">vs. yesterday</span>
        </div>
      </div>
    </div>
  );
});

MobileHeroHeader.displayName = 'MobileHeroHeader';
export default MobileHeroHeader;
