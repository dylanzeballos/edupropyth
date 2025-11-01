import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, InputText } from '@/shared/components/ui';
import {
  createTopicSchema,
  updateTopicSchema,
  CreateTopicFormData,
  UpdateTopicFormData,
} from '../validation/topic.schema';
import type { Topic } from '../types/topic.types';

interface TopicFormProps {
  topic?: Topic;
  onSubmit: (data: CreateTopicFormData | UpdateTopicFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  nextOrder?: number;
}

export const TopicForm = ({
  topic,
  onSubmit,
  isSubmitting,
  onCancel,
  nextOrder = 0,
}: TopicFormProps) => {
  const isEditing = !!topic;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTopicFormData | UpdateTopicFormData>({
    resolver: zodResolver(isEditing ? updateTopicSchema : createTopicSchema),
    defaultValues: topic
      ? {
          title: topic.title,
          description: topic.description || '',
          order: topic.order,
          isActive: topic.isActive,
        }
      : {
          title: '',
          description: '',
          order: nextOrder,
        },
  });

  const handleFormSubmit = (
    data: CreateTopicFormData | UpdateTopicFormData
  ) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <InputText
        label="Título"
        name="title"
        type="text"
        placeholder="Ej: Introducción a JavaScript"
        register={register}
        errors={errors}
        isRequired={!isEditing}
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
          placeholder="Describe el contenido del tema..."
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {!isEditing && (
        <input type="hidden" {...register('order', { valueAsNumber: true })} />
      )}

      {isEditing && (
        <>
          <InputText
            label="Orden"
            name="order"
            type="number"
            register={register}
            errors={errors}
            isRequired={false}
          />

          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('isActive')}
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Tema activo
            </label>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3 pt-4">
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
          {isEditing ? 'Actualizar Tema' : 'Crear Tema'}
        </Button>
      </div>
    </form>
  );
};
