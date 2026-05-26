import axios from 'axios';
import { Assignment, QuestionPaper } from '../types/index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
