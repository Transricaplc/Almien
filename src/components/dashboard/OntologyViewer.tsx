import React, { useState, useMemo } from 'react';
import { 
  Network, 
  MapPin, 
  Home, 
  AlertTriangle, 
  Camera, 
  Phone, 
  Square, 
  Navigation, 
  FileText,
  Circle,
  Search,
  GitBranch,
  Database,
  Layers,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useOntology, EntityType, Entity, EntityStats, formatEntityCount } from '@/hooks/useOntology';
import { cn } from '@/lib/utils';

// Icon mapping component
const EntityIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className }) => {
  const icons: Record<string, React.ReactNode> = {
    'map-pin': <MapPin className={className} />,
    'home': <Home className={className} />,
    'alert-triangle': <AlertTriangle className={className} />,
    'camera': <Camera className={className} />,
    'phone': <Phone className={className} />,
    'square': <Square className={className} />,
    'navigation': <Navigation className={className} />,
    'file-text': <FileText className={className} />,
    'circle': <Circle className={className} />
  };
  return <>{icons[icon] || <Circle className={className} />}</>;
};

// Entity Type Card
const EntityTypeCard: React.FC<{
  type: EntityType;
  stats: EntityStats | undefined;
  isSelected: boolean;
  onClick: () => void;
}> = ({ type, stats, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left p-3 rounded-lg border transition-all duration-200",
      "hover:border-primary/50 hover:bg-accent/50",
      isSelected 
        ? "border-primary bg-primary/10 shadow-sm" 
        : "border-border bg-card"
    )}
  >
    <div className="flex items-center gap-3">
      <div 
        className="p-2 rounded-md"
        style={{ backgroundColor: `${type.color}20` }}
      >
        <EntityIcon 
          icon={type.icon} 
          className="h-4 w-4" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{type.display_name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {type.description || type.type_name}
        </p>
      </div>
      <Badge variant="secondary" className="text-xs shrink-0">
        {formatEntityCount(stats?.entity_count || 0)}
      </Badge>
    </div>
  </button>
);

// Relationship Type Badge
const RelationshipBadge: React.FC<{
  typeName: string;
  displayName: string;
  fromType: string;
  toType: string;
}> = ({ displayName, fromType, toType }) => (
  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs">
    <Badge variant="outline" className="text-xs">{fromType}</Badge>
    <ArrowRight className="h-3 w-3 text-muted-foreground" />
    <span className="text-muted-foreground font-medium">{displayName}</span>
    <ArrowRight className="h-3 w-3 text-muted-foreground" />
    <Badge variant="outline" className="text-xs">{toType}</Badge>
  </div>
);

// Entity List Item
const EntityListItem: React.FC<{
  entity: Entity;
  entityType: EntityType | undefined;
  onSelect: (entity: Entity) => void;
}> = ({ entity, entityType, onSelect }) => (
  <button
    onClick={() => onSelect(entity)}
    className="w-full text-left p-2 rounded-md hover:bg-accent/50 transition-colors flex items-center gap-2 group"
  >
    <EntityIcon 
      icon={entityType?.icon || 'circle'} 
      className="h-3.5 w-3.5 text-muted-foreground" 
    />
    <span className="flex-1 text-sm truncate">{entity.name}</span>
    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);

