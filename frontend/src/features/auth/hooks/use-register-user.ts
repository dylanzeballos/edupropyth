import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth.service";
import { UserType, UserFormData } from "@/features/auth/types/user.type";

export const useSignUp = () => {
    const [userType, setUserType] = useState<UserType>('student');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: UserFormData) => {
        setLoading(true);

        try {
            // Add the selected user type to the form data
            const submitData = {
                ...data,
                role: userType
            };

            const result = await authService.register(submitData);

            toast.success("¡Registro exitoso!", {
                description: `Bienvenido ${result.full_name}. Tu cuenta como ${userType === 'student' ? 'estudiante' : 'instructor'} ha sido creada.`
            });

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error en el registro";
            toast.error("Error en el registro", {
                description: errorMessage
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSubmit,
        loading,
        userType,
        setUserType
    };
};