import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExpandablePanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ExpandablePanel = ({ title, icon, children, isOpen, onClose, className }: ExpandablePanelProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-[95vw] w-full h-[90vh] max-h-[90vh] p-0 gap-0",
          "bg-background/98 backdrop-blur-xl border-primary/20",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4",
          "duration-300",
          className
        )}
        aria-describedby={undefined}
      >
        <DialogHeader className="p-4 border-b border-border/40 flex-shrink-0 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-300">
              <div className="p-2.5 rounded-xl bg-primary/10 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                {icon}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold tracking-tight">{title}</DialogTitle>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Full Detail View
                </p>
              </div>
            </div>
            <button
              onClick={() => onClose()}
              className="p-2.5 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" />
            </button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 min-h-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-150">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpandablePanel;
