export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      access_requests: {
        Row: {
          created_at: string;
          district: string | null;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          organization: string | null;
          phone: string | null;
        };
        Insert: {
          created_at?: string;
          district?: string | null;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          organization?: string | null;
          phone?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["access_requests"]["Insert"]>;
        Relationships: [];
      };
      alert_recipients: {
        Row: {
          alert_id: string;
          contact_id: string;
          created_at: string;
          distance_m: number | null;
          id: string;
          notified_at: string | null;
          responded_at: string | null;
          response: string | null;
        };
        Insert: {
          alert_id: string;
          contact_id: string;
          created_at?: string;
          distance_m?: number | null;
          id?: string;
          notified_at?: string | null;
          responded_at?: string | null;
          response?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["alert_recipients"]["Insert"]>;
        Relationships: [];
      };
      alerts: {
        Row: {
          created_at: string;
          created_by: string | null;
          crisis_type: string;
          id: string;
          latitude: number;
          location: unknown | null;
          longitude: number;
          radius_km: number;
          status: "draft" | "triggered" | "closed";
          triggered_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          crisis_type: string;
          id?: string;
          latitude: number;
          location?: unknown | null;
          longitude: number;
          radius_km?: number;
          status?: "draft" | "triggered" | "closed";
          triggered_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["alerts"]["Insert"]>;
        Relationships: [];
      };
      contact_locations: {
        Row: {
          accuracy_m: number | null;
          contact_id: string;
          created_at: string;
          id: string;
          is_primary: boolean;
          label: string;
          latitude: number;
          location: unknown | null;
          longitude: number;
          updated_at: string;
        };
        Insert: {
          accuracy_m?: number | null;
          contact_id: string;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          label?: string;
          latitude: number;
          location?: unknown | null;
          longitude: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_locations"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          message: string;
          name: string;
          phone: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message: string;
          name: string;
          phone?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      contacts: {
        Row: {
          added_by: string | null;
          archived_at: string | null;
          block: string;
          created_at: string;
          district: string;
          id: string;
          last_visit_at: string | null;
          name: string;
          name_hi: string | null;
          notes: string | null;
          panchayat: string;
          phone: string | null;
          photo_url: string | null;
          tags: string[];
          updated_at: string;
          village: string;
          visit_count: number;
          whatsapp: string | null;
        };
        Insert: {
          added_by?: string | null;
          archived_at?: string | null;
          block: string;
          created_at?: string;
          district: string;
          id?: string;
          last_visit_at?: string | null;
          name: string;
          name_hi?: string | null;
          notes?: string | null;
          panchayat: string;
          phone?: string | null;
          photo_url?: string | null;
          tags?: string[];
          updated_at?: string;
          village: string;
          visit_count?: number;
          whatsapp?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>;
        Relationships: [];
      };
      interactions: {
        Row: {
          contact_id: string;
          created_at: string;
          id: string;
          interacted_at: string;
          interacted_by: string | null;
          interaction_type: string;
          notes: string | null;
        };
        Insert: {
          contact_id: string;
          created_at?: string;
          id?: string;
          interacted_at?: string;
          interacted_by?: string | null;
          interaction_type: string;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["interactions"]["Insert"]>;
        Relationships: [];
      };
      issues: {
        Row: {
          action_taken: string | null;
          archived_at: string | null;
          assigned_to: string | null;
          contact_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          next_followup_at: string | null;
          priority: "low" | "medium" | "high" | "critical";
          resolved_at: string | null;
          status: "open" | "in_progress" | "blocked" | "resolved";
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          action_taken?: string | null;
          archived_at?: string | null;
          assigned_to?: string | null;
          contact_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          next_followup_at?: string | null;
          priority?: "low" | "medium" | "high" | "critical";
          resolved_at?: string | null;
          status?: "open" | "in_progress" | "blocked" | "resolved";
          title: string;
          type: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["issues"]["Insert"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          created_at: string;
          display_name: string;
          id: string;
          phone: string | null;
          role: "admin" | "field_worker" | "view_only";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          id?: string;
          phone?: string | null;
          role?: "admin" | "field_worker" | "view_only";
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      visits: {
        Row: {
          archived_at: string | null;
          contact_id: string | null;
          created_at: string;
          duration_mins: number | null;
          id: string;
          latitude: number | null;
          location: unknown | null;
          longitude: number | null;
          notes: string | null;
          outcome: string | null;
          panchayat: string;
          updated_at: string;
          village: string;
          visited_at: string;
          visited_by: string | null;
        };
        Insert: {
          archived_at?: string | null;
          contact_id?: string | null;
          created_at?: string;
          duration_mins?: number | null;
          id?: string;
          latitude?: number | null;
          location?: unknown | null;
          longitude?: number | null;
          notes?: string | null;
          outcome?: string | null;
          panchayat: string;
          updated_at?: string;
          village: string;
          visited_at?: string;
          visited_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["visits"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      dashboard_priority: {
        Row: {
          block: string;
          critical_issue_count: number;
          district: string;
          gap_level: string;
          id: string;
          last_visit_at: string | null;
          name: string;
          name_hi: string | null;
          open_issue_count: number;
          panchayat: string;
          tags: string[];
          village: string;
          visit_count: number;
        };
        Relationships: [];
      };
      panchayat_visit_summary: {
        Row: {
          contacts_needing_attention: number;
          last_activity_at: string | null;
          open_issues: number;
          panchayat: string;
          total_contacts: number;
          visit_count: number;
        };
        Relationships: [];
      };
      suggested_area_scores: {
        Row: {
          contacts_needing_attention: number;
          last_activity_at: string | null;
          open_issues: number;
          panchayat: string;
          score: number;
          total_contacts: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      find_nearby_contacts: {
        Args: {
          input_lat: number;
          input_lng: number;
          input_radius_km?: number;
          input_tag?: string | null;
        };
        Returns: {
          contact_id: string;
          distance_m: number;
          gap_level: string;
          latitude: number;
          longitude: number;
          name: string;
          name_hi: string | null;
          panchayat: string;
          phone: string | null;
          tags: string[];
          village: string;
        }[];
      };
    };
    Enums: {
      alert_status: "draft" | "triggered" | "closed";
      issue_priority: "low" | "medium" | "high" | "critical";
      issue_status: "open" | "in_progress" | "blocked" | "resolved";
      team_role: "admin" | "field_worker" | "view_only";
    };
    CompositeTypes: Record<string, never>;
  };
};
