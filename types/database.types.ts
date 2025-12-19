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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      otp_verifications: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          is_used: boolean | null
          otp_code: string
          purpose: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          is_used?: boolean | null
          otp_code: string
          purpose: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean | null
          otp_code?: string
          purpose?: string
          used_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          aadhar_back_url: string | null
          aadhar_card_no: string | null
          aadhar_front_url: string | null
          account_holder_name: string | null
          account_number: string | null
          alternate_contact: string | null
          approval_status: string | null
          area_pincode: string | null
          bank_name: string | null
          bank_passbook_url: string | null
          blood_group: string | null
          branch_city: string | null
          branch_pincode: string | null
          branch_state: string | null
          contact_no: string | null
          created_at: string | null
          date_of_birth: string | null
          date_of_joining: string | null
          email: string
          emergency_contact_no: string | null
          employee_id: string | null
          father_name: string | null
          gender: string | null
          id: string
          ifsc_code: string | null
          in_hand_salary: number | null
          pan_number: string | null
          pancard_url: string | null
          primary_address: string | null
          profile_complete: boolean | null
          profile_pic_url: string | null
          qualification_marksheet_url: string | null
          role: string | null
          status: string | null
          super_admin: boolean
          updated_at: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          aadhar_back_url?: string | null
          aadhar_card_no?: string | null
          aadhar_front_url?: string | null
          account_holder_name?: string | null
          account_number?: string | null
          alternate_contact?: string | null
          approval_status?: string | null
          area_pincode?: string | null
          bank_name?: string | null
          bank_passbook_url?: string | null
          blood_group?: string | null
          branch_city?: string | null
          branch_pincode?: string | null
          branch_state?: string | null
          contact_no?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          date_of_joining?: string | null
          email: string
          emergency_contact_no?: string | null
          employee_id?: string | null
          father_name?: string | null
          gender?: string | null
          id?: string
          ifsc_code?: string | null
          in_hand_salary?: number | null
          pan_number?: string | null
          pancard_url?: string | null
          primary_address?: string | null
          profile_complete?: boolean | null
          profile_pic_url?: string | null
          qualification_marksheet_url?: string | null
          role?: string | null
          status?: string | null
          super_admin?: boolean
          updated_at?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          aadhar_back_url?: string | null
          aadhar_card_no?: string | null
          aadhar_front_url?: string | null
          account_holder_name?: string | null
          account_number?: string | null
          alternate_contact?: string | null
          approval_status?: string | null
          area_pincode?: string | null
          bank_name?: string | null
          bank_passbook_url?: string | null
          blood_group?: string | null
          branch_city?: string | null
          branch_pincode?: string | null
          branch_state?: string | null
          contact_no?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          date_of_joining?: string | null
          email?: string
          emergency_contact_no?: string | null
          employee_id?: string | null
          father_name?: string | null
          gender?: string | null
          id?: string
          ifsc_code?: string | null
          in_hand_salary?: number | null
          pan_number?: string | null
          pancard_url?: string | null
          primary_address?: string | null
          profile_complete?: boolean | null
          profile_pic_url?: string | null
          qualification_marksheet_url?: string | null
          role?: string | null
          status?: string | null
          super_admin?: boolean
          updated_at?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: { Args: { user_uuid: string }; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: { user_uuid: string }; Returns: boolean }
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

