import { motion } from 'framer-motion';
import { CourseStatusBadge } from './CourseStatusBadge';
import { FileEdit, BookCheck, Archive } from 'lucide-react';
import type { Course } from '../types/course.types';

interface CourseListCardProps {
  course: Course;
  onClick: () => void;
}

export const CourseListCard = ({ course, onClick }: CourseListCardProps) => {
  const editionsCount = course.editionsCount || 0;
  const draftCount = course.draftEditionsCount || 0;
  const activeCount = course.activeEditionsCount || 0;
  const historicCount = course.historicEditionsCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <CourseStatusBadge status={course.status} size="sm" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
            {course.description}
          </p>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Total de ediciones:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {editionsCount}
            </span>
          </div>
          {editionsCount > 0 && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FileEdit className="w-4 h-4 text-gray-600 dark:text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Borrador
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {draftCount}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <BookCheck className="w-4 h-4 text-green-600 dark:text-green-400 mb-1" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  Activas
                </span>
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {activeCount}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Archive className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  Históricas
                </span>
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {historicCount}
                </span>
              </div>
            </div>
          )}
          <div className="pt-2">
            <span className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              Ver detalles →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
