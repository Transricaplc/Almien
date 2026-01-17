import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  X, Maximize2, ChevronUp, ChevronDown, 
  GripHorizontal, Copy 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePanelState, PanelMode } from '@/hooks/usePanelState';

interface UniversalPanelProps {
  /** Unique ID for localStorage persistence */
  panelId: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  /** Priority sections that appear first when collapsed */
  priorityContent?: React.ReactNode;
}

/**
 * Universal Panel Component
 * 
 * Features:
 * - Center-top positioning
 * - localStorage persistence for position/size/mode
 * - Draggable header
 * - Expand/Collapse/FullScreen/Close controls (NO minimize)
 * - Overlay without hiding content below
 * - Always visible scrollbars
 * - Smooth animations
 */
const UniversalPanel = ({
  panelId,
  title,
  icon,
  children,
  isOpen,
  onClose,
  className,
  priorityContent,
}: UniversalPanelProps) => {
  const {
    position,
    mode,
    setPosition,
    toggleMaximize,
    isMaximized,
  } = usePanelState(panelId);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  }, [position, isMaximized]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragRef.current) return;
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    setPosition({
      x: dragRef.current.initialX + deltaX,
      y: Math.max(0, dragRef.current.initialY + deltaY),
    });
  }, [isDragging, setPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragRef.current = null;
  }, []);

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return;
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        setPosition({
          x: dragRef.current.initialX + deltaX,
          y: Math.max(0, dragRef.current.initialY + deltaY),
        });
      };
      
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        dragRef.current = null;
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, setPosition]);

  if (!isOpen) return null;

  const getModeLabel = () => {
    if (isMaximized) return 'Full Screen';
    if (isCollapsed) return 'Collapsed';
    return 'Expanded View';
  };

  // Calculate panel dimensions based on mode
  const getPanelStyle = () => {
    if (isMaximized) {
      return {
        top: '60px', // Below nav
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
      {/* Semi-transparent backdrop - clicks close panel */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300",
          isMaximized 
            ? "bg-black/60 backdrop-blur-sm" 
            : "bg-black/30 backdrop-blur-[1px]"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel container */}
      <div 
        ref={panelRef}
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
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Drag handle - only when not maximized */}
        {!isMaximized && (
          <div 
            className={cn(
              "flex justify-center py-1.5 cursor-grab active:cursor-grabbing",
              "border-b border-border/20 bg-gradient-to-r from-transparent via-primary/5 to-transparent",
              "rounded-t-xl",
              isDragging && "cursor-grabbing bg-primary/10"
            )}
            onMouseDown={handleMouseDown}
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
          
          {/* Control buttons - Only Expand/Collapse, Full Screen, Close */}
          <div className="flex items-center gap-1.5">
            {/* Expand/Collapse toggle */}
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-all duration-200 group"
                aria-label="Expand panel"
                title="Expand"
              >
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                <span className="text-xs font-medium">Expand</span>
              </button>
            ) : (
              <button
                onClick={() => setIsCollapsed(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 hover:bg-amber-500/20 hover:text-amber-400 transition-all duration-200 group"
                aria-label="Collapse panel"
                title="Collapse"
              >
                <ChevronUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                <span className="text-xs font-medium">Collapse</span>
              </button>
            )}

            {/* Full Screen toggle */}
            <button
              onClick={toggleMaximize}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                isMaximized 
                  ? "bg-primary/20 text-primary" 
                  : "bg-muted/50 hover:bg-primary/10 hover:text-primary"
              )}
              aria-label={isMaximized ? "Exit full screen" : "Full screen"}
              title="Full Screen"
            >
              {isMaximized ? (
                <Copy className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-muted/50 hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
              aria-label="Close panel"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Priority content - always visible even when collapsed */}
        {priorityContent && isCollapsed && (
          <div className="p-3 border-b border-border/30 bg-background/50">
            {priorityContent}
          </div>
        )}

        {/* Main content - collapsible with always visible scrollbar */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isCollapsed ? "max-h-0" : isMaximized ? "h-[calc(100%-80px)]" : "max-h-[65vh]"
          )}
        >
          <ScrollArea className={cn(
            isMaximized ? "h-full" : "max-h-[65vh]",
            "scrollbar-visible"
          )}>
            <div className="p-4 animate-in fade-in-0 duration-300">
              {children}
            </div>
          </ScrollArea>
        </div>

        {/* Visual indicator at bottom */}
        {!isCollapsed && !isMaximized && (
          <div className="h-1 bg-gradient-to-b from-primary/20 to-transparent rounded-b-xl" />
        )}
      </div>
    </>
  );
};

export default UniversalPanel;