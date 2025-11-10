import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText, Button } from '@/shared/components/ui';
import { groupSchema, type GroupFormData } from '../validation/group.schema';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      instructorId: defaultValues?.instructorId ?? '',
      isActive: defaultValues?.isActive ?? true,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      autoComplete="off"
    >
      <InputText
        label="Nombre del grupo"
        name="name"
        placeholder="Ej: Grupo A"
        register={register}
        errors={errors}
        isRequired
      />

      <InputText
        label="Instructor (UUID)"
        name="instructorId"
        placeholder="Opcional"
        register={register}
        errors={errors}
        isRequired={false}
      />

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

      <div className="flex justify-end gap-3">
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
          Guardar
        </Button>
      </div>
    </form>
  );
};
