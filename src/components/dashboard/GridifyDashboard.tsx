import { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import GridifySidebar from './GridifySidebar';
import BottomNavBar from './BottomNavBar';
import ThreatHeader from './ThreatHeader';
import UpgradeModal from './UpgradeModal';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import ZoneDirectory from './widgets/ZoneDirectory';
import DashboardView from './views/DashboardView';
import MapFullView from './views/MapFullView';
import SafetyOverviewView from './views/SafetyOverviewView';
// AreasView and TimeAnalyticsView dissolved into contextual widgets — data lives in Map, Dashboard, Routes
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
import { RegionProvider } from '@/contexts/RegionContext';
import { SAPSCrimeProvider } from '@/contexts/SAPSCrimeContext';
import PanicButton from './PanicButton';
import WitnessReportButton from './WitnessReportButton';

export type ViewId =
  | 'dashboard'
  | 'map-full'
  | 'safety-overview'
  | 'areas'          // legacy — redirects to dashboard
  | 'time-analytics' // legacy — redirects to dashboard
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
  | 'settings';

const GridifyDashboard = memo(() => {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; trigger?: string }>({ open: false });
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showZoneDirectory, setShowZoneDirectory] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('gridfy-onboarded');
  });

  const isSafeSpaceView = activeView === 'safe-space';

  const openUpgrade = useCallback((trigger?: string) => {
    setUpgradeModal({ open: true, trigger });
  }, []);

  const navigate = useCallback((view: ViewId) => {
    // Legacy routes redirect to dashboard (data dissolved)
    if (view === 'areas' || view === 'time-analytics') {
      setActiveView('dashboard');
    } else {
      setActiveView(view);
    }
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('gridfy-onboarded', 'true');
    setShowOnboarding(false);
  }, []);

  const renderView = () => {
    const props = { onUpgrade: openUpgrade, onNavigate: navigate };
    switch (activeView) {
      case 'dashboard': return <DashboardView {...props} />;
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
      case 'settings': return <SettingsView {...props} />;
      default: return <DashboardView {...props} />;
    }
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <RegionProvider>
    <SAPSCrimeProvider>
      <div className={cn(
        "h-screen flex overflow-hidden bg-background",
        isSafeSpaceView && "safe-space-theme"
      )}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <GridifySidebar
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
          <GridifySidebar
            activeView={activeView}
            onNavigate={navigate}
            onUpgrade={() => openUpgrade()}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            isMobile={true}
          />
        )}

        {/* Center workspace */}
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {/* Persistent Threat Header — always visible, with suburb switcher */}
          <ThreatHeader onBrowseAllAreas={() => setShowZoneDirectory(true)} />

          {/* Mobile menu button */}
          {isMobile && (
            <div className="h-10 shrink-0 border-b border-border bg-card/80 backdrop-blur flex items-center px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-secondary min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="ml-2 text-sm font-semibold text-foreground">Menu</span>
            </div>
          )}

          <ScrollArea className="flex-1">
            <div className={cn(
              "mx-auto w-full",
              isMobile ? "px-4 py-6 pb-36" : "px-12 py-8 max-w-[720px]"
            )}>
              {renderView()}
            </div>
          </ScrollArea>
        </main>

        {/* Panic Button — always floats above bottom nav */}
        <PanicButton />
        <WitnessReportButton />

        {/* Mobile bottom navigation */}
        {isMobile && (
          <BottomNavBar activeView={activeView} onNavigate={navigate} />
        )}

        <UpgradeModal
          isOpen={upgradeModal.open}
          onClose={() => setUpgradeModal({ open: false })}
          trigger={upgradeModal.trigger}
        />

        {/* Full-screen Zone Directory — accessible from ThreatHeader "Browse All Areas" */}
        {showZoneDirectory && (
          <ZoneDirectory
            onClose={() => setShowZoneDirectory(false)}
          />
        )}
      </div>
    </SAPSCrimeProvider>
    </RegionProvider>
  );
});

GridifyDashboard.displayName = 'GridifyDashboard';
export default GridifyDashboard;
