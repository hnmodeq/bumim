/**
 * Supabase database types — generated from the Phase 3 schema
 * (supabase/migrations/0001–0006) on 2026-09-14.
 *
 * Kept in sync by hand because no Supabase CLI/remote project is available in
 * this environment. Regenerate with the CLI once a linked project exists:
 *
 *   supabase gen types typescript --project-id <ref> > src/types/database.types.ts
 *
 * Column types marked with a string-literal union are constrained by a CHECK
 * constraint in the migration (e.g. profiles.role, services.rate_unit).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_path: string | null
          bio: string | null
          cover_path: string | null
          created_at: string
          display_name: string
          id: string
          is_public: boolean
          is_verified: boolean
          locale: string
          role: "editor" | "customer" | "admin"
          updated_at: string
          username: string
        }
        Insert: {
          avatar_path?: string | null
          bio?: string | null
          cover_path?: string | null
          created_at?: string
          display_name: string
          id: string
          is_public?: boolean
          is_verified?: boolean
          locale?: string
          role?: "editor" | "customer" | "admin"
          updated_at?: string
          username: string
        }
        Update: {
          avatar_path?: string | null
          bio?: string | null
          cover_path?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_public?: boolean
          is_verified?: boolean
          locale?: string
          role?: "editor" | "customer" | "admin"
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      editor_profiles: {
        Row: {
          availability: "available" | "limited" | "booked"
          city: string | null
          created_at: string
          headline: string | null
          id: string
          industries: string[]
          languages: string[]
          location: string | null
          preferred_project_types: string[]
          profile_id: string
          rating_avg: number
          rating_count: number
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          availability?: "available" | "limited" | "booked"
          city?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          industries?: string[]
          languages?: string[]
          location?: string | null
          preferred_project_types?: string[]
          profile_id: string
          rating_avg?: number
          rating_count?: number
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          availability?: "available" | "limited" | "booked"
          city?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          industries?: string[]
          languages?: string[]
          location?: string | null
          preferred_project_types?: string[]
          profile_id?: string
          rating_avg?: number
          rating_count?: number
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "editor_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          id: string
          name_en: string | null
          name_fa: string
          slug: string
        }
        Insert: {
          category?: string | null
          id?: string
          name_en?: string | null
          name_fa: string
          slug: string
        }
        Update: {
          category?: string | null
          id?: string
          name_en?: string | null
          name_fa?: string
          slug?: string
        }
        Relationships: []
      }
      software: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      editor_skills: {
        Row: {
          editor_id: string
          skill_id: string
        }
        Insert: {
          editor_id: string
          skill_id: string
        }
        Update: {
          editor_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "editor_skills_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "editor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editor_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      editor_software: {
        Row: {
          editor_id: string
          software_id: string
        }
        Insert: {
          editor_id: string
          software_id: string
        }
        Update: {
          editor_id?: string
          software_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "editor_software_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "editor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editor_software_software_id_fkey"
            columns: ["software_id"]
            isOneToOne: false
            referencedRelation: "software"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          editor_id: string
          id: string
          is_active: boolean
          rate_rial: number
          rate_unit: "project" | "hour" | "day" | "minute" | "second"
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          editor_id: string
          id?: string
          is_active?: boolean
          rate_rial: number
          rate_unit?: "project" | "hour" | "day" | "minute" | "second"
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          editor_id?: string
          id?: string
          is_active?: boolean
          rate_rial?: number
          rate_unit?: "project" | "hour" | "day" | "minute" | "second"
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "editor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          client: string | null
          created_at: string
          description: string | null
          editor_id: string
          id: string
          is_featured: boolean
          role: string | null
          status: "draft" | "published" | "private"
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          client?: string | null
          created_at?: string
          description?: string | null
          editor_id: string
          id?: string
          is_featured?: boolean
          role?: string | null
          status?: "draft" | "published" | "private"
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          client?: string | null
          created_at?: string
          description?: string | null
          editor_id?: string
          id?: string
          is_featured?: boolean
          role?: string | null
          status?: "draft" | "published" | "private"
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "editor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_media: {
        Row: {
          id: string
          is_cover: boolean
          kind: "image" | "video_embed" | "video_url"
          project_id: string
          sort_order: number
          url: string
        }
        Insert: {
          id?: string
          is_cover?: boolean
          kind: "image" | "video_embed" | "video_url"
          project_id: string
          sort_order?: number
          url: string
        }
        Update: {
          id?: string
          is_cover?: boolean
          kind?: "image" | "video_embed" | "video_url"
          project_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<never, never>
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_editor_owner: {
        Args: {
          editor_id: string
        }
        Returns: boolean
      }
      is_editor_public: {
        Args: {
          editor_id: string
        }
        Returns: boolean
      }
      set_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_new_profile: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
