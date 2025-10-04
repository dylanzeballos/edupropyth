import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { RegisterFormData } from '../validation/register.schema';

export const useRegisterUser = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      setLoading(true);
      return await authService.register({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        password: data.password,
        userType: data.userType,
      });
    },
    onSuccess: (response) => {
      if (response.user.userType === 'Profesor') {
        toast.success('Registro exitoso', {
          description: 'Tu cuenta ha sido creada. Un administrador debe aprobar tu acceso como docente.',
        });
        navigate('/auth/signin');
      } else {
        login(response.user, response.token);
        toast.success('¡Cuenta creada exitosamente!', {
          description: `Bienvenido ${response.user.firstName} a EduProPyth.`,
        });
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al crear la cuenta';
      toast.error('Error en el registro', {
        description: message,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};