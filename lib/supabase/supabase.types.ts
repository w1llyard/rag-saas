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
      chatbot_embed_settings: {
        Row: {
          chatbot_id: number
          initial_prompts: Json | null
          updated_at: string | null
          welcome_message: string | null
          widget_color: string | null
        }
        Insert: {
          chatbot_id: number
          initial_prompts?: Json | null
          updated_at?: string | null
          welcome_message?: string | null
          widget_color?: string | null
        }
        Update: {
          chatbot_id?: number
          initial_prompts?: Json | null
          updated_at?: string | null
          welcome_message?: string | null
          widget_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_embed_settings_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: true
            referencedRelation: "chatbots"
            referencedColumns: ["chatbot_id"]
          },
        ]
      }
      chatbots: {
        Row: {
          chatbot_id: number
          created_at: string | null
          description: string | null
          last_document_or_setting_change_at: string | null
          max_tokens: number | null
          model_name: string | null
          name: string,
          queries: number,
          status: Database["public"]["Enums"]["chatbot_status_enum"] | null
          temperature: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chatbot_id?: number
          created_at?: string | null
          description?: string | null
          last_document_or_setting_change_at?: string | null
          max_tokens?: number | null
          model_name?: string | null
          name: string
          status?: Database["public"]["Enums"]["chatbot_status_enum"] | null
          temperature?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chatbot_id?: number
          created_at?: string | null
          description?: string | null
          last_document_or_setting_change_at?: string | null
          max_tokens?: number | null
          model_name?: string | null
          name?: string
          status?: Database["public"]["Enums"]["chatbot_status_enum"] | null
          temperature?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      documents: {
        Row: {
          chatbot_id: number
          created_at: string | null
          document_id: number
          embedding: string | null
          error_message: string | null
          file_name: string
          file_size_bytes: number | null
          file_type: string | null
          page_count: number | null
          processing_status:
            | Database["public"]["Enums"]["document_processing_status_enum"]
            | null
          storage_bucket_id: string | null
          storage_object_path: string
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          chatbot_id: number
          created_at?: string | null
          document_id?: number
          embedding?: string | null
          error_message?: string | null
          file_name: string
          file_size_bytes?: number | null
          file_type?: string | null
          page_count?: number | null
          processing_status?:
            | Database["public"]["Enums"]["document_processing_status_enum"]
            | null
          storage_bucket_id?: string | null
          storage_object_path: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          chatbot_id?: number
          created_at?: string | null
          document_id?: number
          embedding?: string | null
          error_message?: string | null
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string | null
          page_count?: number | null
          processing_status?:
            | Database["public"]["Enums"]["document_processing_status_enum"]
            | null
          storage_bucket_id?: string | null
          storage_object_path?: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["chatbot_id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          current_plan_id: number | null
          email: string | null
          name: string | null
          profile_picture_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_plan_id?: number | null
          email?: string | null
          name?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_plan_id?: number | null
          email?: string | null
          name?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_plan_id_fkey"
            columns: ["current_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          api_key_id: number
          api_key_value_encrypted: string
          created_at: string | null
          is_active: boolean | null
          service_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key_id?: number
          api_key_value_encrypted: string
          created_at?: string | null
          is_active?: boolean | null
          service_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key_id?: number
          api_key_value_encrypted?: string
          created_at?: string | null
          is_active?: boolean | null
          service_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          notifications_enabled: boolean | null
          theme:
            | Database["public"]["Enums"]["user_theme_preference_enum"]
            | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          notifications_enabled?: boolean | null
          theme?:
            | Database["public"]["Enums"]["user_theme_preference_enum"]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          notifications_enabled?: boolean | null
          theme?:
            | Database["public"]["Enums"]["user_theme_preference_enum"]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      chatbot_status_enum: "active" | "inactive"
      document_processing_status_enum:
        | "pending"
        | "processing"
        | "processed"
        | "failed"
      user_theme_preference_enum: "light" | "dark" | "system"
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
    Enums: {
      chatbot_status_enum: ["active", "inactive"],
      document_processing_status_enum: [
        "pending",
        "processing",
        "processed",
        "failed",
      ],
      user_theme_preference_enum: ["light", "dark", "system"],
    },
  },
} as const
