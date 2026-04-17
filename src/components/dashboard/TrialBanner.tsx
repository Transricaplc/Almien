import { memo } from 'react';
import { Crown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useElite } from '@/hooks/useElite';

interface TrialBannerProps {
  onUpgrade: () => void;
  onDismiss?: () => void;
}

/**
 * Slim banner shown above ThreatHeader when:
 *  - User is on the active 7-day Safi trial → countdown + upgrade CTA
 *  - User's trial just expired → gentle conversion prompt (one-time)
 *
 * Hidden entirely for `free` users with no trial history and for paying Elite users.
 */
const TrialBanner = memo(({ onUpgrade, onDismiss }: TrialBannerProps) => {
  const { trialActive, trialExpired, trialDaysRemaining } = useElite();

  if (!trialActive && !trialExpired) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 text-xs font-medium border-b',
        trialActive
          ? 'bg-primary/10 text-primary border-primary/20'
          : 'bg-accent-warning/10 text-accent-warning border-accent-warning/20'
      )}
    >
      <Crown className="w-3.5 h-3.5 shrink-0" />
      <span className="flex-1 truncate">
        {trialActive
          ? `Safi trial active — ${trialDaysRemaining} day${trialDaysRemaining === 1 ? '' : 's'} left. Upgrade anytime to keep your AI insights.`
          : 'Your Safi trial has ended. Core safety tools stay free — upgrade to keep AI insights & Daily Briefing.'}
      </span>
      <button
        onClick={onUpgrade}
        className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold hover:opacity-90 transition-opacity shrink-0"
      >
        {trialActive ? 'See plans' : 'Upgrade'}
      </button>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" className="p-0.5 rounded hover:bg-foreground/10 shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

TrialBanner.displayName = 'TrialBanner';
export default TrialBanner;
