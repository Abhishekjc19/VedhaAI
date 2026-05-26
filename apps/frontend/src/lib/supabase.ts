// Supabase type definitions for the database schema
// Note: Actual Supabase client is not used in this app as we use axios for API calls

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

