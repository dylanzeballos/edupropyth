import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Archive } from 'lucide-react';
import { EmptyState } from '@/shared/components/ui';
import { StudentCourseCard } from '../components/StudentCourseCard';
import { EnrollmentKeyInput } from '../components/EnrollmentKeyInput';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { CoursesSectionHeader } from '../components/CoursesSectionHeader';
import { useMyCoursesLogic } from '../hooks/useMyCoursesLogic';

export const MyCoursesPage = () => {
  const navigate = useNavigate();
  const { 
    enrolledCourses, 
    historicCourses, 
    availableCourses, 
    isLoading, 
    error 
  } = useMyCoursesLogic();

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}/topics`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Cursos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {enrolledCourses.length > 0
              ? `Estás inscrito en ${enrolledCourses.length} curso${enrolledCourses.length !== 1 ? 's' : ''} activo${enrolledCourses.length !== 1 ? 's' : ''}.`
              : 'Aún no estás inscrito en ningún curso activo.'}
          </p>
        </div>

        <EnrollmentKeyInput />

        {enrolledCourses.length > 0 && (
          <div className="mb-12">
            <CoursesSectionHeader
              icon={CheckCircle}
              title="Mis Cursos Activos"
              count={enrolledCourses.length}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <StudentCourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>
          </div>
        )}

        {historicCourses.length > 0 && (
          <div className="mb-12">
            <CoursesSectionHeader
              icon={Archive}
              title="Cursos Históricos"
              count={historicCourses.length}
              iconClassName="text-purple-600 dark:text-purple-400"
              badgeClassName="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Cursos en los que estuviste inscrito y que ya finalizaron. Solo puedes ver el contenido en modo lectura.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historicCourses.map((course) => (
                <div
                  key={course.id}
                  className="relative"
                >
                  <StudentCourseCard
                    course={course}
                    onClick={() => handleCourseClick(course.id)}
                  />
                  <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-md text-xs font-medium">
                    Histórico
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableCourses.length > 0 && (
          <div>
            <CoursesSectionHeader
              icon={BookOpen}
              title="Cursos Disponibles"
              count={availableCourses.length}
              iconClassName="text-gray-600 dark:text-gray-400"
              badgeClassName="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Estos cursos están activos y disponibles para inscripción. Usa un código de matrícula para inscribirte.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <div
                  key={course.id}
                  className="relative opacity-75 hover:opacity-100 transition-opacity"
                >
                  <StudentCourseCard
                    course={course}
                    onClick={() => handleCourseClick(course.id)}
                  />
                  <div className="absolute top-2 right-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-md text-xs font-medium">
                    No inscrito
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {enrolledCourses.length === 0 && availableCourses.length === 0 && historicCourses.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <EmptyState
              icon={<BookOpen className="w-16 h-16 text-gray-400" />}
              title="No hay cursos disponibles"
              description="Los cursos aparecerán aquí cuando estén disponibles. Usa un código de matrícula para inscribirte."
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};
