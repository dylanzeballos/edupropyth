import { motion } from 'framer-motion';
import { BookOpen} from 'lucide-react';
import type { Course } from '../types/course.types';

interface StudentCourseCardProps {
  course: Course;
  onClick: () => void;
}

export const StudentCourseCard = ({
  course,
  onClick,
}: StudentCourseCardProps) => {
  const topicCount = course.topics?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="h-48 bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 relative">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-20 h-20 text-white/40" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {topicCount} {topicCount === 1 ? 'Tópico' : 'Tópicos'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>

        {course.description ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 min-h-[2.5rem]">
            {course.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic mb-4 min-h-[2.5rem]">
            Sin descripción
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            Comenzar
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
