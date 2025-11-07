import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Input } from '@/shared/components/form/Input';
import { Textarea } from '@/shared/components/form/Textarea';
import {
  createActivitySchema,
  type CreateActivityFormData,
} from '../validation/activity.schema';
import { ActivityType } from '../types/activity.types';
import { ActivityTypeSelector } from './ActivityTypeSelector';
import {
  formatDateForInput,
  cleanActivityFormData,
  prepareUpdateData,
} from '../utils/form-utils';

interface ActivityFormProps {
  topicId: string;
  order: number;
  initialData?: Partial<CreateActivityFormData>;
  onSubmit: (data: CreateActivityFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  topicId,
  order,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const form = useForm({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      topicId,
      order,
      type: ActivityType.ASSIGNMENT,
      isRequired: false,
      content: {},
      ...initialData,
      dueDate: initialData?.dueDate
        ? formatDateForInput(initialData.dueDate)
        : undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const selectedType = watch('type');

  const handleFormSubmit = handleSubmit((data) => {
    const cleanedData = cleanActivityFormData(data);

    if (initialData) {
      onSubmit(prepareUpdateData(cleanedData) as CreateActivityFormData);
    } else {
      onSubmit(cleanedData as unknown as CreateActivityFormData);
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Título de la actividad <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          type="text"
          placeholder="Ej: Ejercicio de Python básico"
          {...register('title')}
          error={errors.title?.message}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Descripción <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          placeholder="Describe los objetivos y requisitos de la actividad..."
          rows={2}
          {...register('description')}
          error={errors.description?.message}
        />
      </div>

      <ActivityTypeSelector
        selectedType={selectedType}
        disabled={!!initialData}
        error={errors.type?.message}
        onTypeChange={(type) => form.setValue('type', type)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha límite
            </div>
          </label>
          <Input
            id="dueDate"
            type="datetime-local"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            Opcional. Define una fecha de entrega.
          </p>
        </div>

        <div>
          <label
            htmlFor="maxScore"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Puntaje máximo
          </label>
          <Input
            id="maxScore"
            type="number"
            min="0"
            max="1000"
            placeholder="100"
            {...register('maxScore', { valueAsNumber: true })}
            error={errors.maxScore?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            Opcional. Puntos totales para calificar.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <input
          id="isRequired"
          type="checkbox"
          {...register('isRequired')}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <div className="flex-1">
          <label
            htmlFor="isRequired"
            className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
          >
            Marcar como obligatoria
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Los estudiantes deberán completar esta actividad para avanzar en el
            curso.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : initialData
              ? 'Actualizar'
              : 'Crear actividad'}
        </Button>
      </div>
    </form>
  );
};
