import z from 'zod'
import { status } from '../config/constants.js';

export const addTaskSchema = z.object({
  title: z.string().min(4, "Task title must be filled, minimal 4 character").max(255, "Task title cannot exceed 255 character"),
  description: z.string().optional().nullable(),
  status: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.enum(status).default("pending")
  ),
  deadline: z.preprocess(
    (val) => (val === "" || val === null ? null : val),
    z.coerce.date().nullable()
  ),
})

export const getTaskSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.enum(status).default("pending")
  ),
  keywords: z.string().optional(),
})

export const updateTaskIdSchema = z.object({
  id: z.coerce.number("Identifier unknown").int().positive("Identifier must be positive")
})

export const updateTaskDataSchema = z.object({
  title: z.string().min(4, "Task title must be filled, minimal 4 character").max(255, "Task title cannot exceed 255 character"),
  description: z.string().optional().nullable(),
  status: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.enum(status).default("pending")
  ),
  deadline: z.preprocess(
    (val) => (val === "" || val === null ? null : val),
    z.coerce.date().nullable()
  ),
})