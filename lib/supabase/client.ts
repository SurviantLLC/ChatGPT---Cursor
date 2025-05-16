import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-for-dev.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-development-only';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add console warnings for missing environment variables in development
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

export type Database = {
  public: {
    Tables: {
      ideas: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_path: string | null;
          tags: string[];
          author_id: string;
          created_at: string;
        };
        Insert: {
          title: string;
          description: string;
          image_path?: string | null;
          tags: string[];
          author_id: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          image_path?: string | null;
          tags?: string[];
          author_id?: string;
          created_at?: string;
        };
      };
      interactions: {
        Row: {
          id: string;
          user_id: string;
          idea_id: string;
          swipe: boolean;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          idea_id: string;
          swipe: boolean;
          rating?: number | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          idea_id?: string;
          swipe?: boolean;
          rating?: number | null;
          created_at?: string;
        };
      };
    };
  };
};
