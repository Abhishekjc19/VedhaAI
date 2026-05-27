import { v4 as uuidv4 } from 'uuid';
import { getSupabase, getRedisClient } from '../config/database';
import { Assignment, QuestionPaper } from '../models/types';
import { logger } from '../utils/logger';

export class AssignmentService {
  async createAssignment(data: Partial<Assignment>, userId: string): Promise<Assignment> {
    const supabase = getSupabase();
    const assignment = {
      id: uuidv4(),
      user_id: userId,
      title: data.title || 'Untitled Assignment',
      topic: data.topic || '',
      description: data.description,
      due_date: data.dueDate,
      question_types: data.questionTypes || [],
      number_of_questions: data.numberOfQuestions || 10,
      total_marks: data.totalMarks || 50,
      additional_instructions: data.additionalInstructions || '',
      status: 'draft',
      questions_generated: false,
    };

    const { data: result, error } = await supabase
      .from('assignments')
      .insert(assignment)
      .select()
      .single();

    if (error) throw error;
    return result as Assignment;
  }

  async getAssignment(id: string): Promise<Assignment | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Assignment;
  }

  async updateAssignmentStatus(id: string, status: string): Promise<void> {
    const supabase = getSupabase();
    await supabase
      .from('assignments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
  }

  async saveQuestionPaper(paper: QuestionPaper): Promise<void> {
    const supabase = getSupabase();
    
    // Save question paper
    await supabase.from('question_papers').insert({
      ...paper,
      created_at: new Date().toISOString(),
    });

    // Update assignment
    await supabase
      .from('assignments')
      .update({
        question_paper_id: paper.id,
        questions_generated: true,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', paper.assignmentId);
  }

  async getQuestionPaper(id: string): Promise<QuestionPaper | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('question_papers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as QuestionPaper;
  }

  async listAssignments(userId: string, limit: number = 10, skip: number = 0): Promise<Assignment[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) return [];
    return data as Assignment[];
  }

  async deleteAssignment(id: string): Promise<void> {
    const supabase = getSupabase();
    await supabase.from('assignments').delete().eq('id', id);
    await supabase.from('question_papers').delete().eq('assignment_id', id);
  }
}

export class CacheService {
  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    const redis = getRedisClient();
    await redis.setEx(key, ttl, value);
  }

  async get(key: string): Promise<string | null> {
    const redis = getRedisClient();
    return redis.get(key);
  }

  async delete(key: string): Promise<void> {
    const redis = getRedisClient();
    await redis.del(key);
  }
}

export const assignmentService = new AssignmentService();
export const cacheService = new CacheService();
