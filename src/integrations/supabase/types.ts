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
      admin_users: {
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
          weekend_price?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_is_admin: {
        Args: { email_param: string }
        Returns: boolean
      }
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
