import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface EntityType {
  id: string;
  type_name: string;
  display_name: string;
  description: string | null;
  icon: string;
  color: string;
  properties_schema: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Entity {
  id: string;
  entity_type_id: string;
  external_id: string | null;
  name: string;
  description: string | null;
  properties: Record<string, unknown>;
  metadata: Record<string, unknown>;
  source: string;
  source_timestamp: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  entity_type?: EntityType;
}

export interface RelationshipType {
  id: string;
  type_name: string;
  display_name: string;
  description: string | null;
  from_entity_type: string;
  to_entity_type: string;
  is_bidirectional: boolean;
  properties_schema: Record<string, string>;
  created_at: string;
}

export interface Relationship {
  id: string;
  relationship_type_id: string;
  from_entity_id: string;
  to_entity_id: string;
  properties: Record<string, unknown>;
  confidence: number;
  source: string;
  valid_from: string;
  valid_to: string | null;
  created_at: string;
  // Joined data
  relationship_type?: RelationshipType;
  from_entity?: Entity;
  to_entity?: Entity;
}

export interface EntityStats {
  type_name: string;
  display_name: string;
  icon: string;
  color: string;
  entity_count: number;
  active_count: number;
  last_updated: string | null;
}

export interface EntityNeighbor {
  entity_id: string;
  entity_name: string;
  entity_type: string;
  relationship_type: string;
  direction: 'incoming' | 'outgoing';
  depth: number;
}

// =============================================
// MAIN HOOK
// =============================================

interface UseOntologyReturn {
  // Data
  entityTypes: EntityType[];
  entities: Entity[];
  relationshipTypes: RelationshipType[];
  relationships: Relationship[];
  stats: EntityStats[];
  
  // State
  loading: boolean;
  error: string | null;
  
  // Actions
  refetch: () => Promise<void>;
  getEntityById: (id: string) => Entity | undefined;
  getEntitiesByType: (typeName: string) => Entity[];
  getEntityNeighborhood: (entityId: string, maxDepth?: number) => Promise<EntityNeighbor[]>;
  searchEntities: (query: string) => Entity[];
  
  // Relationship helpers
  getRelationshipsForEntity: (entityId: string) => Relationship[];
  getConnectedEntities: (entityId: string) => Entity[];
}

export const useOntology = (): UseOntologyReturn => {
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [stats, setStats] = useState<EntityStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        entityTypesRes,
        entitiesRes,
        relationshipTypesRes,
        relationshipsRes,
        statsRes
      ] = await Promise.all([
        supabase.from('ontology_entity_types').select('*').order('display_name'),
        supabase.from('ontology_entities').select('*').order('name'),
        supabase.from('ontology_relationship_types').select('*').order('display_name'),
        supabase.from('ontology_relationships').select('*'),
        supabase.rpc('get_entity_stats')
      ]);

      if (entityTypesRes.error) throw entityTypesRes.error;
      if (entitiesRes.error) throw entitiesRes.error;
      if (relationshipTypesRes.error) throw relationshipTypesRes.error;
      if (relationshipsRes.error) throw relationshipsRes.error;
      // Stats might fail if no data, handle gracefully
      
      setEntityTypes((entityTypesRes.data || []) as EntityType[]);
      setEntities((entitiesRes.data || []) as Entity[]);
      setRelationshipTypes((relationshipTypesRes.data || []) as RelationshipType[]);
      setRelationships((relationshipsRes.data || []) as Relationship[]);
      setStats((statsRes.data || []) as EntityStats[]);

    } catch (err) {
      console.error('Error fetching ontology data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch ontology data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Entity lookup by ID
  const getEntityById = useCallback((id: string): Entity | undefined => {
    return entities.find(e => e.id === id);
  }, [entities]);

  // Get entities by type name
  const getEntitiesByType = useCallback((typeName: string): Entity[] => {
    const type = entityTypes.find(t => t.type_name === typeName);
    if (!type) return [];
    return entities.filter(e => e.entity_type_id === type.id);
  }, [entities, entityTypes]);

  // Get entity neighborhood via RPC
  const getEntityNeighborhood = useCallback(async (
    entityId: string, 
    maxDepth: number = 1
  ): Promise<EntityNeighbor[]> => {
    const { data, error } = await supabase.rpc('get_entity_neighborhood', {
      p_entity_id: entityId,
      p_max_depth: maxDepth
    });

    if (error) {
      console.error('Error fetching neighborhood:', error);
      return [];
    }

    return (data || []) as EntityNeighbor[];
  }, []);

  // Search entities by name
  const searchEntities = useMemo(() => {
    return (query: string): Entity[] => {
      if (!query.trim()) return [];
      const lowerQuery = query.toLowerCase();
      return entities.filter(e => 
        e.name.toLowerCase().includes(lowerQuery) ||
        e.description?.toLowerCase().includes(lowerQuery)
      ).slice(0, 20);
    };
  }, [entities]);

  // Get all relationships for an entity
  const getRelationshipsForEntity = useCallback((entityId: string): Relationship[] => {
    return relationships.filter(
      r => r.from_entity_id === entityId || r.to_entity_id === entityId
    );
  }, [relationships]);

  // Get all connected entities
  const getConnectedEntities = useCallback((entityId: string): Entity[] => {
    const rels = getRelationshipsForEntity(entityId);
    const connectedIds = new Set<string>();
    
    rels.forEach(r => {
      if (r.from_entity_id !== entityId) connectedIds.add(r.from_entity_id);
      if (r.to_entity_id !== entityId) connectedIds.add(r.to_entity_id);
    });

    return entities.filter(e => connectedIds.has(e.id));
  }, [entities, getRelationshipsForEntity]);

  return {
    entityTypes,
    entities,
    relationshipTypes,
    relationships,
    stats,
    loading,
    error,
    refetch: fetchAll,
    getEntityById,
    getEntitiesByType,
    getEntityNeighborhood,
    searchEntities,
    getRelationshipsForEntity,
    getConnectedEntities
  };
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

export const getIconComponent = (iconName: string) => {
  // Map icon names to lucide-react icons
  const iconMap: Record<string, string> = {
    'map-pin': 'MapPin',
    'home': 'Home',
    'alert-triangle': 'AlertTriangle',
    'camera': 'Camera',
    'phone': 'Phone',
    'square': 'Square',
    'navigation': 'Navigation',
    'file-text': 'FileText',
    'circle': 'Circle'
  };
  return iconMap[iconName] || 'Circle';
};

export const formatEntityCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};
