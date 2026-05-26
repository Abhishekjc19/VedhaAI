-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  school_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, school_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'school_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create assignments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  question_types TEXT[] DEFAULT '{}',
  number_of_questions INTEGER DEFAULT 0,
  total_marks INTEGER DEFAULT 0,
  additional_instructions TEXT,
  questions_generated BOOLEAN DEFAULT FALSE,
  question_paper_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Assignments policies
CREATE POLICY "Users can read own assignments" ON public.assignments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assignments" ON public.assignments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assignments" ON public.assignments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assignments" ON public.assignments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  question_type TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty TEXT,
  marks INTEGER DEFAULT 0,
  answer TEXT,
  explanation TEXT,
  section TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Questions policies (users can access questions for their assignments)
CREATE POLICY "Users can read questions for own assignments" ON public.questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.id = questions.assignment_id
      AND assignments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions for own assignments" ON public.questions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.id = questions.assignment_id
      AND assignments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions for own assignments" ON public.questions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.id = questions.assignment_id
      AND assignments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions for own assignments" ON public.questions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.id = questions.assignment_id
      AND assignments.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
