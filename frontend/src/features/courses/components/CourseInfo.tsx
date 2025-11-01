import { CourseStatusBadge } from './CourseStatusBadge';
import type { Course } from '../types/course.types';

interface CourseInfoProps {
  course: Course;
  topicsCount: number;
}

export const CourseInfo = ({ course, topicsCount }: CourseInfoProps) => {

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Estado
        </h3>
        <div className="mt-2">
          <CourseStatusBadge status={course.status} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Total de Tópicos
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {topicsCount}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Última Actualización
        </h3>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {new Date(course.updatedAt).toLocaleDateString('es-ES')}
        </p>
      </div>
    </div>
  );
};
