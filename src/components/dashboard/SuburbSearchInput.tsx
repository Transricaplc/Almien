import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchAllSuburbs, type UnifiedSuburbResult } from '@/utils/suburbSearch';
import { useSuburbIntelligence } from '@/hooks/useSuburbIntelligence';

interface SuburbSearchInputProps {
  placeholder?: string;
  onSelect: (result: UnifiedSuburbResult) => void;
  className?: string;
  autoFocus?: boolean;
  initialValue?: string;
}

const scoreColor = (score: number) => {
  if (score >= 7.5) return 'text-accent-safe';
  if (score >= 5.5) return 'text-accent-warning';
  if (score >= 3.5) return 'text-orange-400';
  return 'text-accent-threat';
};

export default function SuburbSearchInput({
  placeholder = 'Search suburb, ward, or area...',
  onSelect,
  className,
  autoFocus,
  initialValue = '',
}: SuburbSearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const { suburbs } = useSuburbIntelligence();
  const ref = useRef<HTMLDivElement>(null);

  const results = searchAllSuburbs(query, suburbs);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (r: UnifiedSuburbResult) => {
    onSelect(r);
    setQuery(r.name);
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-card border border-border-subtle text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent-safe/40 transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-secondary"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-card border border-border-subtle shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-fade-in">
          {results.map(r => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border-subtle last:border-0"
            >
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                {r.wardId && (
                  <p className="text-[10px] text-muted-foreground">Ward {r.wardId}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className={cn('text-sm font-bold font-neural tabular-nums', scoreColor(r.safetyScore))}>
                  {r.safetyScore.toFixed(1)}
                </p>
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{r.matchType}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-card border border-border-subtle px-4 py-3 animate-fade-in">
          <p className="text-xs text-muted-foreground text-center">No results for "{query}"</p>
        </div>
      )}
    </div>
  );
}
