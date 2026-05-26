export interface Assignment {
  id: string;
  title: string;
  topic: string;
  description?: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  questionsGenerated?: boolean;
  questionPaperId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  section: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
  type: string;
}

export interface QuestionSection {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface QuestionPaper {
  id: string;
  assignmentId: string;
  sections: QuestionSection[];
  totalMarks: number;
  generatedAt: string;
}

export interface GenerationProgress {
  stage: string;
  percentage: number;
  message: string;
}
