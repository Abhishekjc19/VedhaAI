import axios from 'axios';
import { Assignment, QuestionPaper } from '../types/index';
import { createClient } from '@supabase/supabase-js';

// Use relative URL for API routes in the same Next.js app
const API_BASE_URL = '/api';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const assignmentAPI = {
  async createAssignment(data: Partial<Assignment>): Promise<Assignment> {
    const response = await apiClient.post('/assignments', data);
    return response.data;
  },

  async getAssignment(id: string): Promise<Assignment> {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  },

  async listAssignments(page = 1, limit = 10): Promise<{ data: Assignment[] }> {
    const response = await apiClient.get('/assignments', {
      params: { page, limit },
    });
    return response.data;
  },

  async deleteAssignment(id: string): Promise<void> {
    await apiClient.delete(`/assignments/${id}`);
  },

  async generateQuestions(
    assignmentId: string,
    difficulty: string = 'mixed'
  ): Promise<{ jobId: string; status: string }> {
    const response = await apiClient.post(`/assignments/${assignmentId}/generate`, {
      difficulty,
    });
    return response.data;
  },

  async getQuestionPaper(paperId: string): Promise<QuestionPaper> {
    const response = await apiClient.get(`/question-papers/${paperId}`);
    return response.data;
  },
};
