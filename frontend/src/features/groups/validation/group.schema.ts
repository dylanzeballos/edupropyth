import { z } from 'zod';

export const groupSchema = z
  .object({
    name: z
      .string({ message: 'El nombre es obligatorio' })
      .min(1, 'El nombre es obligatorio')
      .max(50, 'Máximo 50 caracteres'),
    schedule: z.string().optional(),
    instructorId: z
      .string()
      .uuid('Debe ser un UUID válido')
      .optional()
      .or(z.literal('')),
    maxStudents: z
      .number({ message: 'Debe ser un número' })
      .int('Debe ser un número entero')
      .positive('Debe ser mayor a 0')
      .optional()
      .nullable(),
    enrollmentKey: z
      .string()
      .max(50, 'Máximo 50 caracteres')
      .optional()
      .or(z.literal('')),
    isEnrollmentOpen: z.boolean().optional(),
    enrollmentStartDate: z.string().optional().or(z.literal('')),
    enrollmentEndDate: z.string().optional().or(z.literal('')),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.enrollmentStartDate && data.enrollmentEndDate) {
        return (
          new Date(data.enrollmentStartDate) <=
          new Date(data.enrollmentEndDate)
        );
      }
      return true;
    },
    {
      message:
        'La fecha de inicio debe ser anterior o igual a la fecha de fin',
      path: ['enrollmentEndDate'],
    }
  );

export type GroupFormData = z.infer<typeof groupSchema>;
