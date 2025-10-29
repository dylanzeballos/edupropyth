import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { RegisterFormData } from '../validation/register.schema';
import { RegisterRequest } from '../types/login.types';
import { getErrorMessage } from '@/shared/utils/error-handler';

export const useRegisterUser = () => {
  const navigate = useNavigate();
  const { setLoading } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      toast.success('¡Registro exitoso!', {
        description:
          'Tu cuenta ha sido creada correctamente. Por favor inicia sesión.',
      });
      navigate('/login', { replace: true });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error('Error de registro', {
        description: message,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const handleSubmit = (formData: RegisterFormData) => {
    const registerData: RegisterRequest = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
    };

    mutation.mutate(registerData);
  };

  return {
    handleSubmit,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
