import { useState, useEffect } from 'react';
import { 
  X, Minimize2, Maximize2, ChevronUp, ChevronDown, 
  GripHorizontal, Copy 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePanelState } from '@/hooks/usePanelState';

interface ExpandablePanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  /** Optional unique ID for localStorage persistence */
  panelId?: string;
}

/**
 * Expandable Panel Component
 * 
 * Universal center-top panel with:
 * - localStorage persistence for position/mode
 * - Draggable header
 * - Minimize/Maximize/Expand/Collapse/Close controls
 * - Smooth animations
 */
const ExpandablePanel = ({ 
  title, 
  icon, 
  children, 
  isOpen, 
  onClose, 
  className,
  panelId 
}: ExpandablePanelProps) => {
  // Generate stable ID from title if not provided
  const stablePanelId = panelId || `panel-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  const {
    position,
    mode,
    setPosition,
    toggleMinimize,
    toggleMaximize,
    expand,
    collapse,
    isMinimized,
    isMaximized,
  } = usePanelState(stablePanelId);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleMinimize();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, toggleMinimize]);

  // Drag handling
  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPosition({
        x: dragStart.posX + deltaX,
        y: Math.max(0, dragStart.posY + deltaY),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, setPosition]);

  if (!isOpen) return null;

  const getModeLabel = () => {
    if (isMinimized) return 'Minimized';
    if (isMaximized) return 'Full Screen';
    return 'Expanded View';
  };

  const getPanelStyle = () => {
    if (isMaximized) {
      return {
        top: '60px',
        left: '0',
        right: '0',
        bottom: '0',
        transform: 'none',
        width: '100%',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 60px)',
      };
    }
    return {
      top: `${Math.max(16, position.y)}px`,
      left: '50%',
      transform: `translateX(calc(-50% + ${position.x}px))`,
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300",
          isMaximized ? "bg-black/60 backdrop-blur-sm" : "bg-black/30 backdrop-blur-[1px]"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div 
        className={cn(
          "fixed z-50",
          !isMaximized && "w-[95vw] max-w-4xl",
          "bg-background/98 backdrop-blur-xl border border-primary/30 rounded-xl",
          "shadow-2xl shadow-black/30",
          "animate-in fade-in-0 slide-in-from-top-4 zoom-in-95 duration-300",
          isMaximized && "rounded-none border-0",
          className
        )}
        style={getPanelStyle()}
        role="dialog"
        aria-label={`${title} panel`}
        aria-modal="true"
      >
        {/* Drag handle */}
        {!isMaximized && (
          <div 
            className={cn(
              "flex justify-center py-1.5 cursor-grab active:cursor-grabbing",
              "border-b border-border/20 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-t-xl",
              isDragging && "cursor-grabbing bg-primary/10"
            )}
            onMouseDown={handleDragStart}
          >
            <GripHorizontal className="w-6 h-4 text-muted-foreground/50" />
          </div>
        )}

        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-3 border-b border-border/40",
          "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
          isMaximized && "rounded-none"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/15 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">{title}</h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {getModeLabel()}
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-1.5">
            {isMinimized ? (
              <button
                onClick={expand}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-all group"
                aria-label="Expand panel"
              >
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                <span className="text-xs font-medium">Expand</span>
              </button>
            ) : (
              <button
                onClick={collapse}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 hover:bg-amber-500/20 hover:text-amber-400 transition-all group"
                aria-label="Collapse panel"
              >
                <ChevronUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                <span className="text-xs font-medium">Collapse</span>
              </button>
            )}

            <button
              onClick={toggleMinimize}
              className={cn(
                "p-2 rounded-lg transition-all",
                isMinimized ? "bg-primary/20 text-primary" : "bg-muted/50 hover:bg-primary/10 hover:text-primary"
              )}
              aria-label={isMinimized ? "Restore" : "Minimize"}
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMaximize}
              className={cn(
                "p-2 rounded-lg transition-all",
                isMaximized ? "bg-primary/20 text-primary" : "bg-muted/50 hover:bg-primary/10 hover:text-primary"
              )}
              aria-label={isMaximized ? "Exit full screen" : "Full screen"}
              title="Full Screen"
            >
              {isMaximized ? <Copy className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-muted/50 hover:bg-destructive/20 hover:text-destructive transition-all"
              aria-label="Close"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isMinimized ? "max-h-0" : isMaximized ? "h-[calc(100%-80px)]" : "max-h-[65vh]"
          )}
        >
          <ScrollArea className={cn(isMaximized ? "h-full" : "max-h-[65vh]")}>
            <div className="p-4 animate-in fade-in-0 duration-300">
              {children}
            </div>
          </ScrollArea>
        </div>

        {/* Bottom gradient */}
        {!isMinimized && !isMaximized && (
          <div className="h-1 bg-gradient-to-b from-primary/20 to-transparent rounded-b-xl" />
        )}
      </div>
    </>
  );
};

export default ExpandablePanel;
