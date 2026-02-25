import { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import GridifySidebar from './GridifySidebar';
import UpgradeModal from './UpgradeModal';
import DashboardView from './views/DashboardView';
import SafetyOverviewView from './views/SafetyOverviewView';
import AreasView from './views/AreasView';
import TimeAnalyticsView from './views/TimeAnalyticsView';
import ActivitiesView from './views/ActivitiesView';
import RideShareView from './views/RideShareView';
import TrailSafetyView from './views/TrailSafetyView';
import EmergencyContactsView from './views/EmergencyContactsView';
import ProfessionalToolsView from './views/ProfessionalToolsView';
import CommunityIntelView from './views/CommunityIntelView';
import AlertsView from './views/AlertsView';
import SettingsView from './views/SettingsView';
import TrafficTransportView from './views/TrafficTransportView';
import UtilitiesServicesView from './views/UtilitiesServicesView';
import AirportInfoView from './views/AirportInfoView';
import GovernmentServicesView from './views/GovernmentServicesView';
import PredictiveAnalyticsView from './views/PredictiveAnalyticsView';
import BiodiversityView from './views/BiodiversityView';
import AccessibilityView from './views/AccessibilityView';
import NightEconomyView from './views/NightEconomyView';

export type ViewId =
  | 'dashboard'
  | 'safety-overview'
  | 'areas'
  | 'time-analytics'
  | 'activities'
  | 'rideshare'
  | 'trails'
  | 'emergency'
  | 'pro-tools'
  | 'community'
  | 'alerts'
  | 'traffic'
  | 'utilities'
  | 'airport'
  | 'government'
  | 'predictive'
  | 'biodiversity'
  | 'accessibility'
  | 'night-economy'
  | 'settings';

const GridifyDashboard = memo(() => {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; trigger?: string }>({ open: false });
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const openUpgrade = useCallback((trigger?: string) => {
    setUpgradeModal({ open: true, trigger });
  }, []);

  const navigate = useCallback((view: ViewId) => {
    setActiveView(view);
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const renderView = () => {
    const props = { onUpgrade: openUpgrade, onNavigate: navigate };
    switch (activeView) {
      case 'dashboard': return <DashboardView {...props} />;
      case 'safety-overview': return <SafetyOverviewView {...props} />;
      case 'areas': return <AreasView {...props} />;
      case 'time-analytics': return <TimeAnalyticsView {...props} />;
      case 'activities': return <ActivitiesView {...props} />;
      case 'rideshare': return <RideShareView {...props} />;
      case 'trails': return <TrailSafetyView {...props} />;
      case 'emergency': return <EmergencyContactsView {...props} />;
      case 'pro-tools': return <ProfessionalToolsView {...props} />;
      case 'community': return <CommunityIntelView {...props} />;
      case 'alerts': return <AlertsView {...props} />;
      case 'traffic': return <TrafficTransportView {...props} />;
      case 'utilities': return <UtilitiesServicesView {...props} />;
      case 'airport': return <AirportInfoView {...props} />;
      case 'government': return <GovernmentServicesView {...props} />;
      case 'predictive': return <PredictiveAnalyticsView {...props} />;
      case 'biodiversity': return <BiodiversityView {...props} />;
      case 'accessibility': return <AccessibilityView {...props} />;
      case 'night-economy': return <NightEconomyView {...props} />;
      case 'settings': return <SettingsView {...props} />;
      default: return <DashboardView {...props} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <GridifySidebar
        activeView={activeView}
        onNavigate={navigate}
        onUpgrade={() => openUpgrade()}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />

      {/* Center workspace */}
      <main className="flex-1 min-w-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className={cn(
            "mx-auto w-full",
            isMobile ? "px-4 py-6" : "px-12 py-10 max-w-[1200px]"
          )}>
            {renderView()}
          </div>
        </ScrollArea>
      </main>

      {/* Mobile hamburger */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-card border border-border shadow-md"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <UpgradeModal
        isOpen={upgradeModal.open}
        onClose={() => setUpgradeModal({ open: false })}
        trigger={upgradeModal.trigger}
      />
    </div>
  );
});

GridifyDashboard.displayName = 'GridifyDashboard';
export default GridifyDashboard;
