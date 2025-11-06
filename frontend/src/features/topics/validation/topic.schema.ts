import { z } from 'zod';

export const createTopicSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título es muy largo')
    .trim(),
  description: z.string().optional(),
  order: z.number().min(0, 'El orden debe ser positivo'),
});

export const updateTopicSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título es muy largo')
    .trim()
    .optional(),
  description: z.string().optional(),
  order: z.number().min(0, 'El orden debe ser positivo').optional(),
  isActive: z.boolean().optional(),
});

export const reorderTopicsSchema = z.object({
  topics: z.array(
    z.object({
      id: z.string().uuid('ID de tema inválido'),
      order: z.number().min(0, 'El orden debe ser positivo'),
    })
  ),
});

export type CreateTopicFormData = z.infer<typeof createTopicSchema>;
export type UpdateTopicFormData = z.infer<typeof updateTopicSchema>;
export type ReorderTopicsFormData = z.infer<typeof reorderTopicsSchema>;
