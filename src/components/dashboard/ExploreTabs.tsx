import { memo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Compass, Activity, Users, ChevronUp, ChevronDown, Utensils, Mountain, Waves, ShoppingBag } from 'lucide-react';
import SafeAreaCard from './SafeAreaCard';
import { capeTownAreas, getAreasByCategory, type AreaSafetyData, type TimeOfDay, type ActivityCategory } from '@/data/capeTownSafetyData';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * ExploreTabs — Bottom collapsible accordion with Explore/Activities/Community tabs.
 */

type TabId = 'explore' | 'activities' | 'community';

interface ExploreTabsProps {
  timeOfDay: TimeOfDay;
  onSelectArea: (area: AreaSafetyData) => void;
  className?: string;
}

const categories: { id: ActivityCategory; label: string; icon: typeof Utensils }[] = [
  { id: 'dining', label: 'Dining', icon: Utensils },
  { id: 'hiking', label: 'Hiking', icon: Mountain },
  { id: 'beaches', label: 'Beaches', icon: Waves },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
];

const tabs: { id: TabId; label: string; icon: typeof Compass }[] = [
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'activities', label: 'Activities', icon: Activity },
  { id: 'community', label: 'Community', icon: Users },
];

const ExploreTabs = memo(({ timeOfDay, onSelectArea, className }: ExploreTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('dining');
  const isMobile = useIsMobile();

  const toggleTab = useCallback((id: TabId) => {
    setActiveTab(prev => prev === id ? null : id);
  }, []);

  const categoryAreas = getAreasByCategory(activeCategory);

  // All activities across areas for the Activities tab
  const allActivities = capeTownAreas.flatMap(area =>
    area.recommendedActivities.map(act => ({
      ...act,
      areaName: area.name,
      areaId: area.id,
      areaSafetyLevel: area.safetyLevel,
      area,
    }))
  ).sort((a, b) => b.safetyScore - a.safetyScore);

  return (
    <div className={cn("absolute bottom-0 left-0 right-0 z-40", className)}>
      {/* Expanded panel */}
      {activeTab && (
        <div className={cn(
          "bg-card border-t border-border shadow-xl",
          "transition-all duration-300 ease-out overflow-hidden",
          isMobile ? "h-[50vh]" : "h-[40vh]"
        )}>
          <div className="h-full overflow-y-auto p-4">
            {activeTab === 'explore' && (
              <div>
                {/* Category filters */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                        activeCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <cat.icon className="w-3 h-3" />
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Area cards grid */}
                <div className={cn(
                  "grid gap-3",
                  isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                )}>
                  {categoryAreas.slice(0, 8).map(area => (
                    <SafeAreaCard
                      key={area.id}
                      area={area}
                      timeOfDay={timeOfDay}
                      onClick={onSelectArea}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="space-y-2">
                {allActivities.slice(0, 12).map((act, i) => (
                  <button
                    key={`${act.areaId}-${act.name}-${i}`}
                    onClick={() => onSelectArea(act.area)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{act.name}</div>
                      <div className="text-xs text-muted-foreground">{act.areaName} · Best: {act.bestTime}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-primary tabular-nums">
                        {act.safetyScore.toFixed(1)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'community' && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1">Community Safety Tips</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  View community reports and safety tips from locals and visitors.
                </p>
                <button className="mt-4 px-4 py-2 rounded-lg bg-elite-gradient text-white text-xs font-semibold">
                  Unlock with Elite
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="bg-card border-t border-border flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => toggleTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
});

ExploreTabs.displayName = 'ExploreTabs';

export default ExploreTabs;
