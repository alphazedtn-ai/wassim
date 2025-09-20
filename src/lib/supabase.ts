import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development or if env vars are missing
const isDevelopment = import.meta.env.DEV;
const hasSupabaseConfig = supabaseUrl && supabaseAnonKey;

if (!hasSupabaseConfig && !isDevelopment) {
  console.warn('Supabase environment variables not found. Database features will be limited.');
}

// Create client with fallback values for build process
export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Export configuration status
export const isSupabaseConfigured = hasSupabaseConfig;

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