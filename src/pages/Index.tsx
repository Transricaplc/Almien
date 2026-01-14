import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import StatsBar from '@/components/dashboard/StatsBar';
import TabNavigation from '@/components/dashboard/TabNavigation';
import RouteCard from '@/components/dashboard/RouteCard';
import RouteDetail from '@/components/dashboard/RouteDetail';
import TrainCard from '@/components/dashboard/TrainCard';
import UberZoneCard from '@/components/dashboard/UberZoneCard';
import EmptyState from '@/components/dashboard/EmptyState';
import EmergencyPanel from '@/components/dashboard/EmergencyPanel';
import AreaSearch from '@/components/dashboard/AreaSearch';
import InfrastructureGrid from '@/components/dashboard/InfrastructureGrid';
import PremiumPanel from '@/components/dashboard/PremiumPanel';
import RoadsStatusPanel from '@/components/dashboard/RoadsStatusPanel';
import InteractiveMap from '@/components/dashboard/InteractiveMap';
import ComparisonView from '@/components/dashboard/ComparisonView';
import ExportPanel from '@/components/dashboard/ExportPanel';
import AdditionalEmergencyContacts from '@/components/dashboard/AdditionalEmergencyContacts';
import { majorRoutes, trainRoutes, uberDangerZones } from '@/data/dashboardData';
import { MajorRoute, TabId } from '@/types/dashboard';

const Index = () => {
  const [selectedRoute, setSelectedRoute] = useState<MajorRoute | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (tab !== 'routes') {
      setSelectedRoute(null);
    }
  };

  const handleRouteClick = (route: MajorRoute) => {
    setSelectedRoute(route);
    setActiveTab('routes');
  };

  return (
    <div className="min-h-screen bg-gradient-body">
      <Header />
      <StatsBar />
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* Route Cards */}
              <div className="xl:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {majorRoutes.map((route, index) => (
                    <div key={route.id} style={{ animationDelay: `${index * 50}ms` }}>
                      <RouteCard route={route} onClick={() => handleRouteClick(route)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-4 lg:space-y-5">
                <PremiumPanel />
                <AreaSearch />
                <EmergencyPanel />
              </div>
            </div>

            {/* Roads Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <RoadsStatusPanel />
              <ExportPanel />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="xl:col-span-3">
              <InteractiveMap />
            </div>
            <div className="xl:col-span-1 space-y-4 lg:space-y-5">
              <AreaSearch />
              <EmergencyPanel />
            </div>
          </div>
        )}

        {activeTab === 'routes' && selectedRoute && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="xl:col-span-3">
              <RouteDetail route={selectedRoute} />
            </div>
            <div className="xl:col-span-1 space-y-4 lg:space-y-5">
              <RoadsStatusPanel />
              <EmergencyPanel />
            </div>
          </div>
        )}

        {activeTab === 'routes' && !selectedRoute && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="xl:col-span-3">
              <EmptyState />
            </div>
            <div className="xl:col-span-1 space-y-4 lg:space-y-5">
              <RoadsStatusPanel />
              <EmergencyPanel />
            </div>
          </div>
        )}

        {activeTab === 'trains' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                {trainRoutes.map((train, index) => (
                  <div key={train.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <TrainCard train={train} />
                  </div>
                ))}
              </div>
            </div>
            <div className="xl:col-span-1 space-y-4 lg:space-y-5">
              <AreaSearch />
              <EmergencyPanel />
            </div>
          </div>
        )}

        {activeTab === 'uber' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                {uberDangerZones.map((zone, index) => (
                  <div key={zone.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <UberZoneCard zone={zone} />
                  </div>
                ))}
              </div>
            </div>
            <div className="xl:col-span-1 space-y-4 lg:space-y-5">
              <AreaSearch />
              <EmergencyPanel />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <ComparisonView />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <RoadsStatusPanel />
              <ExportPanel />
            </div>
          </div>
        )}
      </main>

      {/* Infrastructure Grid */}
      <InfrastructureGrid />

      {/* Additional Emergency Contacts */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdditionalEmergencyContacts />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-mono text-primary">BLUEWHALE</span>
              <span>© 2024 Real-time safety monitoring for Western Cape</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span>SAPS: <span className="font-bold text-red-400">10111</span></span>
              <span>•</span>
              <span>AMBULANCE: <span className="font-bold text-blue-400">10177</span></span>
              <span>•</span>
              <span>FIRE: <span className="font-bold text-orange-400">021 480 7700</span></span>
              <span>•</span>
              <span>CITY: <span className="font-bold text-emerald-400">0860 103 089</span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
