import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConnectionStatus, CardSkeleton, ErrorState } from './LoadingStates';

/**
 * Standardized dashboard card with consistent styling, loading, and error states
 * Uses 8px spacing increments for consistent layout
 */
interface DashboardCardProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  
  // State props
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  
  // Real-time props
  lastUpdated?: Date | null;
  isConnected?: boolean;
  onRefresh?: () => void;
  showConnectionStatus?: boolean;
  
  // Expand functionality
  onExpand?: () => void;
  
  // Header extras
  headerAction?: ReactNode;
  badge?: ReactNode;
}

export const DashboardCard = ({
  title,
  icon: Icon,
  iconColor = "text-primary",
  children,
  className,
  contentClassName,
  isLoading = false,
  error,
  onRetry,
  lastUpdated,
  isConnected = true,
  onRefresh,
  showConnectionStatus = false,
  onExpand,
  headerAction,
  badge,
}: DashboardCardProps) => {
  return (
    <Card className={cn(
      "bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden transition-all duration-200",
      "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && (
              <div className={cn(
                "p-1.5 rounded-lg bg-primary/10",
                iconColor
              )}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <CardTitle className="text-sm font-semibold truncate">
              {title}
            </CardTitle>
            {badge}
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {showConnectionStatus && (
              <ConnectionStatus
                isConnected={isConnected}
                lastUpdated={lastUpdated}
                isLoading={isLoading}
                onRefresh={onRefresh}
              />
            )}
            {headerAction}
            {onExpand && (
              <button
                onClick={onExpand}
                className="p-1 rounded hover:bg-primary/10 transition-colors group"
                aria-label="Expand panel"
              >
                <Maximize2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={cn("px-4 pb-4", contentClassName)}>
        {isLoading && !children ? (
          <CardSkeleton count={2} />
        ) : error ? (
          <ErrorState 
            message={error} 
            onRetry={onRetry}
            variant="card"
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Compact stat card for dashboard KPIs
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'teal';
  isLoading?: boolean;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  isLoading = false,
  className,
}: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    teal: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
  };

  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-red-500',
    stable: 'text-muted-foreground',
  };

  if (isLoading) {
    return (
      <div className={cn(
        "p-4 rounded-lg border animate-pulse",
        colorClasses[color],
        className
      )}>
        <div className="h-4 bg-current/20 rounded w-16 mb-2" />
        <div className="h-8 bg-current/20 rounded w-24" />
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all hover:scale-[1.02]",
      colorClasses[color],
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4" />}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold font-tactical tabular-nums">
          {value}
        </span>
        {trend && trendValue && (
          <span className={cn("text-xs font-medium", trendColors[trend])}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Panel section with consistent heading
 */
interface PanelSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export const PanelSection = ({ title, children, className, action }: PanelSectionProps) => (
  <div className={cn("space-y-3", className)}>
    {(title || action) && (
      <div className="flex items-center justify-between">
        {title && (
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
        )}
        {action}
      </div>
    )}
    {children}
  </div>
);
