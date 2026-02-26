import { memo } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, MapPin } from 'lucide-react';

const RegionSwitcher = memo(() => {
  const { regions, activeRegion, isNationalView, setActiveRegion, toggleNationalView } = useRegion();

  return (
    <div className="flex items-center gap-1.5">
      <Select
        value={isNationalView ? 'national' : activeRegion.id}
        onValueChange={(val) => {
          if (val === 'national') {
            toggleNationalView();
          } else {
            setActiveRegion(val);
          }
        }}
      >
        <SelectTrigger className="h-8 w-[160px] text-xs border-border/50 bg-secondary/50">
          <div className="flex items-center gap-1.5">
            {isNationalView ? <Globe className="w-3.5 h-3.5 text-primary shrink-0" /> : <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {regions.filter(r => r.enabled).map(r => (
            <SelectItem key={r.id} value={r.id}>
              <span className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {r.name}
              </span>
            </SelectItem>
          ))}
          <SelectItem value="national">
            <span className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              National View
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

RegionSwitcher.displayName = 'RegionSwitcher';
export default RegionSwitcher;
