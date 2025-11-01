import { motion } from 'framer-motion';
import { CourseStatusBadge } from './CourseStatusBadge';
import type { Course } from '../types/course.types';

interface CourseListCardProps {
  course: Course;
  onClick: () => void;
}

export const CourseListCard = ({ course, onClick }: CourseListCardProps) => {
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
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {course.topics?.length || 0} tópico{course.topics?.length !== 1 ? 's' : ''}
          </span>
          <span className="text-blue-600 dark:text-blue-400 hover:underline">
            Ver detalles →
          </span>
        </div>
      </div>
    </motion.div>
  );
};
