import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronUp, ChevronDown, X, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Mobile-First Bottom Sheet Component
 * Collapsible bottom sheet with drag-to-expand/collapse behavior
 * Auto-collapses when map is interacted with
 */

type SheetState = 'collapsed' | 'peek' | 'expanded' | 'full';

interface MobileBottomSheetProps {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onMapInteraction?: () => void;
  initialState?: SheetState;
  peekHeight?: number;
  expandedHeight?: string;
  className?: string;
}

const SHEET_HEIGHTS: Record<SheetState, string> = {
  collapsed: '0px',
  peek: '80px',
  expanded: '50vh',
  full: '85vh',
};

const MobileBottomSheet = ({
  children,
  title,
  isOpen,
  onClose,
  initialState = 'peek',
  peekHeight = 80,
  expandedHeight = '50vh',
  className,
}: MobileBottomSheetProps) => {
  const [sheetState, setSheetState] = useState<SheetState>(initialState);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);

  // Update sheet heights dynamically
  const getHeight = () => {
    if (isDragging && dragOffset !== 0) {
      return `calc(${SHEET_HEIGHTS[sheetState]} + ${-dragOffset}px)`;
    }
    
    switch (sheetState) {
      case 'collapsed': return '0px';
      case 'peek': return `${peekHeight}px`;
      case 'expanded': return expandedHeight;
      case 'full': return '85vh';
      default: return `${peekHeight}px`;
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    if (sheetRef.current) {
      dragStartHeight.current = sheetRef.current.offsetHeight;
    }
  };

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: TouchEvent | MouseEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const delta = clientY - dragStartY.current;
      setDragOffset(delta);
    };

    const handleEnd = () => {
      setIsDragging(false);
      
      // Determine final state based on drag direction and distance
      const threshold = 50;
      if (dragOffset < -threshold) {
        // Dragged up - expand
        if (sheetState === 'collapsed') setSheetState('peek');
        else if (sheetState === 'peek') setSheetState('expanded');
        else if (sheetState === 'expanded') setSheetState('full');
      } else if (dragOffset > threshold) {
        // Dragged down - collapse
        if (sheetState === 'full') setSheetState('expanded');
        else if (sheetState === 'expanded') setSheetState('peek');
        else if (sheetState === 'peek') setSheetState('collapsed');
      }
      
      setDragOffset(0);
    };

    window.addEventListener('touchmove', handleMove as any);
    window.addEventListener('mousemove', handleMove as any);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      window.removeEventListener('touchmove', handleMove as any);
      window.removeEventListener('mousemove', handleMove as any);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [isDragging, sheetState, dragOffset]);

  // Reset to peek when opened
  useEffect(() => {
    if (isOpen) {
      setSheetState(initialState);
    } else {
      setSheetState('collapsed');
    }
  }, [isOpen, initialState]);

  if (!isOpen && sheetState === 'collapsed') return null;

  return (
    <div
      ref={sheetRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/98 backdrop-blur-xl border-t border-border/50 rounded-t-2xl",
        "shadow-2xl shadow-black/40",
        "transition-all duration-300 ease-out",
        isDragging && "transition-none",
        className
      )}
      style={{ height: getHeight() }}
    >
      {/* Drag Handle */}
      <div
        className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Header */}
      {title && sheetState !== 'collapsed' && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSheetState(sheetState === 'expanded' ? 'peek' : 'expanded')}
              className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              {sheetState === 'expanded' || sheetState === 'full' ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-muted/50 hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        className={cn(
          "overflow-y-auto scrollbar-visible",
          sheetState === 'peek' ? 'max-h-[40px]' : 'h-[calc(100%-60px)]'
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileBottomSheet;
