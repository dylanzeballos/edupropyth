import { z } from 'zod';

const resourceTypes = [
  'slide',
  'video',
  'audio',
  'document',
  'link',
] as const;

export const createResourceSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título es muy largo')
    .trim(),
  description: z.string().optional(),
  type: z.enum(resourceTypes, { message: 'Tipo de recurso inválido' }),
  url: z.string().url('Debe ser una URL válida'),
  publicId: z.string().optional(),
  order: z.number().min(0, 'El orden debe ser positivo'),
});

export const uploadResourceSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título es muy largo')
    .trim(),
  description: z.string().optional(),
  type: z.enum(resourceTypes, { message: 'Tipo de recurso inválido' }),
  order: z.number().min(0, 'El orden debe ser positivo'),
  file: z.instanceof(File, { message: 'Debe seleccionar un archivo' }),
});

export const updateResourceSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(255, 'El título es muy largo')
    .trim()
    .optional(),
  description: z.string().optional(),
  type: z.enum(resourceTypes).optional(),
  url: z.string().url('Debe ser una URL válida').optional(),
  order: z.number().min(0, 'El orden debe ser positivo').optional(),
});

export type CreateResourceFormData = z.infer<typeof createResourceSchema>;
export type UploadResourceFormData = z.infer<typeof uploadResourceSchema>;
export type UpdateResourceFormData = z.infer<typeof updateResourceSchema>;
