import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título es muy largo')
    .trim(),
  description: z.string().min(1, 'La descripción es obligatoria').trim(),
  content: z.string().optional(),
  image: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  duration: z
    .number()
    .min(0, 'La duración debe ser positiva')
    .optional()
    .or(z.nan())
    .transform((val) => (isNaN(val as number) ? undefined : val)),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
    .default('beginner'),
});

export const updateCourseSchema = createCourseSchema
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial();

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;
