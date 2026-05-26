import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all assignments for the current user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch assignments', error });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single assignment
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Assignment not found', error });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching assignment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create assignment
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, topic, description, due_date, total_questions, total_marks, question_config } = req.body;

    const { data, error } = await supabase
      .from('assignments')
      .insert([
        {
          user_id: userId,
          title,
          topic,
          description,
          due_date,
          total_questions,
          total_marks,
          question_config: question_config || {},
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create assignment', error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update assignment
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const updates = req.body;

    // Verify ownership
    const { data: existing } = await supabase
      .from('assignments')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('assignments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update assignment', error });
    }

    res.json(data);
  } catch (err) {
    console.error('Error updating assignment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete assignment
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // Verify ownership
    const { data: existing } = await supabase
      .from('assignments')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete assignment', error });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error('Error deleting assignment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
