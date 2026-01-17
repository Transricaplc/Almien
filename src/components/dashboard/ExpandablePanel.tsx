import { useState, useRef, useCallback } from 'react';
import { Minimize2, Maximize2, GripHorizontal } from 'lucide-react';
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragRef.current) return;
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    setPosition({
      x: dragRef.current.initialX + deltaX,
      y: Math.max(0, dragRef.current.initialY + deltaY),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragRef.current = null;
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel container */}
      <div 
        className={cn(
          "fixed z-50 left-1/2 -translate-x-1/2",
          "w-[95vw] max-w-4xl",
          "bg-background/98 backdrop-blur-xl border border-primary/30 rounded-xl",
          "shadow-2xl shadow-black/20",
          "animate-in fade-in-0 slide-in-from-top-4 zoom-in-95 duration-300",
          className
        )}
        style={{ 
          top: `${Math.max(16, position.y)}px`,
          transform: `translateX(calc(-50% + ${position.x}px))`,
        }}
        role="dialog"
        aria-label={`${title} expanded panel`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Drag handle */}
        <div 
          className={cn(
            "flex justify-center py-1.5 cursor-grab active:cursor-grabbing",
            "border-b border-border/20 bg-gradient-to-r from-transparent via-primary/5 to-transparent",
            isDragging && "cursor-grabbing"
          )}
          onMouseDown={handleMouseDown}
        >
          <GripHorizontal className="w-6 h-4 text-muted-foreground/50" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/15 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">{title}</h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {isMinimized ? 'Minimized View' : 'Expanded Detail View'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
              aria-label={isMinimized ? "Maximize panel" : "Minimize panel"}
            >
              {isMinimized ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-medium">Expand</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-medium">Collapse</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-lg bg-muted/50 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 text-xs font-medium"
              aria-label="Close panel"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content - collapsible with animation */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isMinimized ? "max-h-0" : "max-h-[65vh]"
          )}
        >
          <ScrollArea className="max-h-[65vh]">
            <div className="p-4 animate-in fade-in-0 duration-300">
              {children}
            </div>
          </ScrollArea>
        </div>

        {/* Visual indicator at bottom */}
        {!isMinimized && (
          <div className="h-1 bg-gradient-to-b from-primary/20 to-transparent rounded-b-xl" />
        )}
      </div>
    </>
  );
};

export default ExpandablePanel;
