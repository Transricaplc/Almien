import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, X, ChevronDown, ChevronUp, Zap, Moon, Car, Shield } from 'lucide-react';
import type { ViewId } from '../AlmienDashboard';

interface GuardianAlertProps {
  onNavigate: (view: ViewId) => void;
}

// Mock compound risk detection
const riskFactors = [
  { id: 'loadshedding', label: 'Load-shedding Stage 4', icon: Zap, weight: 'HIGH', active: true, color: 'text-safety-yellow' },
  { id: 'night', label: 'Night window (20:00–05:00)', icon: Moon, weight: 'HIGH', active: true, color: 'text-accent-info' },
  { id: 'incidents', label: '4 incidents in 2h — Sea Point', icon: Shield, weight: 'CRITICAL', active: true, color: 'text-destructive' },
  { id: 'traffic', label: 'M3 accident near Wynberg', icon: Car, weight: 'MODERATE', active: false, color: 'text-muted-foreground' },
];

const activeFactors = riskFactors.filter(f => f.active);
const shouldShow = activeFactors.length >= 2;

const GuardianAlert = memo(({ onNavigate }: GuardianAlertProps) => {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!shouldShow || dismissed) return null;

  return (
    <div className="rounded-xl overflow-hidden border-l-[6px] border-safety-yellow animate-slide-up"
      style={{ background: 'linear-gradient(135deg, hsl(30 80% 5%), hsl(4 40% 8%))' }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-safety-yellow" />
            <span className="text-[11px] font-mono font-bold text-safety-yellow uppercase tracking-wider">
              ⚠ Guardian Alert — Priority One
            </span>
          </div>
          <button onClick={() => setDismissed(true)} className="p-1 rounded hover:bg-white/5 text-muted-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reason string */}
        <p className="text-sm font-semibold text-foreground mb-3">
          {activeFactors.map(f => f.label.split('—')[0].trim()).join(' + ')} = Critical corridor risk
        </p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="px-4 py-2 rounded-lg border border-[hsl(var(--border-subtle))] text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Avoid Area
          </button>
          <button
            onClick={() => onNavigate('safe-route')}
            className="px-4 py-2 rounded-lg bg-accent-safe text-[hsl(var(--text-inverse))] text-xs font-bold transition-colors"
          >
            See Safe Route
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Why?
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* XAI Explainability Panel */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-[hsl(var(--border-subtle)/0.3)] space-y-2 animate-fade-in">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
              Contributing Factors (XAI)
            </p>
            {riskFactors.map(factor => {
              const Icon = factor.icon;
              return (
                <div key={factor.id} className={cn(
                  "flex items-center gap-3 p-2 rounded-lg",
                  factor.active ? "bg-white/5" : "bg-transparent opacity-50"
                )}>
                  <Icon className={cn("w-4 h-4 shrink-0", factor.color)} />
                  <span className="text-xs text-foreground flex-1">{factor.label}</span>
                  <span className={cn(
                    "text-[9px] font-mono font-bold px-2 py-0.5 rounded",
                    factor.weight === 'CRITICAL' ? "bg-destructive/20 text-destructive" :
                    factor.weight === 'HIGH' ? "bg-safety-yellow/20 text-safety-yellow" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {factor.weight}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

GuardianAlert.displayName = 'GuardianAlert';
export default GuardianAlert;
