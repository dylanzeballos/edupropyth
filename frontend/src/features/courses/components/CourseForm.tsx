import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, InputText } from '@/shared/components/ui';
import {
  createCourseSchema,
  updateCourseSchema,
  CreateCourseFormData,
  UpdateCourseFormData,
} from '../validation/course.schema';
import type { Course } from '../types/course.types';

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CreateCourseFormData | UpdateCourseFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const CourseForm = ({
  course,
  onSubmit,
  isSubmitting,
  onCancel,
}: CourseFormProps) => {
  const isEditing = !!course;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseFormData | UpdateCourseFormData>({
    resolver: zodResolver(isEditing ? updateCourseSchema : createCourseSchema),
    defaultValues: course
      ? {
          title: course.title,
          description: course.description || '',
          thumbnail: course.thumbnail || '',
        }
      : {
          title: '',
          description: '',
          thumbnail: '',
        },
  });

  const handleFormSubmit = (
    data: CreateCourseFormData | UpdateCourseFormData,
  ) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <InputText
        label="Título"
        name="title"
        type="text"
        placeholder="Ej: Curso de Programación Python"
        register={register}
        errors={errors}
        isRequired={!isEditing}
        validationRules={{ maxLength: 255,
          pattern: /^[a-zA-ZáéíóúñÑ0-9\s]+$/
         }}
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
          placeholder="Describe brevemente el curso..."
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

      <InputText
        label="Imagen de Portada (URL)"
        name="thumbnail"
        type="url"
        placeholder="https://example.com/course-thumbnail.jpg"
        register={register}
        errors={errors}
        isRequired={false}
      />

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
          {isEditing ? 'Actualizar Curso' : 'Crear Curso'}
        </Button>
      </div>
    </form>
  );
};
