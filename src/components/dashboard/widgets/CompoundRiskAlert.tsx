import { memo, useMemo } from 'react';
import { AlertTriangle, Zap, Moon, Car, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/**
 * Compound Risk Alert — "Guardian" Risk Engine
 * Detects multi-factor risk when: Active Loadshedding + Night-time + Recent Incidents
 * overlap at the same location/ward.
 */

interface CompoundRisk {
  ward_id: number;
  suburb: string;
  factors: string[];
  severity: 'critical' | 'high' | 'moderate';
  message: string;
}

const CompoundRiskAlert = memo(() => {
  const { data: loadshedding } = useQuery({
    queryKey: ['loadshedding-compound'],
    queryFn: async () => {
      const { data } = await supabase
        .from('loadshedding_status')
        .select('suburb, area_code, is_active, stage')
        .eq('is_active', true)
        .limit(50);
      return data || [];
    },
    refetchInterval: 60000,
  });

  const { data: incidents } = useQuery({
    queryKey: ['incidents-compound'],
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('citizen_reports')
        .select('report_type, latitude, longitude, created_at')
        .gte('created_at', since)
        .limit(100);
      return data || [];
    },
    refetchInterval: 60000,
  });

  const isNightTime = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  }, []);

  const compoundRisks = useMemo((): CompoundRisk[] => {
    const risks: CompoundRisk[] = [];
    if (!loadshedding?.length) return risks;

    const activeAreas = loadshedding.filter(l => l.is_active);
    const incidentCount = incidents?.length || 0;

    for (const area of activeAreas) {
      const factors: string[] = [];
      let severity: CompoundRisk['severity'] = 'moderate';

      factors.push(`Stage ${area.stage} load-shedding active`);

      if (isNightTime) {
        factors.push('Night-time darkness window');
        severity = 'high';
      }

      if (incidentCount > 5) {
        factors.push(`${incidentCount} incidents reported in 24h`);
        severity = isNightTime ? 'critical' : 'high';
      }

      if (factors.length >= 2) {
        risks.push({
          ward_id: 0,
          suburb: area.suburb || 'Unknown',
          factors,
          severity,
          message: severity === 'critical'
            ? 'COMPOUND THREAT: Multiple risk factors converging. Exercise extreme caution.'
            : 'ELEVATED RISK: Overlapping conditions detected. Stay alert.',
        });
      }
    }

    return risks.slice(0, 3);
  }, [loadshedding, incidents, isNightTime]);

  if (compoundRisks.length === 0) return null;

  const severityConfig = {
    critical: { bg: 'bg-accent-threat/10', border: 'border-accent-threat/30', text: 'text-accent-threat', icon: AlertTriangle },
    high: { bg: 'bg-accent-warning/10', border: 'border-accent-warning/30', text: 'text-accent-warning', icon: AlertTriangle },
    moderate: { bg: 'bg-accent-info/10', border: 'border-accent-info/30', text: 'text-accent-info', icon: Shield },
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Zap className="w-3.5 h-3.5 text-accent-warning" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
          Guardian Risk Engine
        </span>
      </div>

      {compoundRisks.map((risk, i) => {
        const config = severityConfig[risk.severity];
        const Icon = config.icon;
        return (
          <div key={i} className={cn("p-3 rounded-lg border", config.bg, config.border)}>
            <div className="flex items-start gap-2">
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", config.text)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-[10px] font-mono uppercase font-bold tracking-wider", config.text)}>
                    {risk.severity}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {risk.suburb}
                  </span>
                </div>
                <p className="text-[11px] text-foreground/80 mb-2">{risk.message}</p>

                {/* XAI Justification — Explainable factors */}
                <div className="space-y-1 pt-1.5 border-t border-border/20">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/70">
                    Contributing Factors:
                  </span>
                  {risk.factors.map((factor, fi) => (
                    <div key={fi} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      {factor.includes('load-shedding') && <Zap className="w-2.5 h-2.5 text-accent-warning shrink-0" />}
                      {factor.includes('Night') && <Moon className="w-2.5 h-2.5 text-accent-info shrink-0" />}
                      {factor.includes('incidents') && <Car className="w-2.5 h-2.5 text-accent-threat shrink-0" />}
                      <span className="font-mono">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

CompoundRiskAlert.displayName = 'CompoundRiskAlert';
export default CompoundRiskAlert;
