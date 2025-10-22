import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, Edit, Eye } from 'lucide-react';
import { Link } from 'react-router';

interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  totalTopics: number;
  completedTopics: number;
  totalStudents?: number;
  progress: number;
  instructor: {
    name: string;
    avatar?: string;
  };
}

interface CourseCardProps {
  course: Course;
  canEdit?: boolean;
}

export const CourseCard = ({ course, canEdit = false }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/3 relative">
          <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-24 h-24 text-white/50" />
            )}
          </div>
          {canEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </motion.button>
          )}
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {course.description}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progreso del Curso
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {course.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tópicos
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {course.completedTopics}/{course.totalTopics}
                </p>
              </div>
            </div>

            {course.totalStudents && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Estudiantes
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {course.totalStudents}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Duración
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  8 semanas
                </p>
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {course.instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Instructor
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.instructor.name}
                </p>
              </div>
            </div>

            <Link to="/topics">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Ver Contenido
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
