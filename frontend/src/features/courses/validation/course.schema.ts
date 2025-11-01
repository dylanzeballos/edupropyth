import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título es muy largo')
    .trim(),
  description: z.string().optional(),
  thumbnail: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

export const updateCourseSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título es muy largo')
    .trim()
    .optional(),
  description: z.string().optional(),
  thumbnail: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;
