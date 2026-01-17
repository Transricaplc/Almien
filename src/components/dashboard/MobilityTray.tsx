import { useState } from 'react';
import { ChevronUp, ChevronDown, Car, Train, Route, Mountain, Bike, Dog, Plane, PersonStanding, Wind, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import RoadsStatusPanel from './RoadsStatusPanel';
import TrainRoutesPanel from './TrainRoutesPanel';
import RideshareIntelPanel from './RideshareIntelPanel';
import HikingTrailsPanel from './HikingTrailsPanel';
import CyclingRoutesPanel from './CyclingRoutesPanel';
import PetFriendlyZonesPanel from './PetFriendlyZonesPanel';
import FlightStatusPanel from './FlightStatusPanel';
import RunningRoutesPanel from './RunningRoutesPanel';
import WindReportPanel from './WindReportPanel';
import ExpandablePanel from './ExpandablePanel';

type TabId = 'roads' | 'trains' | 'rideshare' | 'flights' | 'hiking' | 'running' | 'cycling' | 'pets' | 'wind';

interface TabConfig {
  id: TabId;
  label: string;
  fullLabel: string;
  icon: typeof Route;
}

const tabs: TabConfig[] = [
  { id: 'roads', label: 'Roads', fullLabel: 'Road Network Status', icon: Route },
  { id: 'trains', label: 'Rail', fullLabel: 'Metrorail Intelligence', icon: Train },
  { id: 'rideshare', label: 'Rideshare', fullLabel: 'Rideshare Safety Zones', icon: Car },
  { id: 'flights', label: 'Flights', fullLabel: 'Flight Status Board', icon: Plane },
  { id: 'hiking', label: 'Trails', fullLabel: 'Hiking Trails Guide', icon: Mountain },
  { id: 'running', label: 'Running', fullLabel: 'Running Routes', icon: PersonStanding },
  { id: 'cycling', label: 'Cycling', fullLabel: 'Cycling Network', icon: Bike },
  { id: 'pets', label: 'Canine', fullLabel: 'Pet-Friendly Zones', icon: Dog },
  { id: 'wind', label: 'Wind', fullLabel: 'Wind Advisory Report', icon: Wind },
];

const MobilityTray = () => {
  const [activeTab, setActiveTab] = useState<TabId>('roads');
  const [isExpanded, setIsExpanded] = useState(false);
  const [fullScreenTab, setFullScreenTab] = useState<TabId | null>(null);

  const renderContent = (tabId: TabId) => {
    switch (tabId) {
      case 'roads':
        return <RoadsStatusPanel />;
      case 'trains':
        return <TrainRoutesPanel />;
      case 'rideshare':
        return <RideshareIntelPanel />;
      case 'flights':
        return <FlightStatusPanel />;
      case 'hiking':
        return <HikingTrailsPanel />;
      case 'running':
        return <RunningRoutesPanel />;
      case 'cycling':
        return <CyclingRoutesPanel />;
      case 'pets':
        return <PetFriendlyZonesPanel />;
      case 'wind':
        return <WindReportPanel />;
      default:
        return null;
    }
  };

  const activeTabConfig = tabs.find(t => t.id === activeTab);
  const fullScreenTabConfig = tabs.find(t => t.id === fullScreenTab);

  return (
    <>
      <div className={cn(
        'bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 overflow-hidden transition-all duration-300 ease-out',
        isExpanded ? 'max-h-[480px]' : 'max-h-[48px]'
      )}>
        {/* Header with tabs */}
        <div className="flex items-center justify-between px-2 py-2 border-b border-border/30 bg-background/30">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsExpanded(true);
                  }}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-200 whitespace-nowrap',
                    'animate-in fade-in-0 slide-in-from-bottom-2',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105'
                      : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 hover:text-foreground hover:scale-102'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1 ml-1">
            {/* Expand to full screen button */}
            {isExpanded && (
              <button
                onClick={() => setFullScreenTab(activeTab)}
                className="p-1.5 rounded-md bg-primary/20 hover:bg-primary/30 transition-all duration-200 group"
                title="Expand to full screen"
              >
                <Maximize2 className="w-3 h-3 text-primary group-hover:scale-110 transition-transform" />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-all duration-200"
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3 text-muted-foreground transition-transform duration-200" />
              ) : (
                <ChevronDown className="w-3 h-3 text-muted-foreground transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-3 max-h-[400px] overflow-y-auto scrollbar-hide animate-in fade-in-0 slide-in-from-top-2 duration-300">
            {renderContent(activeTab)}
          </div>
        )}
      </div>

      {/* Full Screen Panel */}
      {fullScreenTabConfig && (
        <ExpandablePanel
          title={fullScreenTabConfig.fullLabel}
          icon={<fullScreenTabConfig.icon className="w-5 h-5 text-primary" />}
          isOpen={fullScreenTab !== null}
          onClose={() => setFullScreenTab(null)}
        >
          {renderContent(fullScreenTab!)}
        </ExpandablePanel>
      )}
    </>
  );
};

export default MobilityTray;
