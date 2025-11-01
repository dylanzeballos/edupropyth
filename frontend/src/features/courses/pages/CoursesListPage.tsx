import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCourses, useCreateCourse } from '../hooks/useCourse';
import { useCoursePermissions } from '../hooks/useCoursePermissions';
import { Modal } from '@/shared/components/ui/Modal';
import { EmptyState } from '@/shared/components/ui';
import { useModalState } from '@/shared/hooks/useModalState';
import { CourseForm } from '../components/CourseForm';
import { CourseListCard } from '../components/CourseListCard';
import type { CreateCourseFormData, UpdateCourseFormData } from '../validation/course.schema';

export const CoursesListPage = () => {
  const navigate = useNavigate();
  const createModal = useModalState();

  const { data: courses, isLoading, error } = useCourses();
  const createCourseMutation = useCreateCourse();
  const permissions = useCoursePermissions();

  const handleCreateCourse = (data: CreateCourseFormData | UpdateCourseFormData) => {
    createCourseMutation.mutate(data as CreateCourseFormData, {
      onSuccess: (newCourse) => {
        createModal.close();
        navigate(`/courses/${newCourse.id}`);
      },
    });
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando cursos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Error al cargar los cursos. Por favor, intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cursos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {courses && courses.length > 0
                ? `Gestiona los ${courses.length} curso${courses.length !== 1 ? 's' : ''} del sistema.`
                : 'No hay cursos creados aún.'}
            </p>
          </div>

          {permissions.canCreateCourse && (
            <button
              onClick={() => createModal.open()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Curso
            </button>
          )}
        </div>

        {!courses || courses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <EmptyState
              icon={
                <svg
                  className="w-10 h-10 text-gray-400"
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
              }
              title="No hay cursos disponibles"
              description={
                permissions.canCreateCourse
                  ? 'Comienza creando tu primer curso.'
                  : 'Los cursos aparecerán aquí cuando estén disponibles.'
              }
              actionLabel={permissions.canCreateCourse ? 'Crear Primer Curso' : undefined}
              onAction={permissions.canCreateCourse ? () => createModal.open() : undefined}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseListCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Crear Nuevo Curso"
      >
        <CourseForm
          onSubmit={handleCreateCourse}
          onCancel={createModal.close}
          isSubmitting={createCourseMutation.isPending}
        />
      </Modal>
    </div>
  );
};
