import { z } from 'zod';

export const assignmentValidationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  topic: z
    .string()
    .min(1, 'Topic is required')
    .max(500, 'Topic must be less than 500 characters'),
  description: z.string().max(1000, 'Description too long').optional(),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine(
      (date) => new Date(date) > new Date(),
      'Due date must be in the future'
    ),
  questionTypes: z
    .array(z.string())
    .min(1, 'Select at least one question type')
    .max(10, 'Maximum 10 question types'),
  numberOfQuestions: z
    .number()
    .min(1, 'Minimum 1 question')
    .max(100, 'Maximum 100 questions')
    .int('Must be a whole number'),
  totalMarks: z
    .number()
    .min(1, 'Minimum 1 mark')
    .max(500, 'Maximum 500 marks')
    .int('Must be a whole number'),
  additionalInstructions: z
    .string()
    .max(2000, 'Instructions too long')
    .optional(),
});

export type AssignmentFormData = z.infer<typeof assignmentValidationSchema>;
