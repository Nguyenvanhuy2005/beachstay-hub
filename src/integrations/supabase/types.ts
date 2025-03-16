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
      room_types: {
        Row: {
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
        Args: {
          email_param: string
        }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
