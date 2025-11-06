import { useNavigate } from 'react-router';
import { Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useCourseNavigation } from '@/features/courses/hooks/useCourseNavigation';
import type { Topic } from '../../types/topic.types';

interface TopicHeaderProps {
  topic: Topic;
  courseId: string;
  canEditTemplate: boolean;
}

export const TopicHeader = ({
  topic,
  courseId,
  canEditTemplate,
}: TopicHeaderProps) => {
  const navigate = useNavigate();
  const { navigateToCourseView } = useCourseNavigation();

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2.5 flex-shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
              {topic.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canEditTemplate && (
            <Button
              variant="ghost"
              onClick={() => navigate(`/courses/${courseId}/template`)}
              icon1={Settings}
              size="sm"
            >
              <span className="hidden md:inline">Template</span>
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => navigateToCourseView(courseId)}
            icon1={ArrowLeft}
            size="sm"
          >
            <span className="hidden sm:inline">Volver</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
