import { useState } from 'react';
import { ChevronLeft, ChevronRight, Car, Train, Route, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import RoadsStatusPanel from './RoadsStatusPanel';
import TrainCard from './TrainCard';
import UberZoneCard from './UberZoneCard';
import ExportPanel from './ExportPanel';
import { trainRoutes, uberDangerZones } from '@/data/dashboardData';

type TabId = 'roads' | 'trains' | 'uber' | 'export';

interface TabConfig {
  id: TabId;
  label: string;
  icon: typeof Route;
}

const tabs: TabConfig[] = [
  { id: 'roads', label: 'Roads', icon: Route },
  { id: 'trains', label: 'Trains', icon: Train },
  { id: 'uber', label: 'Rideshare', icon: Car },
  { id: 'export', label: 'Export', icon: Download },
];

const MobilityTray = () => {
  const [activeTab, setActiveTab] = useState<TabId>('roads');
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'roads':
        return <RoadsStatusPanel />;
      case 'trains':
        return (
          <div className="space-y-4">
            {trainRoutes.map(train => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        );
      case 'uber':
        return (
          <div className="space-y-4">
            {uberDangerZones.map(zone => (
              <UberZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        );
      case 'export':
        return <ExportPanel />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      'bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 overflow-hidden transition-all duration-300',
      isExpanded ? 'max-h-[500px]' : 'max-h-[60px]'
    )}>
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-background/30">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
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
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 max-h-[420px] overflow-y-auto scrollbar-hide animate-fade-in">
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default MobilityTray;
