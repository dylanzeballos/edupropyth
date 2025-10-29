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
  isLoading?: boolean;
  onCancel?: () => void;
}

export const CourseForm = ({
  course,
  onSubmit,
  isLoading,
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
          description: course.description,
          content: course.content || '',
          image: course.image || '',
          duration: course.duration,
          difficulty: course.difficulty,
          isActive: course.isActive,
        }
      : {
          title: '',
          description: '',
          content: '',
          image: '',
          duration: 0,
          difficulty: 'beginner',
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
        errors={errors.title}
        isRequired={true}
      />

      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          placeholder="Describe brevemente el curso..."
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="w-full">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Contenido
        </label>
        <textarea
          id="content"
          placeholder="Contenido completo del curso..."
          rows={6}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          {...register('content')}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
          label="Imagen (URL)"
          name="image"
          type="text"
          placeholder="https://example.com/image.jpg"
          register={register}
          errors={errors.image}
          isRequired={false}
        />

        <InputText
          label="Duración (horas)"
          name="duration"
          type="number"
          placeholder="120"
          register={register}
          errors={errors.duration}
          isRequired={false}
          validationRules={{
            valueAsNumber: true,
            min: { value: 0, message: 'La duración debe ser positiva' },
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Dificultad
          </label>
          <select
            id="difficulty"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            {...register('difficulty')}
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
          {errors.difficulty && (
            <p className="mt-1 text-sm text-red-500">
              {errors.difficulty.message}
            </p>
          )}
        </div>

        {isEditing && (
          <div className="flex items-center pt-6">
            <label
              htmlFor="isActive"
              className="flex items-center cursor-pointer"
            >
              <input
                id="isActive"
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('isActive')}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Curso activo
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variantColor="primary"
          disabled={isLoading}
          loading={isLoading}
          label={isEditing ? 'Actualizar Curso' : 'Crear Curso'}
          loadingText={
            isEditing ? 'Actualizando...' : 'Creando...'
          }
        />
      </div>
    </form>
  );
};
