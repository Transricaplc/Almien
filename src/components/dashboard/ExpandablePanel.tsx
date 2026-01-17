import { X, Minimize2 } from 'lucide-react';
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

const ExpandablePanel = ({ title, icon, children, isOpen, onClose, className }: ExpandablePanelProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-background/98 backdrop-blur-xl border-b-2 border-primary/30",
        "shadow-2xl shadow-primary/10",
        "animate-in slide-in-from-top-4 fade-in-0 duration-300",
        "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-4 data-[state=closed]:fade-out-0",
        className
      )}
      role="region"
      aria-label={`${title} expanded panel`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/15 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Expanded Detail View
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
          aria-label="Minimize panel"
        >
          <Minimize2 className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="text-xs font-medium">Minimize</span>
        </button>
      </div>

      {/* Content - scrollable with max height to keep content below visible */}
      <ScrollArea className="max-h-[60vh] overflow-y-auto">
        <div className="p-4 animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-100">
          {children}
        </div>
      </ScrollArea>

      {/* Visual indicator that content continues below */}
      <div className="h-1 bg-gradient-to-b from-primary/20 to-transparent" />
    </div>
  );
};

export default ExpandablePanel;
