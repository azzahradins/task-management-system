import { z } from 'zod'
import type { FormErrors } from './formErrors';

export const taskStatusSchema = z.enum(['pending', 'in-progress', 'done'])

export const createTaskSchema = z.object({
  title: z.string().trim().min(4, 'Task title must be at least 4 characters.'),
  description: z.string().optional(),
  status: taskStatusSchema,
  deadline: z
    .string()
    .optional()
    .refine(
      (value) => !value || new Date(value).getTime() >= Date.now(),
      'Deadline cannot past current time.',
    ),
})

export type CreateTaskValues = z.infer<typeof createTaskSchema>
export type CreateTaskErrors = FormErrors<keyof CreateTaskValues>