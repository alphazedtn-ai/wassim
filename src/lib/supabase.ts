import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set up your Supabase project.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Database {
  public: {
    Tables: {
      iptv_offers: {
        Row: {
          id: string;
          name: string;
          price: string;
          description: string;
          image_url: string;
          download_url: string;
          app_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price?: string;
          description?: string;
          image_url?: string;
          download_url: string;
          app_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: string;
          description?: string;
          image_url?: string;
          download_url?: string;
          app_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_settings: {
        Row: {
          id: string;
          service_name: string;
          available_apps: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_name: string;
          available_apps: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_name?: string;
          available_apps?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      android_boxes: {
        Row: {
          id: string;
          name: string;
          price: string;
          description: string;
          image_url: string;
          purchase_url: string;
          specifications: string;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: string;
          description?: string;
          image_url?: string;
          purchase_url: string;
          specifications?: string;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: string;
          description?: string;
          image_url?: string;
          purchase_url?: string;
          specifications?: string;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}