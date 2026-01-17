export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_cache: {
        Row: {
          cache_key: string
          created_at: string
          data: Json
          endpoint: string
          expires_at: string
          id: string
          source: string
          updated_at: string
        }
        Insert: {
          cache_key: string
          created_at?: string
          data: Json
          endpoint: string
          expires_at: string
          id?: string
          source: string
          updated_at?: string
        }
        Update: {
          cache_key?: string
          created_at?: string
          data?: Json
          endpoint?: string
          expires_at?: string
          id?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      beaches: {
        Row: {
          coordinates_lat: number | null
          coordinates_lng: number | null
          created_at: string
          current_conditions: string | null
          id: string
          is_open: boolean
          last_updated: string
          lifeguard_on_duty: boolean
          location: string
          name: string
          shark_flag_status: string
          water_quality: string
          water_temp_celsius: number | null
          wind_speed_kmh: number | null
        }
        Insert: {
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          created_at?: string
          current_conditions?: string | null
          id?: string
          is_open?: boolean
          last_updated?: string
          lifeguard_on_duty?: boolean
          location: string
          name: string
          shark_flag_status?: string
          water_quality?: string
          water_temp_celsius?: number | null
          wind_speed_kmh?: number | null
        }
        Update: {
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          created_at?: string
          current_conditions?: string | null
          id?: string
          is_open?: boolean
          last_updated?: string
          lifeguard_on_duty?: boolean
          location?: string
          name?: string
          shark_flag_status?: string
          water_quality?: string
          water_temp_celsius?: number | null
          wind_speed_kmh?: number | null
        }
        Relationships: []
      }
      citizen_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          infrastructure_type: string | null
          latitude: number | null
          longitude: number | null
          report_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          infrastructure_type?: string | null
          latitude?: number | null
          longitude?: number | null
          report_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          infrastructure_type?: string | null
          latitude?: number | null
          longitude?: number | null
          report_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      flight_status: {
        Row: {
          actual_time: string | null
          airline: string
          created_at: string
          flight_number: string
          flight_type: string
          gate: string | null
          id: string
          last_updated: string
          origin_destination: string
          scheduled_time: string
          status: string
          terminal: string | null
        }
        Insert: {
          actual_time?: string | null
          airline: string
          created_at?: string
          flight_number: string
          flight_type: string
          gate?: string | null
          id?: string
          last_updated?: string
          origin_destination: string
          scheduled_time: string
          status?: string
          terminal?: string | null
        }
        Update: {
          actual_time?: string | null
          airline?: string
          created_at?: string
          flight_number?: string
          flight_type?: string
          gate?: string | null
          id?: string
          last_updated?: string
          origin_destination?: string
          scheduled_time?: string
          status?: string
          terminal?: string | null
        }
        Relationships: []
      }
      hiking_trails: {
        Row: {
          coordinates_lat: number | null
          coordinates_lng: number | null
          created_at: string
          difficulty: string
          distance_km: number
          elevation_gain_m: number
          estimated_hours: number
          id: string
          is_open: boolean
          location: string
          name: string
          safety_notes: string | null
          sunrise_time: string | null
          sunset_time: string | null
        }
        Insert: {
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          created_at?: string
          difficulty: string
          distance_km: number
          elevation_gain_m?: number
          estimated_hours: number
          id?: string
          is_open?: boolean
          location: string
          name: string
          safety_notes?: string | null
          sunrise_time?: string | null
          sunset_time?: string | null
        }
        Update: {
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          created_at?: string
          difficulty?: string
          distance_km?: number
          elevation_gain_m?: number
          estimated_hours?: number
          id?: string
          is_open?: boolean
          location?: string
          name?: string
          safety_notes?: string | null
          sunrise_time?: string | null
          sunset_time?: string | null
        }
        Relationships: []
      }
      loadshedding_status: {
        Row: {
          area_code: string | null
          created_at: string
          end_time: string | null
          id: string
          is_active: boolean
          last_updated: string
          source: string
          stage: number
          start_time: string | null
          suburb: string | null
        }
        Insert: {
          area_code?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          is_active?: boolean
          last_updated?: string
          source?: string
          stage?: number
          start_time?: string | null
          suburb?: string | null
        }
        Update: {
          area_code?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          is_active?: boolean
          last_updated?: string
          source?: string
          stage?: number
          start_time?: string | null
          suburb?: string | null
        }
        Relationships: []
      }
      ontology_entities: {
        Row: {
          created_at: string
          description: string | null
          entity_type_id: string
          external_id: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          properties: Json | null
          source: string | null
          source_timestamp: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entity_type_id: string
          external_id?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          properties?: Json | null
          source?: string | null
          source_timestamp?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entity_type_id?: string
          external_id?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          properties?: Json | null
          source?: string | null
          source_timestamp?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ontology_entities_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "ontology_entity_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ontology_entity_types: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          display_name: string
          icon: string | null
          id: string
          properties_schema: Json | null
          type_name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          properties_schema?: Json | null
          type_name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          properties_schema?: Json | null
          type_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      ontology_lineage: {
        Row: {
          actor: string | null
          entity_id: string
          id: string
          new_state: Json | null
          operation: string
          previous_state: Json | null
          source_record_id: string | null
          source_system: string
          source_table: string | null
          timestamp: string
          transformation: string | null
        }
        Insert: {
          actor?: string | null
          entity_id: string
          id?: string
          new_state?: Json | null
          operation: string
          previous_state?: Json | null
          source_record_id?: string | null
          source_system: string
          source_table?: string | null
          timestamp?: string
          transformation?: string | null
        }
        Update: {
          actor?: string | null
          entity_id?: string
          id?: string
          new_state?: Json | null
          operation?: string
          previous_state?: Json | null
          source_record_id?: string | null
          source_system?: string
          source_table?: string | null
          timestamp?: string
          transformation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ontology_lineage_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "mv_entity_graph"
            referencedColumns: ["from_id"]
          },
          {
            foreignKeyName: "ontology_lineage_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "mv_entity_graph"
            referencedColumns: ["to_id"]
          },
          {
            foreignKeyName: "ontology_lineage_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "ontology_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      ontology_relationship_types: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          from_entity_type: string
          id: string
          is_bidirectional: boolean | null
          properties_schema: Json | null
          to_entity_type: string
          type_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          from_entity_type: string
          id?: string
          is_bidirectional?: boolean | null
          properties_schema?: Json | null
          to_entity_type: string
          type_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          from_entity_type?: string
          id?: string
          is_bidirectional?: boolean | null
          properties_schema?: Json | null
          to_entity_type?: string
          type_name?: string
        }
        Relationships: []
      }
      ontology_relationships: {
        Row: {
          confidence: number | null
          created_at: string
          from_entity_id: string
          id: string
          properties: Json | null
          relationship_type_id: string
          source: string | null
          to_entity_id: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          from_entity_id: string
          id?: string
          properties?: Json | null
          relationship_type_id: string
          source?: string | null
          to_entity_id: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          from_entity_id?: string
          id?: string
          properties?: Json | null
          relationship_type_id?: string
          source?: string | null
          to_entity_id?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ontology_relationships_from_entity_id_fkey"
            columns: ["from_entity_id"]
            isOneToOne: false
            referencedRelation: "mv_entity_graph"
            referencedColumns: ["from_id"]
          },
          {
            foreignKeyName: "ontology_relationships_from_entity_id_fkey"
            columns: ["from_entity_id"]
            isOneToOne: false
            referencedRelation: "mv_entity_graph"
            referencedColumns: ["to_id"]
          },
          {
            foreignKeyName: "ontology_relationships_from_entity_id_fkey"
            columns: ["from_entity_id"]
            isOneToOne: false
            referencedRelation: "ontology_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ontology_relationships_relationship_type_id_fkey"
            columns: ["relationship_type_id"]
            isOneToOne: false
            referencedRelation: "ontology_relationship_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ontology_relationships_to_entity_id_fkey"
            columns: ["to_entity_id"]
            isOneToOne: false
            referencedRelation: "mv_entity_graph"
            referencedColumns: ["from_id"]
          },
          {
            foreignKeyName: "ontology_relationships_to_entity_id_fkey"
            columns: ["to_entity_id"]
            isOneToOne: false
            referencedRelation: "mv_entity_graph"
            referencedColumns: ["to_id"]
          },
          {
            foreignKeyName: "ontology_relationships_to_entity_id_fkey"
            columns: ["to_entity_id"]
            isOneToOne: false
            referencedRelation: "ontology_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      running_routes: {
        Row: {
          coordinates_lat: number | null
          coordinates_lng: number | null
          created_at: string
          difficulty: string
          distance_km: number
          has_water_stations: boolean | null
          id: string
          is_lit: boolean | null
          is_open: boolean | null
          location: string
          name: string
          notes: string | null
          safety_rating: number | null
          terrain: string
        }
        Insert: {
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          created_at?: string
          difficulty?: string
          distance_km: number
          has_water_stations?: boolean | null
          id?: string
          is_lit?: boolean | null
          is_open?: boolean | null
          location: string
          name: string
          notes?: string | null
          safety_rating?: number | null
          terrain?: string
        }
        Update: {
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          created_at?: string
          difficulty?: string
          distance_km?: number
          has_water_stations?: boolean | null
          id?: string
          is_lit?: boolean | null
          is_open?: boolean | null
          location?: string
          name?: string
          notes?: string | null
          safety_rating?: number | null
          terrain?: string
        }
        Relationships: []
      }
      suburb_intelligence: {
        Row: {
          area_code: string
          cctv_coverage: number
          created_at: string
          fire_contact: string
          fire_station: string
          hospital_contact: string
          hospital_name: string
          id: string
          incidents_24h: number
          risk_type: string | null
          safety_score: number
          saps_contact: string
          saps_station: string
          suburb_name: string
          updated_at: string
          ward_id: number
        }
        Insert: {
          area_code: string
          cctv_coverage?: number
          created_at?: string
          fire_contact: string
          fire_station: string
          hospital_contact: string
          hospital_name: string
          id: string
          incidents_24h?: number
          risk_type?: string | null
          safety_score: number
          saps_contact: string
          saps_station: string
          suburb_name: string
          updated_at?: string
          ward_id: number
        }
        Update: {
          area_code?: string
          cctv_coverage?: number
          created_at?: string
          fire_contact?: string
          fire_station?: string
          hospital_contact?: string
          hospital_name?: string
          id?: string
          incidents_24h?: number
          risk_type?: string | null
          safety_score?: number
          saps_contact?: string
          saps_station?: string
          suburb_name?: string
          updated_at?: string
          ward_id?: number
        }
        Relationships: []
      }
      train_routes: {
        Row: {
          created_at: string
          id: string
          incidents_24h: number
          is_operational: boolean
          last_updated: string
          name: string
          operating_cameras: number
          route_code: string
          safety_score: number
          stations: number
          status: string
          total_cameras: number
        }
        Insert: {
          created_at?: string
          id?: string
          incidents_24h?: number
          is_operational?: boolean
          last_updated?: string
          name: string
          operating_cameras?: number
          route_code: string
          safety_score?: number
          stations?: number
          status?: string
          total_cameras?: number
        }
        Update: {
          created_at?: string
          id?: string
          incidents_24h?: number
          is_operational?: boolean
          last_updated?: string
          name?: string
          operating_cameras?: number
          route_code?: string
          safety_score?: number
          stations?: number
          status?: string
          total_cameras?: number
        }
        Relationships: []
      }
      water_outages: {
        Row: {
          area_description: string
          created_at: string
          estimated_end_time: string | null
          id: string
          is_active: boolean
          outage_type: string
          start_time: string
          suburb: string
          updated_at: string
        }
        Insert: {
          area_description: string
          created_at?: string
          estimated_end_time?: string | null
          id?: string
          is_active?: boolean
          outage_type?: string
          start_time?: string
          suburb: string
          updated_at?: string
        }
        Update: {
          area_description?: string
          created_at?: string
          estimated_end_time?: string | null
          id?: string
          is_active?: boolean
          outage_type?: string
          start_time?: string
          suburb?: string
          updated_at?: string
        }
        Relationships: []
      }
      water_status: {
        Row: {
          capacity_ml: number
          created_at: string
          current_level: number
          dam_code: string
          dam_name: string
          id: string
          last_updated: string
          status: string
        }
        Insert: {
          capacity_ml: number
          created_at?: string
          current_level?: number
          dam_code: string
          dam_name: string
          id?: string
          last_updated?: string
          status?: string
        }
        Update: {
          capacity_ml?: number
          created_at?: string
          current_level?: number
          dam_code?: string
          dam_name?: string
          id?: string
          last_updated?: string
          status?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          created_at: string
          description: string | null
          feels_like_celsius: number | null
          humidity_percent: number | null
          icon_code: string | null
          id: string
          last_updated: string
          location: string
          temperature_celsius: number | null
          uv_index: number | null
          visibility_km: number | null
          wind_direction: string | null
          wind_speed_kmh: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          feels_like_celsius?: number | null
          humidity_percent?: number | null
          icon_code?: string | null
          id?: string
          last_updated?: string
          location?: string
          temperature_celsius?: number | null
          uv_index?: number | null
          visibility_km?: number | null
          wind_direction?: string | null
          wind_speed_kmh?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          feels_like_celsius?: number | null
          humidity_percent?: number | null
          icon_code?: string | null
          id?: string
          last_updated?: string
          location?: string
          temperature_celsius?: number | null
          uv_index?: number | null
          visibility_km?: number | null
          wind_direction?: string | null
          wind_speed_kmh?: number | null
        }
        Relationships: []
      }
      wind_reports: {
        Row: {
          advisory: string | null
          affects_beach_goers: boolean
          affects_drivers: boolean
          affects_hikers: boolean
          affects_surfers: boolean
          created_at: string
          description: string | null
          id: string
          last_updated: string
          location: string
          severity: string
          wind_direction: string
          wind_gust_kmh: number | null
          wind_speed_kmh: number
        }
        Insert: {
          advisory?: string | null
          affects_beach_goers?: boolean
          affects_drivers?: boolean
          affects_hikers?: boolean
          affects_surfers?: boolean
          created_at?: string
          description?: string | null
          id?: string
          last_updated?: string
          location: string
          severity?: string
          wind_direction: string
          wind_gust_kmh?: number | null
          wind_speed_kmh: number
        }
        Update: {
          advisory?: string | null
          affects_beach_goers?: boolean
          affects_drivers?: boolean
          affects_hikers?: boolean
          affects_surfers?: boolean
          created_at?: string
          description?: string | null
          id?: string
          last_updated?: string
          location?: string
          severity?: string
          wind_direction?: string
          wind_gust_kmh?: number | null
          wind_speed_kmh?: number
        }
        Relationships: []
      }
    }
    Views: {
      mv_entity_graph: {
        Row: {
          confidence: number | null
          from_id: string | null
          from_name: string | null
          from_type: string | null
          relationship_display: string | null
          relationship_id: string | null
          relationship_type: string | null
          to_id: string | null
          to_name: string | null
          to_type: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Relationships: []
      }
      mv_entity_stats: {
        Row: {
          active_count: number | null
          color: string | null
          display_name: string | null
          entity_count: number | null
          icon: string | null
          last_updated: string | null
          type_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_entity_neighborhood: {
        Args: { p_entity_id: string; p_max_depth?: number }
        Returns: {
          depth: number
          direction: string
          entity_id: string
          entity_name: string
          entity_type: string
          relationship_type: string
        }[]
      }
      refresh_ontology_views: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
