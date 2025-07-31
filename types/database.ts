export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          updated_at?: string;
        };
      };
      course_orders: {
        Row: {
          id: string;
          user_id: string;
          course_name: string;
          amount: number;
          payment_method: 'baridimob' | 'ccp';
          status: 'pending' | 'paid' | 'verified' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_name: string;
          amount: number;
          payment_method: 'baridimob' | 'ccp';
          status?: 'pending' | 'paid' | 'verified' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_name?: string;
          amount?: number;
          payment_method?: 'baridimob' | 'ccp';
          status?: 'pending' | 'paid' | 'verified' | 'cancelled';
          updated_at?: string;
        };
      };
      payment_receipts: {
        Row: {
          id: string;
          order_id: string;
          transaction_number: string;
          amount: string;
          receipt_url: string;
          notes: string | null;
          verified: boolean;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          transaction_number: string;
          amount: string;
          receipt_url: string;
          notes?: string | null;
          verified?: boolean;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          transaction_number?: string;
          amount?: string;
          receipt_url?: string;
          notes?: string | null;
          verified?: boolean;
          verified_at?: string | null;
          verified_by?: string | null;
          updated_at?: string;
        };
      };
      course_access: {
        Row: {
          id: string;
          user_id: string;
          order_id: string;
          course_name: string;
          google_drive_link: string;
          granted_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_id: string;
          course_name: string;
          google_drive_link: string;
          granted_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_id?: string;
          course_name?: string;
          google_drive_link?: string;
          granted_at?: string;
          expires_at?: string | null;
        };
      };
      workshop_reservations: {
        Row: {
          id: string;
          user_id: string;
          workshop_id: string | null;
          workshop_name: string;
          first_name: string;
          last_name: string;
          phone: string;
          email: string;
          preferred_date: string | null;
          location: 'shop' | 'elsewhere';
          custom_address: string | null;
          participants: number;
          age_group: 'adults' | 'children' | 'mixed';
          additional_info: string | null;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workshop_id?: string | null;
          workshop_name: string;
          first_name: string;
          last_name: string;
          phone: string;
          email: string;
          preferred_date?: string | null;
          location: 'shop' | 'elsewhere';
          custom_address?: string | null;
          participants: number;
          age_group: 'adults' | 'children' | 'mixed';
          additional_info?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workshop_id?: string | null;
          workshop_name?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          email?: string;
          preferred_date?: string | null;
          location?: 'shop' | 'elsewhere';
          custom_address?: string | null;
          participants?: number;
          age_group?: 'adults' | 'children' | 'mixed';
          additional_info?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          updated_at?: string;
        };
      };
      custom_cake_orders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          email: string;
          event_date: string;
          servings: number;
          cake_type: string;
          flavor: string;
          customization: string | null;
          special_instructions: string | null;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          pickup_delivery: string | null;
          delivery_address: string | null;
          delivery_time: string | null;
          pickup_time: string | null;
          size: string | null;
          shape: string | null;
          need_candles: boolean | null;
          inspiration_image_url: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          email: string;
          event_date: string;
          servings?: number;
          cake_type: string;
          flavor: string;
          customization?: string | null;
          special_instructions?: string | null;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          pickup_delivery?: string | null;
          delivery_address?: string | null;
          delivery_time?: string | null;
          pickup_time?: string | null;
          size?: string | null;
          shape?: string | null;
          need_candles?: boolean | null;
          inspiration_image_url?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          email?: string;
          event_date?: string;
          servings?: number;
          cake_type?: string;
          flavor?: string;
          customization?: string | null;
          special_instructions?: string | null;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          pickup_delivery?: string | null;
          delivery_address?: string | null;
          delivery_time?: string | null;
          pickup_time?: string | null;
          size?: string | null;
          shape?: string | null;
          need_candles?: boolean | null;
          inspiration_image_url?: string | null;
          cancellation_reason?: string | null;
          updated_at?: string;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: 'cakes' | 'workshops' | 'behind-scenes';
          featured: boolean;
          display_order: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          category: 'cakes' | 'workshops' | 'behind-scenes';
          featured?: boolean;
          display_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          category?: 'cakes' | 'workshops' | 'behind-scenes';
          featured?: boolean;
          display_order?: number;
          created_by?: string | null;
          updated_at?: string;
        };
      };
      workshop_schedules: {
        Row: {
          id: string;
          workshop_name: string;
          workshop_type: 'pinterest' | 'decorating' | 'complete';
          description: string | null;
          date: string;
          start_time: string;
          end_time: string;
          max_participants: number;
          current_participants: number;
          price: number;
          discount_price: number | null;
          status: 'active' | 'cancelled' | 'completed';
          location: string;
          notes: string | null;
          image_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workshop_name: string;
          workshop_type: 'pinterest' | 'decorating' | 'complete';
          description?: string | null;
          date: string;
          start_time: string;
          end_time: string;
          max_participants?: number;
          current_participants?: number;
          price: number;
          discount_price?: number | null;
          status?: 'active' | 'cancelled' | 'completed';
          location?: string;
          notes?: string | null;
          image_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workshop_name?: string;
          workshop_type?: 'pinterest' | 'decorating' | 'complete';
          description?: string | null;
          date?: string;
          start_time?: string;
          end_time?: string;
          max_participants?: number;
          current_participants?: number;
          price?: number;
          discount_price?: number | null;
          status?: 'active' | 'cancelled' | 'completed';
          location?: string;
          notes?: string | null;
          image_url?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
      };
      online_courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          discount_price: number | null;
          duration_hours: number | null;
          module_count: number | null;
          image_url: string | null;
          google_drive_link: string | null;
          status: 'active' | 'inactive' | 'draft';
          features: any;
          modules: any;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          discount_price?: number | null;
          duration_hours?: number | null;
          module_count?: number | null;
          image_url?: string | null;
          google_drive_link?: string | null;
          status?: 'active' | 'inactive' | 'draft';
          features?: any;
          modules?: any;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          discount_price?: number | null;
          duration_hours?: number | null;
          module_count?: number | null;
          image_url?: string | null;
          google_drive_link?: string | null;
          status?: 'active' | 'inactive' | 'draft';
          features?: any;
          modules?: any;
          created_by?: string | null;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'super_admin';
          permissions: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: 'admin' | 'super_admin';
          permissions?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'super_admin';
          permissions?: any;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          status: 'unread' | 'read' | 'replied';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          status?: 'unread' | 'read' | 'replied';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          status?: 'unread' | 'read' | 'replied';
          admin_notes?: string | null;
          updated_at?: string;
        };
      };
      system_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: boolean;
          description: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value?: boolean;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: boolean;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      unavailable_dates: {
        Row: {
          id: string;
          date: string;
          reason: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          reason?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          reason?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_unavailable_dates: {
        Args: Record<string, never>;
        Returns: {
          date: string;
          reason: string;
          type: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}