import { useState, useCallback, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import AlmienSidebar from './AlmienSidebar';
import BottomNavBar from './BottomNavBar';
import SOSActionDock from './SOSActionDock';
import ThreatHeader from './ThreatHeader';
import TrialBanner from './TrialBanner';
import UpgradeModal from './UpgradeModal';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import ZoneDirectory from './widgets/ZoneDirectory';
import SafiAI from '@/components/safi/SafiAI';
import DashboardView from './views/DashboardView';
import MapFullView from './views/MapFullView';
import SafetyOverviewView from './views/SafetyOverviewView';
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
import PredictiveMaintenanceView from './views/PredictiveMaintenanceView';
import TrafficOptimizerView from './views/TrafficOptimizerView';
import ExposureTrackerView from './views/ExposureTrackerView';
import PermitReviewerView from './views/PermitReviewerView';
import MicroclimateView from './views/MicroclimateView';
import CarbonDashboardView from './views/CarbonDashboardView';
import UtilityInsightsView from './views/UtilityInsightsView';
import VolunteerMatchView from './views/VolunteerMatchView';
import MunicipalScorecardView from './views/MunicipalScorecardView';
import TourismHubView from './views/TourismHubView';
import ResilienceView from './views/ResilienceView';
import ApiHubView from './views/ApiHubView';
import SACrimeLayerView from './views/SACrimeLayerView';
import SafetyNetworkView from './views/SafetyNetworkView';
import SafeRouteView from './views/SafeRouteView';
import SafeSpaceView from './views/SafeSpaceView';
import DarknessWindowView from './views/DarknessWindowView';
import VehicleCrimeView from './views/VehicleCrimeView';
import SchoolSafetyView from './views/SchoolSafetyView';
import BusinessSafetyView from './views/BusinessSafetyView';
import NeuralProfileView from './views/NeuralProfileView';
import DarkZoneView from './views/DarkZoneView';
import SafiConversationsView from './views/SafiConversationsView';
import ProfileView from './views/ProfileView';
import { RegionProvider } from '@/contexts/RegionContext';
import { SAPSCrimeProvider } from '@/contexts/SAPSCrimeContext';
import PanicButton from './PanicButton';
import WitnessReportButton from './WitnessReportButton';
import CommandPill from './CommandPill';

export type ViewId =
  | 'dashboard'
  | 'map-full'
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
  | 'pred-maintenance'
  | 'traffic-optimizer'
  | 'exposure-tracker'
  | 'permit-reviewer'
  | 'microclimate'
  | 'carbon-dashboard'
  | 'utility-insights'
  | 'volunteer-match'
  | 'municipal-scorecard'
  | 'tourism-hub'
  | 'resilience'
  | 'api-hub'
  | 'sa-crime-layer'
  | 'safety-network'
  | 'safe-route'
  | 'safe-space'
  | 'darkness-windows'
  | 'vehicle-crime'
  | 'school-safety'
  | 'business-safety'
  | 'neural-profile'
  | 'dark-zones'
  | 'safi-history'
  | 'profile'
  | 'settings';

const AlmienDashboard = memo(() => {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; trigger?: string }>({ open: false });
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showZoneDirectory, setShowZoneDirectory] = useState(false);
  const [safiOpen, setSafiOpen] = useState(false);
  const [safiMode, setSafiMode] = useState<'chat' | 'briefing' | 'route' | 'emergency'>('chat');
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('almien-onboarded');
  });

  const isSafeSpaceView = activeView === 'safe-space';

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, sidebarOpen]);

  const openUpgrade = useCallback((trigger?: string) => {
    setUpgradeModal({ open: true, trigger });
  }, []);

  const navigate = useCallback((view: ViewId) => {
    if (view === 'areas' || view === 'time-analytics') {
      setActiveView('dashboard');
    } else {
      setActiveView(view);
    }
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('almien-onboarded', 'true');
    setShowOnboarding(false);
  }, []);

  const openSafi = useCallback((mode: 'chat' | 'briefing' | 'route' | 'emergency' = 'chat') => {
    setSafiMode(mode);
    setSafiOpen(true);
  }, []);

  const renderView = () => {
    const props = { onUpgrade: openUpgrade, onNavigate: navigate };
    switch (activeView) {
      case 'dashboard': return <DashboardView {...props} onOpenSafi={openSafi} />;
      case 'map-full': return <MapFullView {...props} />;
      case 'safety-overview': return <SafetyOverviewView {...props} />;
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
      case 'pred-maintenance': return <PredictiveMaintenanceView />;
      case 'traffic-optimizer': return <TrafficOptimizerView />;
      case 'exposure-tracker': return <ExposureTrackerView />;
      case 'permit-reviewer': return <PermitReviewerView />;
      case 'microclimate': return <MicroclimateView />;
      case 'carbon-dashboard': return <CarbonDashboardView />;
      case 'utility-insights': return <UtilityInsightsView />;
      case 'volunteer-match': return <VolunteerMatchView />;
      case 'municipal-scorecard': return <MunicipalScorecardView />;
      case 'tourism-hub': return <TourismHubView />;
      case 'resilience': return <ResilienceView />;
      case 'api-hub': return <ApiHubView />;
      case 'sa-crime-layer': return <SACrimeLayerView />;
      case 'safety-network': return <SafetyNetworkView {...props} />;
      case 'safe-route': return <SafeRouteView {...props} />;
      case 'safe-space': return <SafeSpaceView {...props} />;
      case 'darkness-windows': return <DarknessWindowView {...props} />;
      case 'vehicle-crime': return <VehicleCrimeView {...props} />;
      case 'school-safety': return <SchoolSafetyView {...props} />;
      case 'business-safety': return <BusinessSafetyView {...props} />;
      case 'neural-profile': return <NeuralProfileView {...props} />;
      case 'dark-zones': return <DarkZoneView {...props} />;
      case 'safi-history': return <SafiConversationsView {...props} onOpenSafi={() => openSafi('chat')} />;
      case 'profile': return <ProfileView {...props} />;
      case 'settings': return <SettingsView {...props} />;
      default: return <DashboardView {...props} onOpenSafi={openSafi} />;
    }
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <RegionProvider>
    <SAPSCrimeProvider>
      <div className={cn(
        "h-dvh h-screen flex flex-col sm:flex-row w-full max-w-full overflow-x-hidden overflow-y-hidden bg-background",
        isSafeSpaceView && "safe-space-theme"
      )}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-[85] bg-black/40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <AlmienSidebar
            activeView={activeView}
            onNavigate={navigate}
            onUpgrade={() => openUpgrade()}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            isMobile={false}
          />
        )}

        {/* Mobile sidebar drawer */}
        {isMobile && sidebarOpen && (
          <AlmienSidebar
            activeView={activeView}
            onNavigate={navigate}
            onUpgrade={() => openUpgrade()}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            isMobile={true}
          />
        )}

        {/* Center workspace */}
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col w-full max-w-full">
          <TrialBanner onUpgrade={() => openUpgrade('See your Almien plan options')} />
          <ThreatHeader
            onBrowseAllAreas={() => setShowZoneDirectory(true)}
            onMenuOpen={isMobile ? () => setSidebarOpen(true) : undefined}
            onSafiEmergency={() => openSafi('emergency')}
          />

          <ScrollArea className="flex-1">
            <div className={cn(
              "mx-auto w-full max-w-full content-panel",
              isMobile ? "px-4 py-4 pb-[200px] max-w-full" : "px-8 py-8 max-w-[720px]"
            )}>
              {renderView()}
            </div>
          </ScrollArea>
        </main>

        {/* Floating elements */}
        <PanicButton />
        <WitnessReportButton />

        {/* SOS Dock — desktop only */}
        {!isMobile && <SOSActionDock />}

        {/* Safi AI Panel */}
        <SafiAI isOpen={safiOpen} onClose={() => setSafiOpen(false)} onNavigate={navigate} initialMode={safiMode} />

        {/* Mobile bottom navigation */}
        {isMobile && (
          <BottomNavBar activeView={activeView} onNavigate={navigate} onSafiOpen={() => openSafi('chat')} />
        )}

        <UpgradeModal
          isOpen={upgradeModal.open}
          onClose={() => setUpgradeModal({ open: false })}
          trigger={upgradeModal.trigger}
        />

        {showZoneDirectory && (
          <ZoneDirectory onClose={() => setShowZoneDirectory(false)} />
        )}
      </div>
    </SAPSCrimeProvider>
    </RegionProvider>
  );
});

AlmienDashboard.displayName = 'AlmienDashboard';
export default AlmienDashboard;
