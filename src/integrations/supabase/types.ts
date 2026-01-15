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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
