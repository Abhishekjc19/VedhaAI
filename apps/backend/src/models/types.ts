import { ObjectId } from 'mongodb';

export interface Assignment {
  _id?: ObjectId;
  id: string;
  title: string;
  topic: string;
  description?: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions: string;
  filePath?: string;
  fileContent?: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  questionsGenerated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  questionPaperId?: string;
}

export interface QuestionPaper {
  _id?: ObjectId;
  id: string;
  assignmentId: string;
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
  generatedAt: Date;
}
