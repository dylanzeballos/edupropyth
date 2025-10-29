import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCourse, useCreateCourse, useUpdateCourse } from '../hooks/useCourse';
import { useCoursePermissions } from '../hooks/useCoursePermissions';
import { CourseCard } from '../components/CourseCard';
import { CourseForm } from '../components/CourseForm';
import { EmptyCourse } from '../components/EmptyCourse';
import { Modal } from '@/shared/components/ui/Modal';
import type { CreateCourseFormData, UpdateCourseFormData } from '../validation/course.schema';

export const CoursePage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: course, isLoading, error } = useCourse();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const permissions = useCoursePermissions();

  const handleCreateCourse = (data: CreateCourseFormData) => {
    createCourseMutation.mutate(data, {
      onSuccess: () => {
        setShowCreateModal(false);
      },
    });
  };

  const handleUpdateCourse = (data: UpdateCourseFormData) => {
    updateCourseMutation.mutate(data, {
      onSuccess: () => {
        setShowEditModal(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando curso...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error 404, significa que no hay curso creado
  const isCourseNotFound = error?.response?.status === 404;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión del Curso
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {course
              ? 'Visualiza y edita el curso único del sistema.'
              : 'Administra el curso principal de la plataforma.'}
          </p>
        </div>

        {/* Content */}
        {isCourseNotFound || !course ? (
          <EmptyCourse
            canCreate={permissions.canCreateCourse}
            onCreateClick={() => setShowCreateModal(true)}
          />
        ) : (
          <CourseCard
            course={course}
            onEdit={() => setShowEditModal(true)}
            canEdit={permissions.canEditCourse}
          />
        )}

        {/* Error general */}
        {error && !isCourseNotFound && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">
              Error al cargar el curso. Por favor, intenta nuevamente.
            </p>
          </div>
        )}
      </motion.div>

      {/* Modal de creación */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Curso"
        size="lg"
      >
        <CourseForm
          onSubmit={handleCreateCourse}
          isLoading={createCourseMutation.isPending}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Modal de edición */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Curso"
        size="lg"
      >
        {course && (
          <CourseForm
            course={course}
            onSubmit={handleUpdateCourse}
            isLoading={updateCourseMutation.isPending}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};
