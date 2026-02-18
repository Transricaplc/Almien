import { memo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Sun, Sunrise, Sunset, Moon } from 'lucide-react';
import type { TimeOfDay } from '@/data/capeTownSafetyData';

/**
 * TimeOfDayToggle — Switches map heatmap colors by time period.
 * Smooth 300ms transition between states.
 */

interface TimeOfDayToggleProps {
  value: TimeOfDay;
  onChange: (time: TimeOfDay) => void;
  className?: string;
}

const times: { id: TimeOfDay; label: string; icon: typeof Sun; description: string }[] = [
  { id: 'morning', label: 'Morning', icon: Sunrise, description: '6am–12pm' },
  { id: 'day', label: 'Day', icon: Sun, description: '12pm–6pm' },
  { id: 'evening', label: 'Evening', icon: Sunset, description: '6pm–10pm' },
  { id: 'night', label: 'Night', icon: Moon, description: '10pm–6am' },
];

const TimeOfDayToggle = memo(({ value, onChange, className }: TimeOfDayToggleProps) => {
  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-xl bg-secondary", className)}>
      {times.map(({ id, label, icon: Icon, description }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300",
            value === id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={`${label} (${description})`}
          aria-pressed={value === id}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
});

TimeOfDayToggle.displayName = 'TimeOfDayToggle';

export default TimeOfDayToggle;
