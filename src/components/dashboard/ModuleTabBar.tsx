import { memo, lazy, Suspense, useState, useCallback } from 'react';
import { 
  BarChart3, Crosshair, Car, Mountain, X, 
  ChevronUp, ChevronDown, Maximize2, Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * ModuleTabBar — Smart tabs system for intelligence modules.
 * Bottom-anchored tab bar that expands modules as in-dashboard overlays.
 * Keeps map visible while providing deep-dive analytics.
 */

// Lazy load module content
const ExecutiveSummary = lazy(() => import('./ExecutiveSummary'));
const NeighborhoodExplorer = lazy(() => import('./NeighborhoodExplorer'));
const ComparisonView = lazy(() => import('./ComparisonView'));
const SafeRoutePlanner = lazy(() => import('./SafeRoutePlanner'));
const HikingTrailsPanel = lazy(() => import('./HikingTrailsPanel'));
const LiveReportFeed = lazy(() => import('./LiveReportFeed'));
const OntologyViewer = lazy(() => import('./OntologyViewer'));

export type ModuleId = 'crime' | 'area-intel' | 'rideshare' | 'trails' | 'reports' | 'ontology' | null;

interface ModuleConfig {
  id: ModuleId;
  label: string;
  icon: typeof BarChart3;
  component: React.LazyExoticComponent<any>;
  title: string;
}

const modules: ModuleConfig[] = [
  { id: 'crime', label: 'Crime', icon: BarChart3, component: ExecutiveSummary, title: 'Crime Analytics & KPIs' },
  { id: 'area-intel', label: 'Areas', icon: Crosshair, component: NeighborhoodExplorer, title: 'Area Intelligence' },
  { id: 'rideshare', label: 'Routes', icon: Car, component: SafeRoutePlanner, title: 'Rideshare & Route Safety' },
  { id: 'trails', label: 'Trails', icon: Mountain, component: HikingTrailsPanel, title: 'Trail Safety' },
];

interface ModuleTabBarProps {
  className?: string;
}

const ModuleTabBar = ({ className }: ModuleTabBarProps) => {
  const [activeModule, setActiveModule] = useState<ModuleId>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const isMobile = useIsMobile();

  const toggleModule = useCallback((id: ModuleId) => {
    setActiveModule(prev => prev === id ? null : id);
    setIsMaximized(false);
  }, []);

  const closeModule = useCallback(() => {
    setActiveModule(null);
    setIsMaximized(false);
  }, []);

  const activeConfig = modules.find(m => m.id === activeModule);

  return (
    <>
      {/* Expanded Module Panel — overlays bottom portion of map */}
      {activeConfig && (
        <>
          {/* Backdrop */}
          {isMaximized && (
            <div
              className="fixed inset-0 z-35 bg-black/30"
              onClick={closeModule}
            />
          )}

          <div className={cn(
            "absolute left-0 right-0 z-40 bg-card/98 backdrop-blur-xl border-t border-border/30",
            "shadow-2xl shadow-black/30 transition-all duration-300 ease-out",
            "rounded-t-xl overflow-hidden",
            isMaximized 
              ? "bottom-0 top-0" 
              : isMobile 
                ? "bottom-14 h-[55vh]" 
                : "bottom-0 h-[45vh]"
          )}>
            {/* Module Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-gradient-to-r from-primary/8 to-transparent shrink-0">
              <div className="flex items-center gap-2.5">
                {activeConfig.icon && <activeConfig.icon className="w-4 h-4 text-primary" />}
                <h3 className="text-xs font-mono uppercase tracking-[0.05em] font-bold">{activeConfig.title}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors"
                >
                  {isMaximized ? <Copy className="w-3.5 h-3.5 text-muted-foreground" /> : <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <button
                  onClick={closeModule}
                  className="p-1.5 rounded-lg bg-muted/50 hover:bg-destructive/20 hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Module Content */}
            <ScrollArea className="h-[calc(100%-44px)] scrollbar-visible">
              <div className="p-4">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-32">
                    <span className="text-xs font-mono text-muted-foreground animate-pulse">Loading module…</span>
                  </div>
                }>
                  <activeConfig.component />
                </Suspense>
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {/* Tab Bar — anchored at bottom */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 z-50",
        "bg-card/95 backdrop-blur-xl border-t border-border/30",
        "flex items-center justify-around px-2 py-1.5",
        "shadow-lg",
        className
      )}>
        {modules.map(mod => {
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => toggleModule(mod.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-0",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              <mod.icon className="w-4 h-4" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-medium">{mod.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default memo(ModuleTabBar);
