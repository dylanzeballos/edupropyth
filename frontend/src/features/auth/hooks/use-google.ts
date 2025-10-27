import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { getUserFullName } from '../types/user.type';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { AuthResponse } from '../types/login.types';

export const useGoogleAuthMutation = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idToken: string) => authService.googleAuth(idToken),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response: AuthResponse) => {
      setAuth(response.user, response.accessToken, response.refreshToken);

      toast.success('¡Inicio de sesión con Google exitoso!', {
        description: `Bienvenido ${getUserFullName(response.user) || response.user.email}`,
      });

      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/dashboard', { replace: true });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error('Error de autenticación con Google', {
        description: message,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
