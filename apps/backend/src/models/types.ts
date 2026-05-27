export interface Assignment {
  id: string;
  user_id?: string;
  title: string;
  topic: string;
  description?: string;
  dueDate?: Date | string;
  due_date?: string;
  questionTypes?: string[];
  question_types?: string[];
  numberOfQuestions?: number;
  number_of_questions?: number;
  totalMarks?: number;
  total_marks?: number;
  additionalInstructions?: string;
  additional_instructions?: string;
  filePath?: string;
  fileContent?: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  questionsGenerated?: boolean;
  questions_generated?: boolean;
  createdAt?: Date;
  created_at?: string;
  updatedAt?: Date;
  updated_at?: string;
  questionPaperId?: string;
  question_paper_id?: string;
}

export interface QuestionPaper {
  id: string;
  assignmentId: string;
  assignment_id?: string;
  sections: {
    title: string;
    instruction: string;
    questions: {
      id: string;
      text: string;
      difficulty: 'Easy' | 'Moderate' | 'Hard';
      marks: number;
      type: string;
    }[];
  }[];
  totalMarks: number;
  total_marks?: number;
  generatedAt?: Date;
  generated_at?: string;
  created_at?: string;
}

