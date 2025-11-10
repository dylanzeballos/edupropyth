import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEnrollWithCode } from './useEnrollment';
import {
  enrollmentKeySchema,
  type EnrollmentKeyFormData,
} from '../validation/enrollment.schema';

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useEnrollmentKeyForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnrollmentKeyFormData>({
    resolver: zodResolver(enrollmentKeySchema),
    defaultValues: {
      enrollmentKey: '',
    },
  });

  const { mutate: enrollWithCode, isPending } = useEnrollWithCode();

  const onSubmit = (data: EnrollmentKeyFormData) => {
    enrollWithCode(
      {
        enrollmentKey: data.enrollmentKey,
      },
      {
        onSuccess: () => {
          toast.success('¡Inscripción exitosa!', {
            description: 'Te has inscrito correctamente al curso.',
            duration: 5000,
          });
          reset();
        },
        onError: (error: Error) => {
          const apiError = error as unknown as ApiErrorResponse;
          const message =
            apiError?.response?.data?.message ||
            'Código de matrícula inválido. Verifica e intenta nuevamente.';
          
          toast.error('Error al inscribirse', {
            description: message,
          });
        },
      }
    );
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isPending,
  };
};
