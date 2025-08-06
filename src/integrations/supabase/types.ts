export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_access: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      amenities: {
        Row: {
          created_at: string | null
          description: string
          description_en: string
          icon: string
          id: string
          name: string
          name_en: string
        }
        Insert: {
          created_at?: string | null
          description: string
          description_en: string
          icon: string
          id?: string
          name: string
          name_en: string
        }
        Update: {
          created_at?: string | null
          description?: string
          description_en?: string
          icon?: string
          id?: string
          name?: string
          name_en?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          canonical_url: string | null
          content: string
          content_en: string
          created_at: string | null
          excerpt: string | null
          excerpt_en: string | null
          featured_image: string | null
          focus_keyword: string | null
          focus_keyword_en: string | null
          id: string
          meta_description: string | null
          meta_description_en: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          meta_title_en: string | null
          published: boolean | null
          published_at: string | null
          seo_score: number | null
          slug: string
          structured_data: Json | null
          tags: Json | null
          title: string
          title_en: string
          updated_at: string | null
        }
        Insert: {
          author: string
          canonical_url?: string | null
          content: string
          content_en: string
          created_at?: string | null
          excerpt?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          focus_keyword?: string | null
          focus_keyword_en?: string | null
          id?: string
          meta_description?: string | null
          meta_description_en?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          meta_title_en?: string | null
          published?: boolean | null
          published_at?: string | null
          seo_score?: number | null
          slug: string
          structured_data?: Json | null
          tags?: Json | null
          title: string
          title_en: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          canonical_url?: string | null
          content?: string
          content_en?: string
          created_at?: string | null
          excerpt?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          focus_keyword?: string | null
          focus_keyword_en?: string | null
          id?: string
          meta_description?: string | null
          meta_description_en?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          meta_title_en?: string | null
          published?: boolean | null
          published_at?: string | null
          seo_score?: number | null
          slug?: string
          structured_data?: Json | null
          tags?: Json | null
          title?: string
          title_en?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          adults: number
          check_in: string
          check_out: string
          children: number
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string
          room_type_id: string | null
          special_requests: string | null
          status: string | null
        }
        Insert: {
          adults?: number
          check_in: string
          check_out: string
          children?: number
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone: string
          room_type_id?: string | null
          special_requests?: string | null
          status?: string | null
        }
        Update: {
          adults?: number
          check_in?: string
          check_out?: string
          children?: number
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          room_type_id?: string | null
          special_requests?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_requests: {
        Row: {
          consultation_type: string
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string
          preferred_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          consultation_type: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone: string
          preferred_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          consultation_type?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          preferred_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt: string
          category: string
          created_at: string | null
          id: string
          src: string
          updated_at: string | null
        }
        Insert: {
          alt: string
          category: string
          created_at?: string | null
          id?: string
          src: string
          updated_at?: string | null
        }
        Update: {
          alt?: string
          category?: string
          created_at?: string | null
          id?: string
          src?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      holiday_prices: {
        Row: {
          created_at: string | null
          day: number
          holiday_name: string
          holiday_name_en: string
          holiday_type: string
          id: string
          is_active: boolean | null
          month: number
          multiplier: number | null
          price: number
          room_type_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day: number
          holiday_name: string
          holiday_name_en: string
          holiday_type: string
          id?: string
          is_active?: boolean | null
          month: number
          multiplier?: number | null
          price: number
          room_type_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day?: number
          holiday_name?: string
          holiday_name_en?: string
          holiday_type?: string
          id?: string
          is_active?: boolean | null
          month?: number
          multiplier?: number | null
          price?: number
          room_type_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "holiday_prices_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_date_prices: {
        Row: {
          created_at: string | null
          date: string
          id: string
          price: number
          room_type_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          price: number
          room_type_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          price?: number
          room_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_date_prices_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          address: string | null
          address_en: string | null
          amenities: Json
          capacity: string
          capacity_en: string
          created_at: string | null
          description: string
          description_en: string
          gallery_images: Json | null
          id: string
          image_url: string
          is_popular: boolean | null
          name: string
          name_en: string
          price: number
          short_description: string | null
          short_description_en: string | null
          weekend_price: number | null
        }
        Insert: {
          address?: string | null
          address_en?: string | null
          amenities: Json
          capacity: string
          capacity_en: string
          created_at?: string | null
          description: string
          description_en: string
          gallery_images?: Json | null
          id?: string
          image_url: string
          is_popular?: boolean | null
          name: string
          name_en: string
          price: number
          short_description?: string | null
          short_description_en?: string | null
          weekend_price?: number | null
        }
        Update: {
          address?: string | null
          address_en?: string | null
          amenities?: Json
          capacity?: string
          capacity_en?: string
          created_at?: string | null
          description?: string
          description_en?: string
          gallery_images?: Json | null
          id?: string
          image_url?: string
          is_popular?: boolean | null
          name?: string
          name_en?: string
          price?: number
          short_description?: string | null
          short_description_en?: string | null
          weekend_price?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_room_availability: {
        Args: {
          p_room_type_id: string
          p_check_in: string
          p_check_out: string
        }
        Returns: {
          available: boolean
          remaining_rooms: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
