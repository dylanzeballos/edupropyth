import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore} from "@/features/auth/stores/auth.store";
import { LoginFormData } from "../validation";

export const UseLoginUser = () => {
    const navigate = useNavigate();
    const { login, setLoading } = useAuthStore();

    return useMutation({
        mutationFn: async (data: LoginFormData) => {
            setLoading(true);
            return await authService.login({
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe,
            });
        },
        onSuccess: (response) => {
            login(response.user, response.token);
            toast.success(`Bienvenido de nuevo, ${response.user.firstName}!`);
            navigate("/");
        },
        onError: (error) => {
            const message = (error as any)?.message || "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
            toast.error('Error de autenticación', {
                description: message 
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};