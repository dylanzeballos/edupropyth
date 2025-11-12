import { ArrowLeft, Edit, Layout } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { CourseStatusBadge } from './CourseStatusBadge';
import type { Course } from '../types/course.types';
import { useNavigate } from 'react-router';

interface CourseHeaderProps {
  course: Course;
  canEdit: boolean;
  canConfigureTemplate?: boolean;
  onBack: () => void;
  onEdit: () => void;
}

export const CourseHeader = ({
  course,
  canEdit,
  canConfigureTemplate = canEdit,
  onBack,
  onEdit,
}: CourseHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Button variant="ghost" onClick={onBack} className="mb-4" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Volver a cursos</span>
        <span className="sm:hidden">Volver</span>
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
              {course.title}
            </h1>
            <CourseStatusBadge status={course.status} />
          </div>
          {course.description && (
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 break-words">
              {course.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:ml-4 flex-shrink-0">
          {canConfigureTemplate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/courses/${course.id}/template`)}
              className="flex-1 sm:flex-initial"
            >
              <Layout className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-2">Configurar Template</span>
              <span className="sm:hidden ml-2">Template</span>
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1 sm:flex-initial"
            >
              <Edit className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-2">Editar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
