import { useState } from 'react';
import { ChevronUp, ChevronDown, Car, Train, Route, Mountain, Bike, Dog, Plane, PersonStanding, Wind } from 'lucide-react';
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

type TabId = 'roads' | 'trains' | 'rideshare' | 'flights' | 'hiking' | 'running' | 'cycling' | 'pets' | 'wind';

interface TabConfig {
  id: TabId;
  label: string;
  icon: typeof Route;
}

const tabs: TabConfig[] = [
  { id: 'roads', label: 'Roads', icon: Route },
  { id: 'trains', label: 'Rail', icon: Train },
  { id: 'rideshare', label: 'Rideshare', icon: Car },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hiking', label: 'Trails', icon: Mountain },
  { id: 'running', label: 'Running', icon: PersonStanding },
  { id: 'cycling', label: 'Cycling', icon: Bike },
  { id: 'pets', label: 'Canine', icon: Dog },
  { id: 'wind', label: 'Wind', icon: Wind },
];

const MobilityTray = () => {
  const [activeTab, setActiveTab] = useState<TabId>('roads');
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
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

  return (
    <div className={cn(
      'bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 overflow-hidden transition-all duration-300',
      isExpanded ? 'max-h-[480px]' : 'max-h-[48px]'
    )}>
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-border/30 bg-background/30">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsExpanded(true);
                }}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                )}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors ml-1"
        >
          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 max-h-[400px] overflow-y-auto scrollbar-hide animate-fade-in">
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default MobilityTray;
