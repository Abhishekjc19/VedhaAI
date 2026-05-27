import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errorHandler';

export const assignmentValidationSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  topic: Joi.string().min(1).max(500).required(),
  description: Joi.string().max(1000).optional(),
  dueDate: Joi.date().required(),
  questionTypes: Joi.array().items(Joi.string()).min(1).required(),
  numberOfQuestions: Joi.number().min(1).max(100).required(),
  totalMarks: Joi.number().min(1).max(500).required(),
  additionalInstructions: Joi.string().max(2000).optional(),
});

export function validateRequest(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d: Joi.ValidationErrorItem) => d.message).join(', ');
      throw new ValidationError(400, messages);
    }

    req.body = value;
    next();
  };
}
