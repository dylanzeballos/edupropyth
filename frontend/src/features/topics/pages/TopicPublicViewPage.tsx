import { useParams, useNavigate } from 'react-router';
import { useTopic } from '../hooks/useTopic';
import { useCourseTemplateById } from '@/features/courses/hooks/useCourseTemplate';
import { CourseTemplateViewer } from '@/features/courses/components/CourseTemplateViewer';
import { EmptyState } from '@/shared/components/ui';
import { useCourse } from '@/features/courses/hooks/useCourse';
import { useDefaultTemplate } from '../hooks/useDefaultTemplate';
import { useTopicNavigation } from '../hooks/useTopicNavigation';
import { useTopicPermissions } from '../hooks/useTopicPermissions';
import {
  TopicHeader,
  TopicFooter,
  BasicTopicView,
  LoadingView,
} from '../components/topic-view';

export const TopicPublicViewPage = () => {
  const { courseId, topicId } = useParams<{
    courseId: string;
    topicId: string;
  }>();
  const navigate = useNavigate();

  const { data: topic, isLoading: isLoadingTopic } = useTopic(
    courseId || '',
    topicId || '',
  );
  const { data: course } = useCourse(courseId || '');
  const { data: courseTemplate, isLoading: isLoadingTemplate } =
    useCourseTemplateById(courseId);

  const { isCreating: isCreatingTemplate } = useDefaultTemplate({
    courseId,
    hasTemplate: !!courseTemplate,
    isLoadingTemplate,
  });

  const navigation = useTopicNavigation(topic);
  const { canEditTemplate } = useTopicPermissions({ course });

  const isLoading = isLoadingTopic || isLoadingTemplate || isCreatingTemplate;

  if (isLoading) {
    return <LoadingView />;
  }

  if (!topic) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          <EmptyState
            title="Tópico no encontrado"
            description="El tópico que buscas no existe o fue eliminado."
            actionLabel="Volver al curso"
            onAction={() => navigate(`/courses/${courseId}/topics`)}
          />
        </div>
      </div>
    );
  }

  const hasTemplateBlocks =
    courseTemplate && courseTemplate.blocks && courseTemplate.blocks.length > 0;

  return (
    <div className="absolute inset-0 flex flex-col bg-gray-50 dark:bg-gray-800">
      <TopicHeader
        topic={topic}
        courseId={courseId!}
        canEditTemplate={canEditTemplate}
      />

      <div className="flex-1 min-h-0 overflow-hidden py-4 px-4">
        <div className="h-full max-w-[1800px] mx-auto">
          {hasTemplateBlocks ? (
            <CourseTemplateViewer
              blocks={courseTemplate.blocks}
              resources={topic.resources}
              activities={topic.activities}
            />
          ) : (
            <BasicTopicView
              topic={topic}
              courseId={courseId!}
              canEditTemplate={canEditTemplate}
            />
          )}
        </div>
      </div>

      <TopicFooter
        currentIndex={navigation.currentIndex}
        totalTopics={navigation.totalTopics}
        hasPrev={navigation.hasPrev}
        hasNext={navigation.hasNext}
        onNavigatePrev={navigation.handleNavigatePrev}
        onNavigateNext={navigation.handleNavigateNext}
      />
    </div>
  );
};
