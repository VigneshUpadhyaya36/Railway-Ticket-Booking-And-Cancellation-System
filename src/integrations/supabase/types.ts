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
      admin: {
        Row: {
          admin_id: string
          created_at: string
          password: string
          username: string
        }
        Insert: {
          admin_id?: string
          created_at?: string
          password: string
          username: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          password?: string
          username?: string
        }
        Relationships: []
      }
      booking: {
        Row: {
          booking_date: string
          booking_status: string
          class: string
          created_at: string
          fare_id: string
          passenger_id: string
          payment_status: string
          pnr: string
          seat_no: string
          train_id: string
        }
        Insert: {
          booking_date?: string
          booking_status?: string
          class: string
          created_at?: string
          fare_id: string
          passenger_id: string
          payment_status?: string
          pnr?: string
          seat_no: string
          train_id: string
        }
        Update: {
          booking_date?: string
          booking_status?: string
          class?: string
          created_at?: string
          fare_id?: string
          passenger_id?: string
          payment_status?: string
          pnr?: string
          seat_no?: string
          train_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_fare_id_fkey"
            columns: ["fare_id"]
            isOneToOne: false
            referencedRelation: "fare"
            referencedColumns: ["fare_id"]
          },
          {
            foreignKeyName: "booking_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "passenger"
            referencedColumns: ["passenger_id"]
          },
          {
            foreignKeyName: "booking_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "train"
            referencedColumns: ["train_id"]
          },
        ]
      }
      cancellation: {
        Row: {
          cancel_id: string
          cancellation_date: string
          created_at: string
          pnr: string
          refund_amount: number
          status: string
        }
        Insert: {
          cancel_id?: string
          cancellation_date?: string
          created_at?: string
          pnr: string
          refund_amount: number
          status?: string
        }
        Update: {
          cancel_id?: string
          cancellation_date?: string
          created_at?: string
          pnr?: string
          refund_amount?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cancellation_pnr_fkey"
            columns: ["pnr"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["pnr"]
          },
        ]
      }
      fare: {
        Row: {
          class: string
          created_at: string
          fare_amount: number
          fare_id: string
          train_id: string
        }
        Insert: {
          class: string
          created_at?: string
          fare_amount: number
          fare_id?: string
          train_id: string
        }
        Update: {
          class?: string
          created_at?: string
          fare_amount?: number
          fare_id?: string
          train_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fare_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "train"
            referencedColumns: ["train_id"]
          },
        ]
      }
      passenger: {
        Row: {
          age: number
          contact: string
          created_at: string
          gender: string
          name: string
          passenger_id: string
        }
        Insert: {
          age: number
          contact: string
          created_at?: string
          gender: string
          name: string
          passenger_id?: string
        }
        Update: {
          age?: number
          contact?: string
          created_at?: string
          gender?: string
          name?: string
          passenger_id?: string
        }
        Relationships: []
      }
      payment: {
        Row: {
          amount: number
          created_at: string
          payment_date: string
          payment_id: string
          payment_method: string
          pnr: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          payment_date?: string
          payment_id?: string
          payment_method: string
          pnr: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          payment_date?: string
          payment_id?: string
          payment_method?: string
          pnr?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_pnr_fkey"
            columns: ["pnr"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["pnr"]
          },
        ]
      }
      train: {
        Row: {
          arrival_time: string
          available_seats: number
          created_at: string
          departure_time: string
          destination: string
          schedule: string
          source: string
          total_seats: number
          train_id: string
          train_name: string
          train_number: string
        }
        Insert: {
          arrival_time: string
          available_seats: number
          created_at?: string
          departure_time: string
          destination: string
          schedule: string
          source: string
          total_seats: number
          train_id?: string
          train_name: string
          train_number: string
        }
        Update: {
          arrival_time?: string
          available_seats?: number
          created_at?: string
          departure_time?: string
          destination?: string
          schedule?: string
          source?: string
          total_seats?: number
          train_id?: string
          train_name?: string
          train_number?: string
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
