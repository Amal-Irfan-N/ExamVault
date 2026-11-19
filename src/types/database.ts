export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          default_reminder_days: number[];
          theme: string;
          auto_lock_minutes: number;
          push_notifications_enabled: boolean;
          email_notifications_enabled: boolean;
          cloud_sync_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          default_reminder_days?: number[];
          theme?: string;
          auto_lock_minutes?: number;
          push_notifications_enabled?: boolean;
          email_notifications_enabled?: boolean;
          cloud_sync_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          default_reminder_days?: number[];
          theme?: string;
          auto_lock_minutes?: number;
          push_notifications_enabled?: boolean;
          email_notifications_enabled?: boolean;
          cloud_sync_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      examinations: {
        Row: {
          id: string;
          user_id: string;
          exam_name: string;
          recruiting_org: string;
          category: string;
          post_name: string;
          advertisement_number: string | null;
          recruitment_year: number;
          official_notification_url: string | null;
          official_application_url: string | null;
          official_website_url: string | null;
          personal_notes: string | null;
          status: string;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_name: string;
          recruiting_org: string;
          category: string;
          post_name: string;
          advertisement_number?: string | null;
          recruitment_year?: number;
          official_notification_url?: string | null;
          official_application_url?: string | null;
          official_website_url?: string | null;
          personal_notes?: string | null;
          status?: string;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_name?: string;
          recruiting_org?: string;
          category?: string;
          post_name?: string;
          advertisement_number?: string | null;
          recruitment_year?: number;
          official_notification_url?: string | null;
          official_application_url?: string | null;
          official_website_url?: string | null;
          personal_notes?: string | null;
          status?: string;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      examination_dates: {
        Row: {
          id: string;
          exam_id: string;
          user_id: string;
          event_type: string;
          date_value: string | null;
          certainty: string;
          session_info: string | null;
          city: string | null;
          centre: string | null;
          download_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          user_id: string;
          event_type: string;
          date_value?: string | null;
          certainty?: string;
          session_info?: string | null;
          city?: string | null;
          centre?: string | null;
          download_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          user_id?: string;
          event_type?: string;
          date_value?: string | null;
          certainty?: string;
          session_info?: string | null;
          city?: string | null;
          centre?: string | null;
          download_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          exam_id: string;
          user_id: string;
          application_number: string | null;
          registration_number: string | null;
          submission_date: string | null;
          application_status: string;
          payment_status: string;
          application_fee: number;
          payment_transaction_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          user_id: string;
          application_number?: string | null;
          registration_number?: string | null;
          submission_date?: string | null;
          application_status?: string;
          payment_status?: string;
          application_fee?: number;
          payment_transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          user_id?: string;
          application_number?: string | null;
          registration_number?: string | null;
          submission_date?: string | null;
          application_status?: string;
          payment_status?: string;
          application_fee?: number;
          payment_transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      credentials: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string | null;
          organization: string;
          portal_name: string;
          portal_url: string;
          username: string;
          encrypted_password: string;
          iv: string;
          salt: string;
          registration_number: string | null;
          application_number: string | null;
          registered_email: string | null;
          registered_mobile: string | null;
          encrypted_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id?: string | null;
          organization: string;
          portal_name: string;
          portal_url: string;
          username: string;
          encrypted_password: string;
          iv: string;
          salt: string;
          registration_number?: string | null;
          application_number?: string | null;
          registered_email?: string | null;
          registered_mobile?: string | null;
          encrypted_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string | null;
          organization?: string;
          portal_name?: string;
          portal_url?: string;
          username?: string;
          encrypted_password?: string;
          iv?: string;
          salt?: string;
          registration_number?: string | null;
          application_number?: string | null;
          registered_email?: string | null;
          registered_mobile?: string | null;
          encrypted_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          exam_id: string;
          user_id: string;
          category: string;
          document_name: string;
          storage_path: string;
          file_size_bytes: number;
          mime_type: string;
          file_extension: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          user_id: string;
          category: string;
          document_name: string;
          storage_path: string;
          file_size_bytes?: number;
          mime_type: string;
          file_extension: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          user_id?: string;
          category?: string;
          document_name?: string;
          storage_path?: string;
          file_size_bytes?: number;
          mime_type?: string;
          file_extension?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string | null;
          title: string;
          message: string;
          category: string;
          is_read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id?: string | null;
          title: string;
          message: string;
          category: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string | null;
          title?: string;
          message?: string;
          category?: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          date_id: string | null;
          reminder_date: string;
          days_before: number;
          channel: string;
          is_triggered: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_id: string;
          date_id?: string | null;
          reminder_date: string;
          days_before: number;
          channel?: string;
          is_triggered?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_id?: string;
          date_id?: string | null;
          reminder_date?: string;
          days_before?: number;
          channel?: string;
          is_triggered?: boolean;
          created_at?: string;
        };
      };
      exam_sources: {
        Row: {
          id: string;
          org_name: string;
          category: string;
          official_url: string;
          notification_feed_url: string | null;
          check_frequency_minutes: number;
          is_active: boolean;
          last_checked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_name: string;
          category: string;
          official_url: string;
          notification_feed_url?: string | null;
          check_frequency_minutes?: number;
          is_active?: boolean;
          last_checked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_name?: string;
          category?: string;
          official_url?: string;
          notification_feed_url?: string | null;
          check_frequency_minutes?: number;
          is_active?: boolean;
          last_checked_at?: string | null;
          created_at?: string;
        };
      };
      monitoring_logs: {
        Row: {
          id: string;
          source_id: string | null;
          exam_id: string | null;
          detected_change_type: string;
          previous_value: string | null;
          updated_value: string | null;
          verification_status: string;
          checked_at: string;
        };
        Insert: {
          id?: string;
          source_id?: string | null;
          exam_id?: string | null;
          detected_change_type: string;
          previous_value?: string | null;
          updated_value?: string | null;
          verification_status?: string;
          checked_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string | null;
          exam_id?: string | null;
          detected_change_type?: string;
          previous_value?: string | null;
          updated_value?: string | null;
          verification_status?: string;
          checked_at?: string;
        };
      };
      examination_results: {
        Row: {
          id: string;
          exam_id: string;
          user_id: string;
          exam_score: number | null;
          total_marks: number | null;
          percentile: number | null;
          all_india_rank: number | null;
          category_rank: number | null;
          cutoff_marks: number | null;
          selection_status: string;
          scorecard_document_id: string | null;
          declared_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          user_id: string;
          exam_score?: number | null;
          total_marks?: number | null;
          percentile?: number | null;
          all_india_rank?: number | null;
          category_rank?: number | null;
          cutoff_marks?: number | null;
          selection_status?: string;
          scorecard_document_id?: string | null;
          declared_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          user_id?: string;
          exam_score?: number | null;
          total_marks?: number | null;
          percentile?: number | null;
          all_india_rank?: number | null;
          category_rank?: number | null;
          cutoff_marks?: number | null;
          selection_status?: string;
          scorecard_document_id?: string | null;
          declared_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
