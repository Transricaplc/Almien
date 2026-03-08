import { memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * SafetyScoreBadge — Circular safety score indicator.
 * Color-coded: green (7.5+), yellow (5.5+), orange (3.5+), red (<3.5)
 */

interface SafetyScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getScoreColor(score: number) {
  if (score >= 7.5) return { bg: 'bg-accent-safe', text: 'text-text-inverse', ring: 'ring-accent-safe/30' };
  if (score >= 5.5) return { bg: 'bg-accent-warning', text: 'text-text-inverse', ring: 'ring-accent-warning/30' };
  if (score >= 3.5) return { bg: 'bg-safety-orange', text: 'text-text-inverse', ring: 'ring-safety-orange/30' };
  return { bg: 'bg-accent-threat', text: 'text-text-inverse', ring: 'ring-accent-threat/30' };
}

function getScoreLabel(score: number) {
  if (score >= 7.5) return 'Safe';
  if (score >= 5.5) return 'Moderate';
  if (score >= 3.5) return 'Elevated';
  return 'High Risk';
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
};

const SafetyScoreBadge = memo(({ score, size = 'md', className }: SafetyScoreBadgeProps) => {
  const colors = getScoreColor(score);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold ring-4",
        sizes[size],
        colors.bg,
        colors.text,
        colors.ring,
        className
      )}
      title={`Safety Score: ${score}/10 — ${getScoreLabel(score)}`}
      aria-label={`Safety score ${score} out of 10, rated ${getScoreLabel(score)}`}
    >
      {score.toFixed(1)}
    </div>
  );
});

SafetyScoreBadge.displayName = 'SafetyScoreBadge';

export { SafetyScoreBadge, getScoreColor, getScoreLabel };
export default SafetyScoreBadge;
