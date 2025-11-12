import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText, Button } from '@/shared/components/ui';
import { Textarea } from '@/shared/components/form';
import { groupSchema, type GroupFormData } from '../validation/group.schema';
import { TeacherSelect } from './TeacherSelect';
import { useTeachers } from '@/features/users';
import { generateEnrollmentKey } from '../utils/enrollment-key.utils';
import { toDateTimeLocalString } from '@/shared/utils/date.utils';
import { RefreshCw } from 'lucide-react';

interface GroupFormProps {
  defaultValues?: Partial<GroupFormData>;
  onSubmit: (data: GroupFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  showStatusToggle?: boolean;
}

export const GroupForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  showStatusToggle = false,
}: GroupFormProps) => {
  const { data: teachers = [], isLoading: loadingTeachers } = useTeachers();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      schedule: defaultValues?.schedule ?? '',
      instructorId: defaultValues?.instructorId ?? '',
      maxStudents: defaultValues?.maxStudents ?? null,
      enrollmentKey: defaultValues?.enrollmentKey ?? '',
      isEnrollmentOpen: defaultValues?.isEnrollmentOpen ?? true,
      enrollmentStartDate: defaultValues?.enrollmentStartDate 
        ? toDateTimeLocalString(defaultValues.enrollmentStartDate)
        : '',
      enrollmentEndDate: defaultValues?.enrollmentEndDate
        ? toDateTimeLocalString(defaultValues.enrollmentEndDate)
        : '',
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const isEnrollmentOpen = watch('isEnrollmentOpen');

  const handleGenerateKey = () => {
    const newKey = generateEnrollmentKey(8);
    setValue('enrollmentKey', newKey);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      autoComplete="off"
    >
      <InputText
        label="Nombre del grupo"
        name="name"
        placeholder="Ej: Grupo A - Turno Mañana"
        register={register}
        errors={errors}
        isRequired
      />

      <div>
        <label
          htmlFor="schedule"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Horario
        </label>
        <Textarea
          id="schedule"
          placeholder="Ej: Lunes, Miércoles y Viernes de 08:00 a 10:00"
          rows={2}
          {...register('schedule')}
          error={errors.schedule?.message}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Opcional: Especifica los días y horarios de clase
        </p>
      </div>

      <Controller
        name="instructorId"
        control={control}
        render={({ field }) => (
          <TeacherSelect
            value={field.value || ''}
            onChange={field.onChange}
            teachers={teachers}
            isLoading={loadingTeachers}
            error={errors.instructorId?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <div>
        <label
          htmlFor="maxStudents"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Máximo de estudiantes
        </label>
        <input
          id="maxStudents"
          type="number"
          min="1"
          placeholder="Ej: 30"
          className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.maxStudents ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
          {...register('maxStudents', { 
            setValueAs: (v) => v === '' || v === null ? null : Number(v) 
          })}
        />
        {errors.maxStudents && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.maxStudents.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Opcional: Limita la cantidad de estudiantes que pueden inscribirse
        </p>
      </div>

      <div>
        <label
          htmlFor="enrollmentKey"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Código de inscripción
        </label>
        <div className="flex gap-2">
          <input
            id="enrollmentKey"
            type="text"
            placeholder="Ej: MATH2024A"
            maxLength={50}
            className={`flex-1 px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg
              text-gray-900 dark:text-gray-100 uppercase
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.enrollmentKey ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            {...register('enrollmentKey')}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateKey}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generar
          </Button>
        </div>
        {errors.enrollmentKey && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.enrollmentKey.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Los estudiantes usarán este código para inscribirse al grupo
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          {...register('isEnrollmentOpen')}
        />
        Inscripción abierta
      </label>

      {isEnrollmentOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <label
              htmlFor="enrollmentStartDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Inicio de inscripciones
            </label>
            <input
              id="enrollmentStartDate"
              type="datetime-local"
              className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.enrollmentStartDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              {...register('enrollmentStartDate')}
            />
            {errors.enrollmentStartDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.enrollmentStartDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="enrollmentEndDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Fin de inscripciones
            </label>
            <input
              id="enrollmentEndDate"
              type="datetime-local"
              className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.enrollmentEndDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              {...register('enrollmentEndDate')}
            />
            {errors.enrollmentEndDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.enrollmentEndDate.message}
              </p>
            )}
          </div>

          <p className="col-span-full text-xs text-gray-500 dark:text-gray-400">
            Opcional: Define el período en el que los estudiantes pueden
            inscribirse
          </p>
        </div>
      )}

      {showStatusToggle && (
        <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('isActive')}
          />
          El grupo está activo
        </label>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};
