import { z } from "zod";

export const registerUserSchema = z.object({
    email: z
        .string()
        .min(1, "El email es requerido")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es válido"),
    firstName: z
        .string()
        .min(1, "El nombre es requerido")
        .max(30, "El nombre no puede tener más de 30 caracteres")
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "El nombre solo puede contener letras, espacios, apóstrofes y guiones"),
    lastName: z
        .string()
        .min(1, "El apellido es requerido")
        .max(30, "El apellido no puede tener más de 30 caracteres"),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una minúscula, una mayúscula y un número"),
    passwordConfirm: z
        .string()
        .min(1, "Confirma tu contraseña"),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: "Debes aceptar los términos y condiciones",
    }),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
});

export type RegisterFormData = z.infer<typeof registerUserSchema>;