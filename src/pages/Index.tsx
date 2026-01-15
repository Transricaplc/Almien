import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import InteractiveMap from '@/components/dashboard/InteractiveMap';
import IntelligenceSidebar from '@/components/dashboard/IntelligenceSidebar';
import SOSActionDock from '@/components/dashboard/SOSActionDock';
import TravelerModeView from '@/components/dashboard/TravelerModeView';
import LegalComplianceFooter from '@/components/dashboard/LegalComplianceFooter';
import MobilityTray from '@/components/dashboard/MobilityTray';

const Index = () => {
  const [isTravelerMode, setIsTravelerMode] = useState(false);

  const handleToggleTravelerMode = () => {
    setIsTravelerMode(!isTravelerMode);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        isTravelerMode={isTravelerMode} 
        onToggleTravelerMode={handleToggleTravelerMode} 
      />

      {isTravelerMode ? (
        /* Traveler's Mode - Simplified Emergency View */
        <TravelerModeView />
      ) : (
        /* Command Center Mode - Full Dashboard */
        <>
          <main className="flex-1 max-w-[2000px] w-full mx-auto px-3 py-3">
            {/* 12-Column Grid Layout */}
            <div className="grid grid-cols-12 gap-3 lg:gap-4 h-[calc(100vh-200px)]">
              {/* Map - Cols 1-8 */}
              <div className="col-span-12 xl:col-span-8">
                <div className="h-full flex flex-col gap-3">
                  <div className="flex-1 min-h-0">
                    <InteractiveMap fullHeight />
                  </div>
                  {/* Mobility Tray below map */}
                  <div className="flex-shrink-0">
                    <MobilityTray />
                  </div>
                </div>
              </div>

              {/* Intelligence Sidebar - Cols 9-12 */}
              <div className="col-span-12 xl:col-span-4 h-full overflow-hidden">
                <IntelligenceSidebar />
              </div>
            </div>
          </main>

          {/* Legal Footer - Fixed at bottom, no overlap */}
          <div className="flex-shrink-0 mt-auto">
            <LegalComplianceFooter />
          </div>
        </>
      )}

      {/* SOS Action Dock - Always visible */}
      <SOSActionDock isTravelerMode={isTravelerMode} />
    </div>
  );
};

export default Index;
