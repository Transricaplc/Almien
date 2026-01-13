import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  variant: 'green' | 'red' | 'blue' | 'purple' | 'yellow' | 'orange' | 'teal' | 'pink';
  trend?: { value: number; isPositive: boolean };
}

const variantClasses = {
  green: 'bg-stat-green',
  red: 'bg-stat-red',
  blue: 'bg-stat-blue',
  purple: 'bg-stat-purple',
  yellow: 'bg-stat-yellow',
  orange: 'bg-stat-orange',
  teal: 'bg-stat-teal',
  pink: 'bg-stat-pink',
};

const StatCard = ({ icon: Icon, value, label, variant, trend }: StatCardProps) => {
  return (
    <div className={cn(
      'rounded-xl p-2.5 lg:p-4 shadow-2xl border-2 transition-all duration-300',
      'hover:scale-105 hover:shadow-xl cursor-default group',
      variantClasses[variant]
    )}>
      <div className="flex items-start justify-between mb-1">
        <Icon className="w-4 h-4 lg:w-6 lg:h-6 text-foreground/90 group-hover:scale-110 transition-transform" />
        {trend && (
          <span className={cn(
            'text-[10px] font-bold px-1.5 py-0.5 rounded',
            trend.isPositive ? 'bg-foreground/20 text-foreground' : 'bg-foreground/20 text-foreground'
          )}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <div className="text-lg lg:text-2xl font-black text-foreground tabular-nums">{value}</div>
      <div className="text-[9px] lg:text-[11px] text-foreground/70 font-semibold uppercase tracking-wide truncate">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
