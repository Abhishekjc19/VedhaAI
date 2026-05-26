import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          topic: string;
          description: string | null;
          due_date: string | null;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          total_questions: number;
          total_marks: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assignments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assignments']['Insert']>;
      };
      questions: {
        Row: {
          id: string;
          assignment_id: string;
          question_type: string;
          content: string;
          difficulty: string | null;
          marks: number;
          answer: string | null;
          explanation: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          school_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
  };
};
