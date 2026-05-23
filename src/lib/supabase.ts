import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://caxomohhsrimxnhpqiqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNheG9tb2hoc3JpbXhuaHBxaXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjY5ODUsImV4cCI6MjA2NDQ0Mjk4NX0.c-g5C0hDFK1WraAlWHau8JJZZDPtPudSvA8WmAE-jzI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.39.7',
    },
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          image_url: string;
          link_url: string;
          tags: string[];
          favorite: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          image_url: string;
          link_url: string;
          tags: string[];
          favorite?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          image_url?: string;
          link_url?: string;
          tags?: string[];
          favorite?: boolean;
          created_at?: string;
        };
      };
      ai_metadata: {
        Row: {
          card_id: string;
          ai_description: string;
          ai_tags: string[];
          ai_score: number;
        };
        Insert: {
          card_id: string;
          ai_description: string;
          ai_tags: string[];
          ai_score: number;
        };
        Update: {
          card_id?: string;
          ai_description?: string;
          ai_tags?: string[];
          ai_score?: number;
        };
      };
    };
  };
};