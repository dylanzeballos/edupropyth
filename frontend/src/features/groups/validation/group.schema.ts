import { z } from 'zod';

export const groupSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  instructorId: z
    .string()
    .uuid('Debe ser un UUID válido')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;
