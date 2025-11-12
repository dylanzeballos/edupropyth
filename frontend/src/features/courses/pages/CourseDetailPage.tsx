import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCoursePermissions } from '../hooks/useCoursePermissions';
import { useCourseNavigation } from '../hooks/useCourseNavigation';
import { useCourseDetailHandlers } from '../hooks/useCourseDetailHandlers';
import { CourseForm } from '../components/CourseForm';
import { CourseHeader } from '../components/CourseHeader';
import { CourseInfo } from '../components/CourseInfo';
import { CourseLoadingState } from '../components/CourseLoadingState';
import { Modal, EmptyState, Button } from '@/shared/components/ui';
import { useModals } from '@/shared/hooks/useModalState';
import {
  EditionCard,
  EditionForm,
  useEditionsByBlueprint,
} from '@/features/editions';
import {
  useBlueprint,
  blueprintToCourseLike,
} from '@/features/blueprints';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const modals = useModals();

  const { data: blueprint, isLoading, error } = useBlueprint(id);
  const {
    data: editions,
    isLoading: isLoadingEditions,
    error: editionsError,
  } = useEditionsByBlueprint(id);
  const permissions = useCoursePermissions();
  const courseLike = blueprint ? blueprintToCourseLike(blueprint) : undefined;
  const { navigateToCoursesPage } = useCourseNavigation({ course: courseLike });
  
  const {
    handleUpdateCourse,
    handleCreateEdition,
    handleManageEdition,
    handleChangeEditionStatus,
    isUpdatingBlueprint,
    isCreatingEdition,
  } = useCourseDetailHandlers({ blueprintId: id });

  const { canEditCourse } = permissions;

  const loadingState = CourseLoadingState({
    isLoading,
    hasError: !!error || !blueprint,
    onNavigateBack: () => navigate('/my-courses'),
  });

  if (loadingState) return loadingState;
  if (!courseLike) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CourseHeader
          course={courseLike}
          canEdit={canEditCourse}
          canConfigureTemplate={false}
          onBack={navigateToCoursesPage}
          onEdit={() => modals.openModal('editCourse')}
        />

        {courseLike.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={courseLike.thumbnail}
              alt={courseLike.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Ediciones
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona las instancias de este curso y accede a su detalle.
              </p>
            </div>
            {canEditCourse && (
              <Button
                onClick={() => modals.openModal('createEdition')}
                className="ml-auto w-full md:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear edición
              </Button>
            )}
          </div>

          {isLoadingEditions ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                Cargando ediciones...
              </div>
            </div>
          ) : editionsError ? (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-200">
              No se pudieron cargar las ediciones. Intenta nuevamente.
            </div>
          ) : !editions || editions.length === 0 ? (
            <EmptyState
              title="Aún no tienes ediciones"
              description="Crea una edición para comenzar a preparar tópicos, recursos y grupos."
              actionLabel={canEditCourse ? 'Crear edición' : undefined}
              onAction={
                canEditCourse ? () => modals.openModal('createEdition') : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {editions.map((edition) => (
                <EditionCard
                  key={edition.id}
                  edition={edition}
                  onManage={() => handleManageEdition(edition.id)}
                  onChangeStatus={handleChangeEditionStatus}
                  canEdit={canEditCourse}
                />
              ))}
            </div>
          )}
        </section>

        <CourseInfo
          course={courseLike}
          count={editions?.length || 0}
          countLabel="Total de Ediciones"
        />
      </motion.div>

      {canEditCourse && (
        <Modal
          isOpen={modals.isModalOpen('editCourse')}
          onClose={() => modals.closeModal('editCourse')}
          title="Editar Curso"
        >
          <CourseForm
            course={courseLike}
            onSubmit={handleUpdateCourse}
            onCancel={() => modals.closeModal('editCourse')}
            isSubmitting={isUpdatingBlueprint}
          />
        </Modal>
      )}

      {canEditCourse && (
        <Modal
          isOpen={modals.isModalOpen('createEdition')}
          onClose={() => modals.closeModal('createEdition')}
          title="Crear nueva edición"
        >
          <EditionForm
            editions={editions || []}
            onSubmit={handleCreateEdition}
            onCancel={() => modals.closeModal('createEdition')}
            isSubmitting={isCreatingEdition}
          />
        </Modal>
      )}
    </div>
  );
};
