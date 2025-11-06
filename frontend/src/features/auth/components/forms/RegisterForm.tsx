import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Button, InputText } from '@/shared/components/ui';
import {
  registerUserSchema,
  RegisterFormData,
} from '../../validation/register.schema';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isPending?: boolean;
}

export const RegisterForm = ({
  onSubmit,
  isPending = false,
}: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerUserSchema),
    mode: 'onChange',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputText
          label="Correo Electrónico"
          name="email"
          type="email"
          placeholder="ejemplo@correo.com"
          register={register}
          errors={errors}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputText
            label="Nombre"
            name="firstName"
            type="text"
            placeholder="Juan"
            register={register}
            errors={errors}
          />

          <InputText
            label="Apellido"
            name="lastName"
            type="text"
            placeholder="Pérez"
            register={register}
            errors={errors}
          />
        </div>

        <InputText
          label="Contraseña"
          name="password"
          type="password"
          placeholder="••••••••"
          register={register}
          errors={errors}
        />

        <InputText
          label="Confirmar Contraseña"
          name="passwordConfirm"
          type="password"
          placeholder="••••••••"
          register={register}
          errors={errors}
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
            {...register('acceptTerms')}
          />
          <div className="ml-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Acepto los{' '}
              <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline"
              >
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline"
              >
                política de privacidad
              </Link>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variantColor="primary"
          disabled={isPending}
          className="w-full"
          loading={isPending}
          label="Crear cuenta"
          loadingText="Creando cuenta..."
        />
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿Ya tienes una cuenta?{' '}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </motion.div>
  );
};
