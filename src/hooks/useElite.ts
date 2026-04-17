import { useAlmienStore } from '@/stores/almienStore';

const TRIAL_DAYS = 7;

/**
 * Single source of truth for monetisation gating.
 *
 * Phase-1 Almien rules (impartial, transparent):
 *  - Safety-critical features (SOS, GBV, crime map, basic routes) are NEVER gated.
 *  - `isElite` is true while a 7-day Safi trial is active OR the user has paid.
 *  - When the trial expires, the user is silently demoted to `free`; we surface
 *    this state via `trialExpired` so the dashboard can show a gentle conversion CTA.
 */
export function useElite() {
  const profile = useAlmienStore((s) => s.userProfile);
  const startSafiTrial = useAlmienStore((s) => s.startSafiTrial);
  const upgradeToElite = useAlmienStore((s) => s.upgradeToElite);
  const cancelSubscription = useAlmienStore((s) => s.cancelSubscription);

  const tier = profile?.subscriptionTier ?? 'free';
  const trialStartedAt = profile?.trialStartedAt ?? null;

  let trialDaysRemaining = 0;
  let trialExpired = false;

  if (trialStartedAt) {
    const elapsedMs = Date.now() - new Date(trialStartedAt).getTime();
    const remainingMs = TRIAL_DAYS * 24 * 60 * 60 * 1000 - elapsedMs;
    trialDaysRemaining = Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
    trialExpired = tier === 'trial' && remainingMs <= 0;
  }

  // A trial counts as Elite access until it expires
  const effectiveTier: 'free' | 'trial' | 'elite' =
    tier === 'trial' && trialExpired ? 'free' : tier;
  const isElite = effectiveTier === 'elite' || effectiveTier === 'trial';

  return {
    tier: effectiveTier,
    isElite,
    trialActive: effectiveTier === 'trial',
    trialDaysRemaining,
    trialExpired,
    selectedPlan: profile?.selectedPlan,
    startSafiTrial,
    upgradeToElite,
    cancelSubscription,
  };
}