// Stats Overview Cards
const StatsOverview: React.FC<{ stats: EntityStats[] }> = ({ stats }) => {
  const totalEntities = stats.reduce((acc, s) => acc + (s.entity_count || 0), 0);
  const activeEntities = stats.reduce((acc, s) => acc + (s.active_count || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-primary">
            <Database className="h-4 w-4" />
            <span className="text-xs font-medium">Total Entities</span>
          </div>
          <p className="text-2xl font-bold mt-1">{formatEntityCount(totalEntities)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Circle className="h-4 w-4 fill-current" />
            <span className="text-xs font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold mt-1">{formatEntityCount(activeEntities)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Layers className="h-4 w-4" />
            <span className="text-xs font-medium">Entity Types</span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.length}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <GitBranch className="h-4 w-4" />
            <span className="text-xs font-medium">Relationships</span>
          </div>
          <p className="text-2xl font-bold mt-1">9</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Entity Detail Panel
const EntityDetailPanel: React.FC<{
  entity: Entity | null;
  entityType: EntityType | undefined;
  onClose: () => void;
}> = ({ entity, entityType, onClose }) => {
  if (!entity) return null;

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-md"
              style={{ backgroundColor: `${entityType?.color || '#6366f1'}20` }}
            >
              <EntityIcon 
                icon={entityType?.icon || 'circle'} 
                className="h-4 w-4" 
              />
            </div>
            <div>
              <CardTitle className="text-base">{entity.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{entityType?.display_name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {entity.description && (
          <p className="text-sm text-muted-foreground">{entity.description}</p>
        )}
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Properties</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(entity.properties || {}).map(([key, value]) => (
              <div key={key} className="p-2 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">{key}</p>
                <p className="text-sm font-medium truncate">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Source: {entity.source}</span>
            <Badge variant={entity.is_active ? 'default' : 'secondary'} className="text-xs">
              {entity.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Ontology Viewer Component
export const OntologyViewer: React.FC = () => {
  const { 
    entityTypes, 
    entities, 
    relationshipTypes,
    stats,
    loading, 
    error, 
    refetch,
    getEntitiesByType
  } = useOntology();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EntityType | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  // Get stats map for quick lookup
  const statsMap = useMemo(() => {
    return new Map(stats.map(s => [s.type_name, s]));
  }, [stats]);

  // Filter entities based on selected type and search
  const filteredEntities = useMemo(() => {
    let result = selectedType 
      ? getEntitiesByType(selectedType.type_name)
      : entities;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query)
      );
    }

    return result.slice(0, 50);
  }, [selectedType, entities, searchQuery, getEntitiesByType]);

  // Get entity type for selected entity
  const selectedEntityType = useMemo(() => {
    if (!selectedEntity) return undefined;
    return entityTypes.find(t => t.id === selectedEntity.entity_type_id);
  }, [selectedEntity, entityTypes]);

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading ontology...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center space-y-2 text-destructive">
          <AlertTriangle className="h-6 w-6 mx-auto" />
          <p className="text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={refetch}>Retry</Button>
        </div>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Network className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Urban Safety Ontology</h2>
              <p className="text-xs text-muted-foreground">
                Domain-specific entity graph • Open architecture
              </p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={refetch}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh data</TooltipContent>
          </Tooltip>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Main Content */}
        <Tabs defaultValue="entities" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entities" className="text-xs">
              <Database className="h-3.5 w-3.5 mr-1.5" />
              Entities
            </TabsTrigger>
            <TabsTrigger value="types" className="text-xs">
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              Types
            </TabsTrigger>
            <TabsTrigger value="relationships" className="text-xs">
              <GitBranch className="h-3.5 w-3.5 mr-1.5" />
              Relationships
            </TabsTrigger>
          </TabsList>

          {/* Entities Tab */}
          <TabsContent value="entities" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Entity Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2 pr-2">
                      <button
                        onClick={() => setSelectedType(null)}
                        className={cn(
                          "w-full text-left p-2 rounded-md text-sm transition-colors",
                          !selectedType 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-accent/50"
                        )}
                      >
                        All Types ({entities.length})
                      </button>
                      {entityTypes.map(type => (
                        <EntityTypeCard
                          key={type.id}
                          type={type}
                          stats={statsMap.get(type.type_name)}
                          isSelected={selectedType?.id === type.id}
                          onClick={() => setSelectedType(type)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Entity List */}
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>
                      {selectedType?.display_name || 'All'} Entities
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {filteredEntities.length}
                    </Badge>
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search entities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[260px]">
                    <div className="space-y-1 pr-2">
                      {filteredEntities.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          <Info className="h-5 w-5 mx-auto mb-2 opacity-50" />
                          <p>No entities found</p>
                          <p className="text-xs mt-1">
                            Entities will populate as data is synced
                          </p>
                        </div>
                      ) : (
                        filteredEntities.map(entity => (
                          <EntityListItem
                            key={entity.id}
                            entity={entity}
                            entityType={entityTypes.find(t => t.id === entity.entity_type_id)}
                            onSelect={setSelectedEntity}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Entity Detail */}
              <div className="md:col-span-1">
                {selectedEntity ? (
                  <EntityDetailPanel
                    entity={selectedEntity}
                    entityType={selectedEntityType}
                    onClose={() => setSelectedEntity(null)}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center border-dashed">
                    <div className="text-center p-6 text-muted-foreground">
                      <Database className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Select an entity to view details</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Types Tab */}
          <TabsContent value="types">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {entityTypes.map(type => (
                <Card key={type.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2.5 rounded-lg shrink-0"
                        style={{ backgroundColor: `${type.color}20` }}
                      >
                        <EntityIcon 
                          icon={type.icon} 
                          className="h-5 w-5" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">{type.display_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {type.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.keys(type.properties_schema || {}).map(prop => (
                            <Badge key={prop} variant="outline" className="text-xs">
                              {prop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Relationships Tab */}
          <TabsContent value="relationships">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Relationship Types</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Defines how entities connect in the urban safety graph
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relationshipTypes.map(rel => (
                    <RelationshipBadge
                      key={rel.id}
                      typeName={rel.type_name}
                      displayName={rel.display_name}
                      fromType={rel.from_entity_type}
                      toType={rel.to_entity_type}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default OntologyViewer;
