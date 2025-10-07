import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { RegisterFormData } from '../validation/register.schema';

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const { setLoading } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      toast.success('¡Registro exitoso!', {
        description: 'Tu cuenta ha sido creada correctamente. Por favor inicia sesión.'
      });
      navigate('/signin', { replace: true });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al registrarse';
      toast.error('Error de registro', {
        description: message
      });
    },
    onSettled: () => {
      setLoading(false);
    }
  });
};