import CommandCenterLayout from '@/components/dashboard/CommandCenterLayout';
import TravelerModeView from '@/components/dashboard/TravelerModeView';
import SOSActionDock from '@/components/dashboard/SOSActionDock';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { WildfireProvider } from '@/contexts/WildfireContext';
import TopStatusBar from '@/components/dashboard/TopStatusBar';

const DashboardContent = () => {
  const { isTravelerMode, setTravelerMode } = useDashboard();

  const handleToggleTravelerMode = () => {
    setTravelerMode(!isTravelerMode);
  };

  if (isTravelerMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopStatusBar 
          isTravelerMode={true} 
          onToggleTravelerMode={handleToggleTravelerMode} 
        />
        <TravelerModeView />
        <SOSActionDock isTravelerMode={true} />
      </div>
    );
  }

  return (
    <>
      <CommandCenterLayout />
      <SOSActionDock isTravelerMode={false} />
    </>
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
