import { z } from 'zod';
import { ActivityType } from '../types/activity.types';

export const createActivitySchema = z.object({
  topicId: z.string().uuid('ID de tópico inválido'),
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(255, 'El título no puede exceder 255 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  type: z.nativeEnum(ActivityType),
  content: z.record(z.string(), z.unknown()).default({}),
  dueDate: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  maxScore: z
    .preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        return Number(val);
      },
      z
        .number()
        .min(0, 'El puntaje debe ser mayor o igual a 0')
        .max(1000, 'El puntaje no puede exceder 1000')
        .optional()
    ),
  isRequired: z.boolean().default(false),
  order: z.number().min(0, 'El orden debe ser mayor o igual a 0').default(0),
});

export const updateActivitySchema = createActivitySchema.partial().omit({
  topicId: true,
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
export type UpdateActivityFormData = z.infer<typeof updateActivitySchema>;
