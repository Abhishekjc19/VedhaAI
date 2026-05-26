import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get questions for an assignment
router.get('/assignment/:assignmentId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { assignmentId } = req.params;

    // Verify assignment belongs to user
    const { data: assignment } = await supabase
      .from('assignments')
      .select('id')
      .eq('id', assignmentId)
      .eq('user_id', userId)
      .single();

    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch questions', error });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create questions (bulk insert)
router.post('/bulk', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { assignmentId, questions } = req.body;

    // Verify assignment belongs to user
    const { data: assignment } = await supabase
      .from('assignments')
      .select('id')
      .eq('id', assignmentId)
      .eq('user_id', userId)
      .single();

    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Insert questions
    const questionsWithAssignmentId = questions.map((q: any) => ({
      ...q,
      assignment_id: assignmentId,
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(questionsWithAssignmentId)
      .select();

    if (error) {
      return res.status(500).json({ message: 'Failed to create questions', error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating questions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update question
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const updates = req.body;

    // Verify user owns the assignment
    const { data: question } = await supabase
      .from('questions')
      .select('assignment_id')
      .eq('id', id)
      .single();

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { data: assignment } = await supabase
      .from('assignments')
      .select('id')
      .eq('id', question.assignment_id)
      .eq('user_id', userId)
      .single();

    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update question', error });
    }

    res.json(data);
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete question
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // Verify user owns the assignment
    const { data: question } = await supabase
      .from('questions')
      .select('assignment_id')
      .eq('id', id)
      .single();

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { data: assignment } = await supabase
      .from('assignments')
      .select('id')
      .eq('id', question.assignment_id)
      .eq('user_id', userId)
      .single();

    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete question', error });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
