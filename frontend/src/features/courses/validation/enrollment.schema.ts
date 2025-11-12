import { z } from 'zod';

export const enrollmentKeySchema = z.object({
  enrollmentKey: z
    .string()
    .min(1, 'El código de matrícula es requerido')
    .min(5, 'El código debe tener al menos 5 caracteres')
    .max(20, 'El código no puede exceder 20 caracteres')
    .regex(/^[A-Z0-9-_]+$/, 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos')
    .transform((val) => val.toUpperCase()),
});

export type EnrollmentKeyFormData = z.infer<typeof enrollmentKeySchema>;
