import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { getUserFullName } from '../types/user.type';
import { getErrorMessage } from '@/shared/utils/error-handler';

import { LoginRequest } from '../types/login.types';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken);

      toast.success('¡Inicio de sesión exitoso!', {
        description: `Bienvenido ${getUserFullName(response.user) || response.user.email}`,
      });

      queryClient.invalidateQueries({ queryKey: ['user'] });

      navigate('/dashboard', { replace: true });
    },
    onError: (error: unknown) => {
      setLoading(false);
      const message = getErrorMessage(error);
      toast.error('Error de autenticación', {
        description: message,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Sesión cerrada correctamente');
      navigate('/signin', { replace: true });
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      navigate('/signin', { replace: true });
    },
  });
};
