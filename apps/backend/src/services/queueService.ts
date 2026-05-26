import { Queue, Worker } from 'bullmq';
import { getRedisClient } from '../config/database';
import { generateQuestionsUsingAI, QuestionGenerationRequest, GeneratedQuestionPaper } from '../utils/aiService';
import { assignmentService } from './assignmentService';
import { logger } from '../utils/logger';

interface GenerationJobData {
  assignmentId: string;
  topic: string;
  numberOfQuestions: number;
  questionTypes: string[];
  totalMarks: number;
  difficulty: 'mixed' | 'easy' | 'medium' | 'hard';
  additionalInstructions: string;
  fileContent?: string;
}

let questionGenerationQueue: Queue<GenerationJobData>;

export function initializeQueues() {
  const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  };

  questionGenerationQueue = new Queue('question-generation', {
    connection: redisOptions,
  });

  // Register worker
  new Worker('question-generation', async (job) => {
    logger.info(`Processing job ${job.id} for assignment ${job.data.assignmentId}`);
    
    try {
      await assignmentService.updateAssignmentStatus(job.data.assignmentId, 'processing');

      const generationRequest: QuestionGenerationRequest = {
        topic: job.data.topic,
        numberOfQuestions: job.data.numberOfQuestions,
        questionTypes: job.data.questionTypes,
        totalMarks: job.data.totalMarks,
        difficulty: job.data.difficulty,
        additionalInstructions: job.data.additionalInstructions,
        fileContent: job.data.fileContent,
      };

      const generatedPaper = await generateQuestionsUsingAI(generationRequest);

      // Save to database
      await assignmentService.saveQuestionPaper({
        id: generatedPaper.id,
        assignmentId: job.data.assignmentId,
        sections: generatedPaper.sections,
        totalMarks: generatedPaper.totalMarks,
        generatedAt: new Date(generatedPaper.generatedAt),
      });

      logger.info(`Job ${job.id} completed successfully`);
      
      return { success: true, paperId: generatedPaper.id };
    } catch (error) {
      logger.error(`Job ${job.id} failed:`, error);
      await assignmentService.updateAssignmentStatus(job.data.assignmentId, 'failed');
      throw error;
    }
  }, {
    connection: redisOptions,
    concurrency: 3,
  });

  logger.info('Queues initialized');
}

export function getQuestionGenerationQueue(): Queue<GenerationJobData> {
  if (!questionGenerationQueue) {
    throw new Error('Queues not initialized');
  }
  return questionGenerationQueue;
}

export async function addGenerationJob(data: GenerationJobData) {
  const queue = getQuestionGenerationQueue();
  return queue.add('generate', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
}
