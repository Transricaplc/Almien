import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Crown, X, Check, Star } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
}

const comparison = [
  { feature: 'Incident History', free: '7 days', elite: '5 years' },
  { feature: 'Update Frequency', free: 'Every 4 hours', elite: 'Real-time' },
  { feature: 'Saved Locations', free: '3', elite: 'Unlimited' },
  { feature: 'Activity Recommendations', free: 'Basic', elite: 'AI-Powered' },
  { feature: 'Professional Tools', free: '✗', elite: '✓' },
  { feature: 'Data Export', free: '1 PDF/day', elite: 'Unlimited' },
  { feature: 'Custom Alerts', free: '✗', elite: '✓' },
  { feature: 'Community Posting', free: '✗', elite: '✓' },
  { feature: 'Offline Maps', free: '✗', elite: '✓' },
];

const UpgradeModal = memo(({ isOpen, onClose, trigger }: UpgradeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[600px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="h-1 bg-elite-gradient" />

        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary transition-colors z-10">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-elite-gradient text-white text-sm font-semibold mb-4">
            <Crown className="w-4 h-4" />
            UNLOCK GRIDFY ELITE
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {trigger || 'Full Safety Intelligence'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Join 10,000+ users who trust Gridfy for safety decisions
          </p>
        </div>

        {/* Comparison Table */}
        <div className="px-8 pb-4">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-secondary/50 p-3">
              <span className="text-xs font-semibold text-muted-foreground">Feature</span>
              <span className="text-xs font-semibold text-muted-foreground text-center">Free</span>
              <span className="text-xs font-semibold text-elite-gradient text-center flex items-center justify-center gap-1">
                <Crown className="w-3 h-3" /> Elite
              </span>
            </div>
            {comparison.map((row, i) => (
              <div key={row.feature} className={cn("grid grid-cols-3 p-3 text-sm", i % 2 === 0 ? "bg-card" : "bg-secondary/20")}>
                <span className="text-foreground text-xs">{row.feature}</span>
                <span className="text-muted-foreground text-center text-xs">{row.free}</span>
                <span className="text-foreground font-medium text-center text-xs">{row.elite}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="px-8 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border text-center">
              <div className="text-2xl font-bold text-foreground">R349</div>
              <div className="text-xs text-muted-foreground">/month</div>
              <div className="text-[10px] text-muted-foreground mt-1">($19.99 USD)</div>
              <div className="text-xs text-muted-foreground mt-1">Cancel anytime</div>
              <button className="w-full mt-3 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-accent transition-colors">
                Start Free Trial
              </button>
            </div>
            <div className="p-4 rounded-xl border-2 border-primary text-center relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">RECOMMENDED</span>
              <div className="text-2xl font-bold text-foreground">R3,490</div>
              <div className="text-xs text-muted-foreground">/year</div>
              <div className="text-[10px] text-muted-foreground mt-1">($199 USD)</div>
              <div className="text-xs text-safety-green font-semibold mt-1">Save R698 (17%)</div>
              <button className="w-full mt-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="px-8 pb-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>✓ 7-day free trial</span>
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-elite-from fill-current" />)}
            <span className="text-xs text-muted-foreground ml-1">4.8/5 from 2,300+ reviews</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 text-center space-y-2">
          <button className="text-xs text-primary font-semibold hover:underline">Need Enterprise? Contact Sales</button>
          <br />
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Maybe Later</button>
        </div>
      </div>
    </div>
  );
});

UpgradeModal.displayName = 'UpgradeModal';
export default UpgradeModal;
