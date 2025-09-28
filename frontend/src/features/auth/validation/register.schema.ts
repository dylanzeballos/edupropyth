import { z } from "zod";

export const registerUserSchema = z.object({
    username: z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(150, "El nombre de usuario no puede tener más de 150 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/, "El nombre de usuario solo puede contener letras, números y guiones bajos"),

    email: z
        .string()
        .min(1, "El email es requerido")
        .email("Formato de email inválido"),

    first_name: z
        .string()
        .min(1, "El nombre es requerido")
        .max(30, "El nombre no puede tener más de 30 caracteres"),

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

    bio: z
        .string()
        .max(500, "La biografía no puede tener más de 500 caracteres")
        .optional()
        .or(z.literal(""))
}).refine((data) => data.password === data.password_confirm, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirm"],
});

export type RegisterData = z.infer<typeof registerUserSchema>;