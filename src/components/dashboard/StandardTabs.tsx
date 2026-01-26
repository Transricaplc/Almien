import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Standard tab configuration
 */
export interface TabConfig {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  content: ReactNode;
}

/**
 * Standardized horizontal tabs with consistent styling
 */
interface StandardTabsProps {
  tabs: TabConfig[];
  defaultTab?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  contentClassName?: string;
  variant?: 'default' | 'compact' | 'pills';
}

export const StandardTabs = ({
  tabs,
  defaultTab,
  value,
  onValueChange,
  className,
  contentClassName,
  variant = 'default',
}: StandardTabsProps) => {
  const defaultValue = defaultTab || tabs[0]?.id;

  const triggerStyles = {
    default: cn(
      "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all",
      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md",
      "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50"
    ),
    compact: cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
      "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
    ),
    pills: cn(
      "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg",
      "data-[state=inactive]:bg-muted/30 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/50"
    ),
  };

  const listStyles = {
    default: "inline-flex h-auto items-center gap-1 rounded-xl bg-muted/30 p-1.5 border border-border/50",
    compact: "inline-flex h-auto items-center gap-0.5 rounded-lg bg-muted/20 p-1",
    pills: "inline-flex h-auto items-center gap-2 rounded-full bg-muted/20 p-1.5",
  };

  return (
    <Tabs 
      defaultValue={defaultValue} 
      value={value} 
      onValueChange={onValueChange}
      className={cn("w-full", className)}
    >
      <TabsList className={cn(listStyles[variant], "flex-wrap")}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={triggerStyles[variant]}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  "bg-primary/20 text-primary"
                )}>
                  {tab.badge}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className={cn("mt-4 focus-visible:outline-none", contentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

/**
 * Icon-only tabs for compact navigation
 */
interface IconTabsProps {
  tabs: TabConfig[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const IconTabs = ({
  tabs,
  value,
  onValueChange,
  className,
}: IconTabsProps) => {
  const activeTab = value || tabs[0]?.id;

  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-muted/30", className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onValueChange?.(tab.id)}
            className={cn(
              "relative flex flex-col items-center gap-1 p-2 rounded-md transition-all group",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            title={tab.label}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="text-[9px] font-medium">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={cn(
                "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center",
                isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Vertical sidebar tabs
 */
interface VerticalTabsProps {
  tabs: TabConfig[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  contentClassName?: string;
}

export const VerticalTabs = ({
  tabs,
  value,
  onValueChange,
  className,
  contentClassName,
}: VerticalTabsProps) => {
  const activeTab = value || tabs[0]?.id;

  return (
    <div className={cn("flex gap-4", className)}>
      {/* Tab list */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onValueChange?.(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
              <span className="truncate">{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={cn(
                  "ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  isActive ? "bg-primary-foreground/20" : "bg-primary/20 text-primary"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className={cn("flex-1 min-w-0", contentClassName)}>
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
};
