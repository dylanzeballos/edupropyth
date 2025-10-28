import { PencilIcon, ClockIcon, BookOpenIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui/badge';
import type { Course } from '../types/course.types';

interface CourseCardProps {
  course: Course;
  onEdit?: () => void;
  canEdit?: boolean;
}

export const CourseCard = ({ course, onEdit, canEdit }: CourseCardProps) => {
  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[difficulty] || difficulty;
  };

  const getDifficultyVariant = (difficulty: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      beginner: 'default',
      intermediate: 'secondary',
      advanced: 'destructive',
    };
    return variants[difficulty] || 'default';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {course.image && (
        <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {course.title}
              </h2>
              <Badge variant={course.isActive ? 'default' : 'secondary'}>
                {course.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <Badge variant={getDifficultyVariant(course.difficulty)}>
              {getDifficultyLabel(course.difficulty)}
            </Badge>
          </div>

          {canEdit && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="ml-4"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {course.description}
        </p>

        {course.content && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Contenido:
            </h3>
            <div className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
              {course.content}
            </div>
          </div>
        )}

        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>{course.duration} horas</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-4 w-4" />
            <span>Curso único del sistema</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          <p>
            Creado: {new Date(course.createdAt).toLocaleDateString('es-ES')}
          </p>
          <p>
            Actualizado: {new Date(course.updatedAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};
