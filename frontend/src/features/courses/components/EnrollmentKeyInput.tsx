import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Input } from '@/shared/components/form';
import { useEnrollmentKeyForm } from '../hooks/useEnrollmentKeyForm';

export const EnrollmentKeyInput = () => {
  const { register, handleSubmit, errors, isPending } = useEnrollmentKeyForm();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            label="¿Tienes un código de matrícula?"
            placeholder="Ejemplo: PYTHON2024A"
            error={errors.enrollmentKey?.message}
            helperText="Ingresa el código proporcionado por tu profesor para inscribirte en un curso"
            maxLength={20}
            disabled={isPending}
            {...register('enrollmentKey', {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
        </div>

        <div className="flex items-end">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto px-6 py-2"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Procesando...
              </>
            ) : (
              'Inscribirse'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
