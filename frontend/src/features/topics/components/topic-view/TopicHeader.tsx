import { useNavigate } from 'react-router';
import { Settings } from 'lucide-react';
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
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {topic.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canEditTemplate && (
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/${courseId}/template`)}
              icon1={Settings}
              size="sm"
            >
              Configurar Template
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => navigateToCourseView(courseId)}
            size="sm"
          >
            Volver al curso
          </Button>
        </div>
      </div>
    </div>
  );
};
