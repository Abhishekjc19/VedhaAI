import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
};

// For server-side usage (if needed)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
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
      };
    };
  };
};
