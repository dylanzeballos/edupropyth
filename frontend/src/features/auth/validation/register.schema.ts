import { z } from "zod";

export const registerUserSchema = z.object({
    email: z
        .string()
        .min(1, "El email es requerido")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es válido"),
    first_name: z
        .string()
        .min(1, "El nombre es requerido")
        .max(30, "El nombre no puede tener más de 30 caracteres")
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "El nombre solo puede contener letras, espacios, apóstrofes y guiones"),
    last_name: z
        .string()
        .min(1, "El apellido es requerido")
        .max(30, "El apellido no puede tener más de 30 caracteres"),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una minúscula, una mayúscula y un número"),
    password_confirm: z
        .string()
        .min(1, "Confirma tu contraseña"),
    userType: z.enum(["estudiante", "profesor"], {
        required_error: "El tipo de usuario es requerido",
    }),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: "Debes aceptar los términos y condiciones",
    }),
}).refine((data) => data.password === data.password_confirm, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirm"],
});

export type RegisterFormData = z.infer<typeof registerUserSchema>;