import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Crown, X, Check } from 'lucide-react';

/**
 * UpgradeModal — Freemium upgrade prompt with feature comparison.
 * Shows when users hit free tier limits.
 */

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
}

const freeFeatures = [
  '7-day incident history',
  'Updates every 4 hours',
  'Save up to 3 locations',
  'Basic activity recommendations',
  'Simple PDF export (1/day)',
];

const eliteFeatures = [
  '5-year historical data',
  'Real-time live updates',
  'Unlimited saved locations',
  'AI-powered recommendations',
  'Unlimited exports (CSV/Excel/PDF)',
  'Professional tools (Real Estate, Insurance)',
  'Custom monitoring zones',
  'Priority notifications',
];

const UpgradeModal = memo(({ isOpen, onClose, trigger }: UpgradeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-scale-in">
        {/* Gold accent top border */}
        <div className="h-1 bg-elite-gradient" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-elite-gradient text-white text-sm font-semibold mb-4">
            <Crown className="w-4 h-4" />
            Gridify Elite
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Unlock Full Intelligence
          </h2>
          <p className="text-sm text-muted-foreground">
            {trigger || 'Get real-time alerts, historical data, and professional tools'}
          </p>
        </div>

        {/* Comparison */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Free column */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Free</h3>
              <ul className="space-y-2">
                {freeFeatures.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Elite column */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h3 className="text-sm font-semibold text-elite-gradient mb-3 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Elite
              </h3>
              <ul className="space-y-2">
                {eliteFeatures.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">$19.99</div>
              <div className="text-xs text-muted-foreground">/month</div>
            </div>
            <div className="text-center border-l border-border pl-6">
              <div className="text-2xl font-bold text-foreground">$199</div>
              <div className="text-xs text-muted-foreground">/year</div>
              <span className="text-[10px] font-semibold text-primary">Save 17%</span>
            </div>
          </div>

          <button className="w-full py-3 px-4 rounded-xl bg-elite-gradient text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
            Try 7 Days Free
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
});

UpgradeModal.displayName = 'UpgradeModal';

export default UpgradeModal;
