import { Router } from 'express';
import {
  createAssignment,
  generateQuestions,
  getAssignment,
  getQuestionPaper,
  listAssignments,
  deleteAssignment,
} from '../controllers/assignmentController';

const router = Router();

// Assignment routes
router.post('/assignments', createAssignment);
router.get('/assignments', listAssignments);
router.get('/assignments/:id', getAssignment);
router.delete('/assignments/:id', deleteAssignment);

// Question generation routes
router.post('/assignments/:assignmentId/generate', generateQuestions);

// Question paper routes
router.get('/question-papers/:paperId', getQuestionPaper);

export default router;
