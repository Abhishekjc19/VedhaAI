import { Request, Response } from 'express';
import { assignmentService, cacheService } from '../services/assignmentService';
import { addGenerationJob } from '../services/queueService';
import { logger } from '../utils/logger';

export async function createAssignment(req: Request, res: Response) {
  try {
    const {
      title,
      topic,
      description,
      dueDate,
      questionTypes,
      numberOfQuestions,
      totalMarks,
      additionalInstructions,
    } = req.body;

    const assignment = await assignmentService.createAssignment({
      title,
      topic,
      description,
      dueDate: new Date(dueDate),
      questionTypes,
      numberOfQuestions,
      totalMarks,
      additionalInstructions,
    });

    res.status(201).json(assignment);
  } catch (error) {
    logger.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
}

export async function generateQuestions(req: Request, res: Response) {
  try {
    const { assignmentId } = req.params;
    const { difficulty, fileContent } = req.body;

    const assignment = await assignmentService.getAssignment(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Add job to queue
    const job = await addGenerationJob({
      assignmentId,
      topic: assignment.topic,
      numberOfQuestions: assignment.numberOfQuestions,
      questionTypes: assignment.questionTypes,
      totalMarks: assignment.totalMarks,
      difficulty: difficulty || 'mixed',
      additionalInstructions: assignment.additionalInstructions,
      fileContent,
    });

    res.json({
      jobId: job.id,
      status: 'queued',
      message: 'Question generation started',
    });
  } catch (error) {
    logger.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
}

export async function getAssignment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const assignment = await assignmentService.getAssignment(id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    logger.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
}

export async function getQuestionPaper(req: Request, res: Response) {
  try {
    const { paperId } = req.params;

    // Try cache first
    const cached = await cacheService.get(`paper:${paperId}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const paper = await assignmentService.getQuestionPaper(paperId);
    if (!paper) {
      return res.status(404).json({ error: 'Question paper not found' });
    }

    // Cache for 24 hours
    await cacheService.set(`paper:${paperId}`, JSON.stringify(paper), 86400);

    res.json(paper);
  } catch (error) {
    logger.error('Error fetching question paper:', error);
    res.status(500).json({ error: 'Failed to fetch question paper' });
  }
}

export async function listAssignments(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const assignments = await assignmentService.listAssignments(limit, skip);
    res.json({
      data: assignments,
      page,
      limit,
    });
  } catch (error) {
    logger.error('Error listing assignments:', error);
    res.status(500).json({ error: 'Failed to list assignments' });
  }
}

export async function deleteAssignment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await assignmentService.deleteAssignment(id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    logger.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
}
