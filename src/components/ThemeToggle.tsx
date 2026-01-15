import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const ThemeToggle = () => {
  const { theme, cycleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'dark':
        return <Moon className="w-4 h-4 text-blue-400" />;
      case 'system':
        return <Monitor className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode (click for dim)';
      case 'dark':
        return 'Dim mode (click for auto)';
      case 'system':
        return 'Auto mode (click for light)';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'relative p-1.5 rounded-lg transition-all flex items-center gap-1.5',
        'bg-background/30 hover:bg-background/50 border border-border/50',
        'hover:border-primary/50'
      )}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide hidden sm:inline">
        {theme === 'system' ? 'Auto' : theme === 'dark' ? 'Dim' : 'Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;
