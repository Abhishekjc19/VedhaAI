-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  school_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  topic VARCHAR(255),
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_questions INT DEFAULT 0,
  total_marks INT DEFAULT 0,
  question_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  question_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  difficulty VARCHAR(20),
  marks INT,
  answer TEXT,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Generation Jobs Table (for tracking AI generation tasks)
CREATE TABLE IF NOT EXISTS generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_questions INT,
  generated_questions INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_questions_assignment_id ON questions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_assignment_id ON generation_jobs(assignment_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only view their own data
CREATE POLICY "Users can only view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only view their own assignments
CREATE POLICY "Users can view their own assignments" ON assignments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create assignments
CREATE POLICY "Users can create assignments" ON assignments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own assignments
CREATE POLICY "Users can update their own assignments" ON assignments
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own assignments
CREATE POLICY "Users can delete their own assignments" ON assignments
  FOR DELETE USING (auth.uid() = user_id);

-- Users can view questions for their assignments
CREATE POLICY "Users can view questions for their assignments" ON questions
  FOR SELECT USING (
    assignment_id IN (
      SELECT id FROM assignments WHERE user_id = auth.uid()
    )
  );

-- Users can create questions for their assignments
CREATE POLICY "Users can create questions for their assignments" ON questions
  FOR INSERT WITH CHECK (
    assignment_id IN (
      SELECT id FROM assignments WHERE user_id = auth.uid()
    )
  );

-- Users can view generation jobs for their assignments
CREATE POLICY "Users can view generation jobs for their assignments" ON generation_jobs
  FOR SELECT USING (
    assignment_id IN (
      SELECT id FROM assignments WHERE user_id = auth.uid()
    )
  );

-- Users can create generation jobs for their assignments
CREATE POLICY "Users can create generation jobs for their assignments" ON generation_jobs
  FOR INSERT WITH CHECK (
    assignment_id IN (
      SELECT id FROM assignments WHERE user_id = auth.uid()
    )
  );
