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
    <div className="min-h-screen bg-black">
      <Header 
        isTravelerMode={isTravelerMode} 
        onToggleTravelerMode={handleToggleTravelerMode} 
      />

      {isTravelerMode ? (
        /* Traveler's Mode - Simplified Emergency View */
        <TravelerModeView />
      ) : (
        /* Command Center Mode - Full Dashboard */
        <main className="max-w-[2000px] mx-auto px-4 py-4 pb-36">
          {/* 12-Column Grid Layout */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Map - Cols 1-8 */}
            <div className="col-span-12 xl:col-span-8">
              <div className="h-full flex flex-col gap-4">
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
            <div className="col-span-12 xl:col-span-4 h-full">
              <IntelligenceSidebar />
            </div>
          </div>
        </main>
      )}

      {/* SOS Action Dock - Always visible */}
      <SOSActionDock isTravelerMode={isTravelerMode} />

      {/* Legal Footer (Command Center only) */}
      {!isTravelerMode && <LegalComplianceFooter />}
    </div>
  );
};

export default Index;
