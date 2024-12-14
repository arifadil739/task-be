import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { TaskStatus } from '../models/Task';

export const taskSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title is required',
  }),
  description: Joi.string().required().allow(''),
  status: Joi.string().valid(...Object.values(TaskStatus)).required().messages({
    'any.only': `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
    'string.base': 'Status must be a string',
  }),
  dueDate: Joi.date().required().messages({
    'date.base': 'Due date must be a valid date',
  }),
});

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      errors: error.details.map(detail => ({
        message: detail.message,
        path: detail.path,
      })),
    });
  }

  req.body = value;
  next();
};
