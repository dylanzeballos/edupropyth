import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService, GoogleAuthResponse } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';

export const useGoogleAuthMutation = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idToken: string) => authService.googleAuth(idToken),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response: GoogleAuthResponse) => {
      setAuth(response.user, response.access_token, response.refresh_token);

      toast.success('¡Inicio de sesión con Google exitoso!', {
        description: `Bienvenido ${response.user.full_name || response.user.email}`,
      });

      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/dashboard', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: string } };
      };
      const message =
        axiosError?.response?.data?.error ||
        'Error al iniciar sesión con Google';
      toast.error('Error de autenticación con Google', {
        description: message,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
