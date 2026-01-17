import { useState } from 'react';
import { ChevronUp, ChevronDown, Layers, Construction, Maximize2 } from 'lucide-react';
import InfrastructureGrid from './InfrastructureGrid';
import RoadsStatusPanel from './RoadsStatusPanel';
import ExpandablePanel from './ExpandablePanel';
import { cn } from '@/lib/utils';

const InfrastructureDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const InfrastructureContent = () => (
    <div className="space-y-6">
      <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          Infrastructure Grid
        </h3>
        <InfrastructureGrid />
      </div>
      <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-100">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Construction className="w-4 h-4 text-primary" />
          Road Network Status
        </h3>
        <RoadsStatusPanel />
      </div>
    </div>
  );

  return (
    <>
      <div className={cn(
        'fixed bottom-[110px] left-0 right-0 z-40 transition-all duration-300 ease-out',
        isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'
      )}>
        {/* Handle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-3 py-3 bg-card/95 backdrop-blur-xl border-t-2 border-x-2 border-border/50 rounded-t-2xl hover:bg-card transition-all duration-200 group"
        >
          <div className="flex items-center gap-2">
            <Construction className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold text-foreground">Infrastructure Status</span>
            <Layers className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            {isOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullScreen(true);
                }}
                className="p-1 rounded-md bg-primary/20 hover:bg-primary/30 transition-all duration-200"
                title="Expand to full screen"
              >
                <Maximize2 className="w-3.5 h-3.5 text-primary" />
              </button>
            )}
            {isOpen ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
            ) : (
              <ChevronUp className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5" />
            )}
          </div>
        </button>

        {/* Content */}
        <div className={cn(
          'bg-card/95 backdrop-blur-xl border-x-2 border-border/50 max-h-[50vh] overflow-y-auto transition-all duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}>
          <div className="p-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <InfrastructureContent />
          </div>
        </div>
      </div>

      {/* Full Screen Panel */}
      <ExpandablePanel
        title="Infrastructure Intelligence"
        icon={<Construction className="w-5 h-5 text-primary" />}
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
      >
        <InfrastructureContent />
      </ExpandablePanel>
    </>
  );
};

export default InfrastructureDrawer;
