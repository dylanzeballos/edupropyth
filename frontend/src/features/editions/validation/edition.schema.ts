import { z } from 'zod';

export const createEditionSchema = z.object({
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .min(1, 'El título es obligatorio')
    .max(255, 'El título no puede superar 255 caracteres'),
  description: z
    .string()
    .max(1000, 'La descripción no puede superar 1000 caracteres')
    .optional()
    .or(z.literal('')),
  thumbnail: z
    .string()
    .url('Ingresa una URL válida')
    .optional()
    .or(z.literal('')),
  sourceCourseId: z
    .string()
    .uuid('Selecciona una edición válida para clonar')
    .optional()
    .or(z.literal('')),
});

export type CreateEditionFormData = z.infer<typeof createEditionSchema>;
