import Header from '@/components/dashboard/Header';
import InteractiveMap from '@/components/dashboard/InteractiveMap';
import IntelligenceSidebar from '@/components/dashboard/IntelligenceSidebar';
import SOSActionDock from '@/components/dashboard/SOSActionDock';
import TravelerModeView from '@/components/dashboard/TravelerModeView';
import MobilityTray from '@/components/dashboard/MobilityTray';
import GlobalStatusBar from '@/components/dashboard/GlobalStatusBar';
import ContextPanel from '@/components/dashboard/ContextPanel';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { WildfireProvider } from '@/contexts/WildfireContext';
import { cn } from '@/lib/utils';

const DashboardContent = () => {
  const { isTravelerMode, setTravelerMode, contextPanelOpen } = useDashboard();

  const handleToggleTravelerMode = () => {
    setTravelerMode(!isTravelerMode);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Level 1: Global Status - Always visible */}
      <Header 
        isTravelerMode={isTravelerMode} 
        onToggleTravelerMode={handleToggleTravelerMode} 
      />
      
      {/* Secondary Status Bar - City health at a glance */}
      {!isTravelerMode && <GlobalStatusBar />}

      {isTravelerMode ? (
        /* Traveler's Mode - Simplified Emergency View */
        <TravelerModeView />
      ) : (
        /* Command Center Mode - Full Dashboard */
        <>
          <main className="flex-1 max-w-[2000px] w-full mx-auto px-3 py-3 pb-16">
            {/* Level 2: Spatial Awareness - Primary Workspace */}
            <div className={cn(
              "grid gap-3 lg:gap-4 h-[calc(100vh-180px)] transition-all duration-300",
              contextPanelOpen 
                ? "grid-cols-12" 
                : "grid-cols-12"
            )}>
              {/* Map - Primary spatial view */}
              <div className={cn(
                "transition-all duration-300",
                contextPanelOpen 
                  ? "col-span-12 xl:col-span-6" 
                  : "col-span-12 xl:col-span-8"
              )}>
                <div className="h-full flex flex-col gap-3">
                  <div className="flex-1 min-h-0">
                    <InteractiveMap fullHeight />
                  </div>
                  {/* Level 2b: Mobility Tray - Quick layer switching */}
                  <div className="flex-shrink-0">
                    <MobilityTray />
                  </div>
                </div>
              </div>

              {/* Intelligence Sidebar - Level 3 Context */}
              <div className={cn(
                "h-full overflow-hidden transition-all duration-300",
                contextPanelOpen 
                  ? "col-span-12 xl:col-span-6" 
                  : "col-span-12 xl:col-span-4"
              )}>
                <IntelligenceSidebar />
              </div>
            </div>
          </main>
        </>
      )}

      {/* SOS Action Dock with Legal/Compliance - Always visible at bottom */}
      <SOSActionDock isTravelerMode={isTravelerMode} />

      {/* Level 3: Context Panel - Slide-in detail view */}
      <ContextPanel />
    </div>
  );
};

const Index = () => {
  return (
    <DashboardProvider>
      <WildfireProvider>
        <DashboardContent />
      </WildfireProvider>
    </DashboardProvider>
  );
};

export default Index;
