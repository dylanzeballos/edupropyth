import { useParams, useNavigate } from 'react-router';
import { useCourse } from '../hooks/useCourse';
import {
  useCourseTemplateById,
  useCreateCourseTemplate,
  useUpdateCourseTemplateByCourseId,
} from '../hooks/useCourseTemplate';
import { CourseTemplateEditor } from '../components/CourseTemplateEditor';
import { EmptyState } from '@/shared/components/ui';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { UserRole } from '@/features/auth/types/user.type';
import type { ContentBlock } from '../services/course-template.service';

export const CourseTemplateEditorPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: course, isLoading: isLoadingCourse } = useCourse(
    courseId || '',
  );
  const { data: template, isLoading: isLoadingTemplate } =
    useCourseTemplateById(courseId);

  const createTemplateMutation = useCreateCourseTemplate();
  const updateTemplateMutation = useUpdateCourseTemplateByCourseId();

  const canEdit =
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.TEACHER_EDITOR ||
    user?.role === UserRole.TEACHER_EXECUTOR ||
    course?.instructorId === user?.id ||
    false;

  const handleSave = async (blocks: ContentBlock[]) => {
    if (!courseId) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const blocksWithoutIds = blocks.map(({ id: _id, ...block }) => block);

      if (template?.id) {
        await updateTemplateMutation.mutateAsync({
          courseId,
          data: { blocks: blocksWithoutIds as ContentBlock[] },
        });
      } else {
        await createTemplateMutation.mutateAsync({
          courseId,
          blocks: blocksWithoutIds as ContentBlock[],
        });
      }

      navigate(`/courses/${courseId}/management`);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/courses/${courseId}/management`);
  };

  const isLoading = isLoadingCourse || isLoadingTemplate;
  const isSaving =
    createTemplateMutation.isPending || updateTemplateMutation.isPending;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          <EmptyState
            title="Curso no encontrado"
            description="El curso que buscas no existe o fue eliminado."
            actionLabel="Volver a cursos"
            onAction={() => navigate('/courses')}
          />
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          <EmptyState
            title="Sin permisos"
            description="No tienes permisos para editar el template de este curso."
            actionLabel="Volver al curso"
            onAction={() => navigate(`/courses/${courseId}/management`)}
          />
        </div>
      </div>
    );
  }

  return (
    <CourseTemplateEditor
      template={template || null}
      courseId={courseId || ''}
      resources={course.topics?.flatMap((t) => t.resources || []) || []}
      activities={course.topics?.flatMap((t) => t.activities || []) || []}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
    />
  );
};
