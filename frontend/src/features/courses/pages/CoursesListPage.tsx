import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { useBlueprints, useCreateBlueprint, blueprintToCourseLike } from '@/features/blueprints';
import { useCoursePermissions } from '../hooks/useCoursePermissions';
import { Modal } from '@/shared/components/ui/Modal';
import { EmptyState } from '@/shared/components/ui';
import { useModalState } from '@/shared/hooks/useModalState';
import { CourseForm } from '../components/CourseForm';
import { CourseListCard } from '../components/CourseListCard';
import type {
  CreateCourseFormData,
  UpdateCourseFormData,
} from '../validation/course.schema';

export const CoursesListPage = () => {
  const navigate = useNavigate();
  const createModal = useModalState();

  const { data: blueprints, isLoading, error } = useBlueprints();
  const createBlueprintMutation = useCreateBlueprint();
  const permissions = useCoursePermissions();

  const handleCreateCourse = (
    data: CreateCourseFormData | UpdateCourseFormData,
  ) => {
    createBlueprintMutation.mutate(data as CreateCourseFormData, {
      onSuccess: (newBlueprint) => {
        createModal.close();
        navigate(`/courses/${newBlueprint.id}/management`);
      },
    });
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}/management`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando cursos...
            </p>
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
              Gestión de Cursos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {blueprints && blueprints.length > 0
                ? `Administra y edita ${blueprints.length} curso${blueprints.length !== 1 ? 's' : ''} del sistema.`
                : 'No hay cursos creados aún.'}
            </p>
          </div>

          {permissions.canCreateCourse && (!blueprints || blueprints.length === 0) && (
            <button
              onClick={() => createModal.open()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Curso Base
            </button>
          )}
        </div>

        {!blueprints || blueprints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <EmptyState
              icon={
                <BookOpen className="w-10 h-10 text-gray-400" />
              }
              title="No hay cursos disponibles"
              description={
                permissions.canCreateCourse
                  ? 'Comienza creando el curso base del sistema. Este será el template para crear ediciones.'
                  : 'Los cursos aparecerán aquí cuando estén disponibles.'
              }
              actionLabel={
                permissions.canCreateCourse ? 'Crear Curso Base' : undefined
              }
              onAction={
                permissions.canCreateCourse
                  ? () => createModal.open()
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blueprints.map((blueprint) => {
              const courseLike = blueprintToCourseLike(blueprint);
              return (
                <CourseListCard
                  key={blueprint.id}
                  course={courseLike}
                  onClick={() => handleCourseClick(blueprint.id)}
                />
              );
            })}
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
          isSubmitting={createBlueprintMutation.isPending}
        />
      </Modal>
    </div>
  );
};
