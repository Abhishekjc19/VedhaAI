import { v4 as uuidv4 } from 'uuid';
import { getDatabase, getRedisClient } from '../config/database';
import { Assignment, QuestionPaper } from '../models/types';
import { logger } from '../utils/logger';

export class AssignmentService {
  async createAssignment(data: Partial<Assignment>): Promise<Assignment> {
    const db = getDatabase();
    const assignment: Assignment = {
      id: uuidv4(),
      title: data.title || 'Untitled Assignment',
      topic: data.topic || '',
      description: data.description,
      dueDate: data.dueDate || new Date(),
      questionTypes: data.questionTypes || [],
      numberOfQuestions: data.numberOfQuestions || 10,
      totalMarks: data.totalMarks || 50,
      additionalInstructions: data.additionalInstructions || '',
      filePath: data.filePath,
      fileContent: data.fileContent,
      status: 'draft',
      questionsGenerated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('assignments').insertOne(assignment);
    return { ...assignment, _id: result.insertedId };
  }

  async getAssignment(id: string): Promise<Assignment | null> {
    const db = getDatabase();
    return db.collection('assignments').findOne({ id });
  }

  async updateAssignmentStatus(id: string, status: string): Promise<void> {
    const db = getDatabase();
    await db.collection('assignments').updateOne(
      { id },
      { 
        $set: { 
          status,
          updatedAt: new Date(),
        },
      }
    );
  }

  async saveQuestionPaper(paper: QuestionPaper): Promise<void> {
    const db = getDatabase();
    
    // Save question paper
    await db.collection('question_papers').insertOne({
      ...paper,
      createdAt: new Date(),
    });

    // Update assignment with question paper ID and mark as completed
    await db.collection('assignments').updateOne(
      { id: paper.assignmentId },
      {
        $set: {
          questionPaperId: paper.id,
          questionsGenerated: true,
          status: 'completed',
          updatedAt: new Date(),
        },
      }
    );
  }

  async getQuestionPaper(id: string): Promise<QuestionPaper | null> {
    const db = getDatabase();
    return db.collection('question_papers').findOne({ id });
  }

  async listAssignments(limit: number = 10, skip: number = 0): Promise<Assignment[]> {
    const db = getDatabase();
    return db
      .collection('assignments')
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  async deleteAssignment(id: string): Promise<void> {
    const db = getDatabase();
    await db.collection('assignments').deleteOne({ id });
    // Also delete associated question papers
    await db.collection('question_papers').deleteMany({ assignmentId: id });
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
