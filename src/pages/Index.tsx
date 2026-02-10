import { useState, lazy, Suspense } from 'react';
import MapFirstLayout from '@/components/dashboard/MapFirstLayout';
import HeroSection from '@/components/dashboard/HeroSection';
import TopStatusBar from '@/components/dashboard/TopStatusBar';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { WildfireProvider } from '@/contexts/WildfireContext';

// Lazy-load heavy secondary views
const TravelerModeView = lazy(() => import('@/components/dashboard/TravelerModeView'));
const SOSActionDock = lazy(() => import('@/components/dashboard/SOSActionDock'));

const DashboardContent = () => {
  const { isTravelerMode, setTravelerMode } = useDashboard();
  const [showDashboard, setShowDashboard] = useState(false);

  // Show hero first
  if (!showDashboard) {
    return <HeroSection onEnterDashboard={() => setShowDashboard(true)} />;
  }

  if (isTravelerMode) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <TopStatusBar 
          isTravelerMode={true} 
          onToggleTravelerMode={() => setTravelerMode(false)} 
        />
        <Suspense fallback={<div className="flex-1 bg-black" />}>
          <div className="flex-1 overflow-y-auto">
            <TravelerModeView />
          </div>
          <SOSActionDock isTravelerMode={true} />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      <MapFirstLayout />
      <Suspense fallback={null}>
        <SOSActionDock isTravelerMode={false} />
      </Suspense>
    </>
  );
};

const Index = () => (
  <DashboardProvider>
    <WildfireProvider>
      <DashboardContent />
    </WildfireProvider>
  </DashboardProvider>
);

export default Index;
