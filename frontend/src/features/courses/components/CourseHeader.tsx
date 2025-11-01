import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { CourseStatusBadge } from './CourseStatusBadge';
import type { Course } from '../types/course.types';

interface CourseHeaderProps {
  course: Course;
  canEdit: boolean;
  onBack: () => void;
  onEdit: () => void;
}

export const CourseHeader = ({ course, canEdit, onBack, onEdit }: CourseHeaderProps) => {

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a cursos
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>
            <CourseStatusBadge status={course.status} />
          </div>
          {course.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {course.description}
            </p>
          )}
        </div>

        {canEdit && (
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
