import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Ingresa un email válido')
    .min(1, 'El email es requerido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(20, 'La contraseña no debe exceder los 20 caracteres')
    .min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
