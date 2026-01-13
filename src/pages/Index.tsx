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
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            {/* Main Content - Route Cards */}
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {majorRoutes.map((route, index) => (
                  <div key={route.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <RouteCard 
                      route={route} 
                      onClick={() => handleRouteClick(route)} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar - Emergency & Search */}
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
              <AreaSearch />
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
              <AreaSearch />
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-8">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div>© 2024 BlueWhale Intelligence. Real-time safety monitoring for Cape Town.</div>
            <div className="flex items-center gap-4">
              <span>Emergency: <span className="font-mono font-bold text-foreground">10111</span></span>
              <span>•</span>
              <span>Ambulance: <span className="font-mono font-bold text-foreground">10177</span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
