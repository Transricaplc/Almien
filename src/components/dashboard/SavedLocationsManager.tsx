import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  X, Bookmark, Crown, MapPin, Tag, Radius, Bell, Share2, 
  FileText, Grid3X3, List, Plus, Trash2, Edit2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import SafetyScoreBadge from './SafetyScoreBadge';
import { capeTownAreas, type AreaSafetyData } from '@/data/capeTownSafetyData';

interface SavedLocationsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  savedLocationIds: string[];
  onRemove: (id: string) => void;
  onSelectArea: (area: AreaSafetyData) => void;
}

type ViewMode = 'grid' | 'list';

interface SavedLocationMeta {
  customName?: string;
  tags: string[];
  radius: number; // meters
  alertEnabled: boolean;
}

const defaultMeta: SavedLocationMeta = {
  tags: [],
  radius: 1000,
  alertEnabled: true,
};

const radiusOptions = [500, 1000, 2000, 5000];

const SavedLocationsManager = memo(({ isOpen, onClose, savedLocationIds, onRemove, onSelectArea }: SavedLocationsManagerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [metas, setMetas] = useState<Record<string, SavedLocationMeta>>({});
  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const savedAreas = savedLocationIds
    .map(id => capeTownAreas.find(a => a.id === id))
    .filter(Boolean) as AreaSafetyData[];

  const getMeta = (id: string): SavedLocationMeta => metas[id] || defaultMeta;

  const updateMeta = (id: string, updates: Partial<SavedLocationMeta>) => {
    setMetas(prev => ({ ...prev, [id]: { ...getMeta(id), ...updates } }));
  };

  const addTag = (id: string) => {
    if (!newTag.trim()) return;
    const meta = getMeta(id);
    updateMeta(id, { tags: [...meta.tags, newTag.trim()] });
    setNewTag('');
  };

  return (
    <div className="fixed inset-0 z-[90] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Saved Locations</h2>
            <span className="text-[8px] bg-elite-gradient text-white px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn("p-1.5 rounded-lg transition-colors", viewMode === 'list' ? "bg-secondary text-foreground" : "text-muted-foreground")}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn("p-1.5 rounded-lg transition-colors", viewMode === 'grid' ? "bg-secondary text-foreground" : "text-muted-foreground")}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors ml-1">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 bg-secondary/30 border-b border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{savedAreas.length} locations saved</span>
            <span className="text-primary font-semibold">Unlimited (Elite)</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedAreas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">No saved locations</h3>
              <p className="text-xs text-muted-foreground">Click the bookmark icon on any area to save it</p>
            </div>
          ) : (
            <div className={cn(viewMode === 'grid' ? "grid grid-cols-2 gap-3" : "space-y-2")}>
              {savedAreas.map(area => {
                const meta = getMeta(area.id);
                const isEditing = editingId === area.id;

                return (
                  <div
                    key={area.id}
                    className={cn(
                      "rounded-lg border border-border overflow-hidden transition-all",
                      isEditing ? "bg-secondary/50" : "bg-card hover:bg-secondary/30 cursor-pointer"
                    )}
                  >
                    <div
                      className="p-3"
                      onClick={() => !isEditing && onSelectArea(area)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">
                            {meta.customName || area.name}
                          </div>
                          {meta.customName && (
                            <div className="text-[10px] text-muted-foreground">{area.name}</div>
                          )}
                        </div>
                        <SafetyScoreBadge score={area.safetyScore} size="sm" />
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Radius className="w-3 h-3" />
                          {meta.radius >= 1000 ? `${meta.radius / 1000}km` : `${meta.radius}m`}
                        </span>
                        {meta.alertEnabled && (
                          <span className="text-[10px] text-primary flex items-center gap-0.5">
                            <Bell className="w-3 h-3" />
                            Alerts on
                          </span>
                        )}
                      </div>

                      {meta.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {meta.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex border-t border-border">
                      <button
                        onClick={() => setEditingId(isEditing ? null : area.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium text-muted-foreground hover:bg-secondary transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        {isEditing ? 'Done' : 'Edit'}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium text-muted-foreground hover:bg-secondary transition-colors border-x border-border">
                        <Share2 className="w-3 h-3" />
                        Share
                      </button>
                      <button
                        onClick={() => onRemove(area.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>

                    {/* Edit panel */}
                    {isEditing && (
                      <div className="p-3 border-t border-border space-y-3">
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Custom Name</label>
                          <Input
                            value={meta.customName || ''}
                            onChange={e => updateMeta(area.id, { customName: e.target.value })}
                            placeholder={area.name}
                            className="mt-1 h-8 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Monitoring Radius</label>
                          <div className="flex gap-1.5 mt-1">
                            {radiusOptions.map(r => (
                              <button
                                key={r}
                                onClick={() => updateMeta(area.id, { radius: r })}
                                className={cn(
                                  "flex-1 py-1.5 rounded text-[10px] font-medium transition-colors",
                                  meta.radius === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                                )}
                              >
                                {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</label>
                          <div className="flex gap-1 mt-1">
                            <Input
                              value={newTag}
                              onChange={e => setNewTag(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && addTag(area.id)}
                              placeholder="Add tag"
                              className="h-7 text-xs flex-1"
                            />
                            <button onClick={() => addTag(area.id)} className="px-2 h-7 rounded bg-primary text-primary-foreground text-xs">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => updateMeta(area.id, { alertEnabled: !meta.alertEnabled })}
                          className={cn(
                            "w-full py-2 rounded-lg text-xs font-medium transition-colors border",
                            meta.alertEnabled ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground"
                          )}
                        >
                          {meta.alertEnabled ? '🔔 Alerts Enabled' : '🔕 Alerts Disabled'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button className="w-full py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Export All Location Reports
          </button>
        </div>
      </div>
    </div>
  );
});

SavedLocationsManager.displayName = 'SavedLocationsManager';
export default SavedLocationsManager;
