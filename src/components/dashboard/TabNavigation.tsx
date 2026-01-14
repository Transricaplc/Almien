import { Activity, Camera, Train, Car, Map, BarChart3, LucideIcon } from 'lucide-react';
import { TabId } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Dashboard', icon: Activity },
  { id: 'map', label: 'Live Map', icon: Map },
  { id: 'routes', label: 'Highway Cameras', icon: Camera },
  { id: 'trains', label: 'Train Safety', icon: Train },
  { id: 'uber', label: 'Uber/Taxi Zones', icon: Car },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center space-x-2 px-4 lg:px-6 py-3 lg:py-4 font-bold transition-all border-b-4 whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-secondary text-foreground border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 border-transparent'
              )}
            >
              <tab.icon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
