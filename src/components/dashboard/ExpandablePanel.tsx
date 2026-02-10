import { useState, useEffect } from 'react';
import { X, Maximize2, ChevronUp, ChevronDown, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExpandablePanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Expandable Panel — Stabilized
 * 
 * Rules:
 * - NO dragging — fixed center-top position
 * - NO floating — docks to fixed grid
 * - Expand/Collapse/FullScreen/Close only
 * - Smooth transitions, no jitter
 */
const ExpandablePanel = ({ 
  title, icon, children, isOpen, onClose, className 
}: ExpandablePanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Always expand when opened
  useEffect(() => {
    if (isOpen) {
      setIsCollapsed(false);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-200",
          isMaximized ? "bg-black/60 backdrop-blur-sm" : "bg-black/30"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — fixed position, no drag */}
      <div 
        className={cn(
          "fixed z-50",
          isMaximized
            ? "inset-0 top-12 rounded-none border-0"
            : "top-16 left-1/2 -translate-x-1/2 w-[95vw] max-w-4xl rounded-xl border border-primary/30",
          "bg-background/98 backdrop-blur-xl",
          "shadow-2xl shadow-black/30",
          "animate-in fade-in-0 slide-in-from-top-2 duration-200",
          className
        )}
        role="dialog"
        aria-label={`${title} panel`}
        aria-modal="true"
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-3 border-b border-border/40",
          "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
          !isMaximized && "rounded-t-xl"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/15">{icon}</div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">{title}</h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {isMaximized ? 'Full Screen' : isCollapsed ? 'Collapsed' : 'Expanded View'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-all text-xs font-medium"
              aria-label={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              {isCollapsed ? 'Expand' : 'Collapse'}
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className={cn(
                "p-2 rounded-lg transition-all",
                isMaximized ? "bg-primary/20 text-primary" : "bg-muted/50 hover:bg-primary/10"
              )}
              aria-label={isMaximized ? "Exit full screen" : "Full screen"}
            >
              {isMaximized ? <Copy className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-muted/50 hover:bg-destructive/20 hover:text-destructive transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "transition-all duration-200 ease-out overflow-hidden",
          isCollapsed ? "max-h-0" : isMaximized ? "h-[calc(100vh-120px)]" : "max-h-[65vh]"
        )}>
          <ScrollArea className={cn(
            isMaximized ? "h-full" : "max-h-[65vh]",
            "scrollbar-visible"
          )}>
            <div className="p-4">{children}</div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default ExpandablePanel;
