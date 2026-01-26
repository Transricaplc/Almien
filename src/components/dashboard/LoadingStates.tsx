import { AlertCircle, RefreshCw, Clock, WifiOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

/**
 * Standardized skeleton loader for cards
 */
interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export const CardSkeleton = ({ count = 1, className }: CardSkeletonProps) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-card rounded-lg border border-border/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton loader for grid layouts
 */
interface GridSkeletonProps {
  columns?: number;
  count?: number;
  className?: string;
}

export const GridSkeleton = ({ columns = 3, count = 6, className }: GridSkeletonProps) => (
  <div 
    className={cn(
      "grid gap-4",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      className
    )}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-card rounded-lg border border-border/50 p-4">
        <Skeleton className="h-8 w-full mb-3" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton loader for table/list layouts
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton = ({ rows = 5, columns = 4, className }: TableSkeletonProps) => (
  <div className={cn("space-y-2", className)}>
    {/* Header */}
    <div className="flex gap-4 p-3 bg-muted/30 rounded-lg">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-3 border-b border-border/30">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Inline skeleton for text/numbers
 */
interface InlineSkeletonProps {
  width?: string;
  className?: string;
}

export const InlineSkeleton = ({ width = "w-16", className }: InlineSkeletonProps) => (
  <Skeleton className={cn("h-4 inline-block", width, className)} />
);

/**
 * Error state component with retry functionality
 */
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'inline' | 'card' | 'fullscreen';
  className?: string;
}

export const ErrorState = ({ 
  title = "Unable to load data",
  message = "Something went wrong. Please try again.",
  onRetry,
  variant = 'card',
  className,
}: ErrorStateProps) => {
  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center gap-2 text-destructive text-sm", className)}>
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="h-6 px-2">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center min-h-[400px] text-center p-8",
        className
      )}>
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={cn(
      "bg-card rounded-lg border border-destructive/30 p-6 text-center",
      className
    )}>
      <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
      <h4 className="font-medium text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-3 h-3 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
};

/**
 * Empty state component
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title = "No data available",
  message = "There's nothing to display right now.",
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn(
    "flex flex-col items-center justify-center py-12 text-center",
    className
  )}>
    {icon && (
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        {icon}
      </div>
    )}
    <h4 className="font-medium text-foreground mb-1">{title}</h4>
    <p className="text-sm text-muted-foreground max-w-md">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

/**
 * Connection status indicator
 */
interface ConnectionStatusProps {
  isConnected?: boolean;
  lastUpdated?: Date | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export const ConnectionStatus = ({
  isConnected = true,
  lastUpdated,
  isLoading = false,
  onRefresh,
  className,
}: ConnectionStatusProps) => (
  <div className={cn(
    "flex items-center gap-2 text-xs font-tactical",
    className
  )}>
    {/* Connection indicator */}
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-md border",
      isConnected 
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
        : "bg-destructive/10 border-destructive/30 text-destructive"
    )}>
      {isConnected ? (
        <>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>LIVE</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>OFFLINE</span>
        </>
      )}
    </div>

    {/* Last updated */}
    {lastUpdated && (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
      </div>
    )}

    {/* Refresh button */}
    {onRefresh && (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
        className="h-6 px-2"
      >
        <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
      </Button>
    )}
  </div>
);

/**
 * Loading overlay for components
 */
interface LoadingOverlayProps {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const LoadingOverlay = ({ isLoading, children, className }: LoadingOverlayProps) => (
  <div className={cn("relative", className)}>
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    )}
  </div>
);
