import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, InputText } from '@/shared/components/ui';
import { createEditionSchema, type CreateEditionFormData } from '../validation/edition.schema';
import type { Edition } from '../types/edition.types';

interface EditionFormProps {
  editions?: Edition[];
  onSubmit: (data: CreateEditionFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const EditionForm = ({
  editions = [],
  onSubmit,
  onCancel,
  isSubmitting,
}: EditionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEditionFormData>({
    resolver: zodResolver(createEditionSchema),
    defaultValues: {
      title: '',
      description: '',
      thumbnail: '',
      sourceCourseId: '',
    },
  });

  const handleFormSubmit = (data: CreateEditionFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <InputText
        label="Nombre de la edición"
        name="title"
        type="text"
        placeholder="Ej: II-2025"
        register={register}
        errors={errors}
        isRequired
      />

      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Descripción
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Describe el enfoque de esta edición..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <InputText
        label="Imagen de portada (URL)"
        name="thumbnail"
        type="url"
        placeholder="https://example.com/edition-banner.jpg"
        register={register}
        errors={errors}
        isRequired={false}
      />

      <div>
        <label
          htmlFor="sourceCourseId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Clonar contenido desde
        </label>
        <select
          id="sourceCourseId"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          {...register('sourceCourseId')}
        >
          <option value="">No clonar (edición vacía)</option>
          {editions.map((edition) => (
            <option key={edition.id} value={edition.id}>
              {edition.title}
            </option>
          ))}
        </select>
        {errors.sourceCourseId && (
          <p className="mt-1 text-sm text-red-500">
            {errors.sourceCourseId.message}
          </p>
        )}
      </div>

      <div className="flex justify-end items-center gap-3 pt-4">
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
          Crear edición
        </Button>
      </div>
    </form>
  );
};
