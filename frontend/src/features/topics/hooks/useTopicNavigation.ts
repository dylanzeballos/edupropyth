import { useNavigate, useParams } from 'react-router';
import { useTopics } from './useTopic';
import type { Topic } from '../types/topic.types';

interface UseTopicNavigationReturn {
  currentIndex: number;
  hasPrev: boolean;
  hasNext: boolean;
  totalTopics: number;
  handleNavigateNext: () => void;
  handleNavigatePrev: () => void;
  navigateToTopic: (topicId: string) => void;
}

export const useTopicNavigation = (
  currentTopic?: Topic,
): UseTopicNavigationReturn => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: allTopics } = useTopics(courseId || '');

  const currentIndex = currentTopic && allTopics
    ? allTopics.findIndex((t) => t.id === currentTopic.id)
    : -1;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < (allTopics?.length ?? 0) - 1;
  const totalTopics = allTopics?.length ?? 0;

  const navigateToTopic = (topicId: string) => {
    navigate(`/courses/${courseId}/topics/${topicId}/view`);
  };

  const handleNavigateNext = () => {
    if (!allTopics || !currentTopic || !hasNext) return;
    const nextTopic = allTopics[currentIndex + 1];
    navigateToTopic(nextTopic.id);
  };

  const handleNavigatePrev = () => {
    if (!allTopics || !currentTopic || !hasPrev) return;
    const prevTopic = allTopics[currentIndex - 1];
    navigateToTopic(prevTopic.id);
  };

  return {
    currentIndex,
    hasPrev,
    hasNext,
    totalTopics,
    handleNavigateNext,
    handleNavigatePrev,
    navigateToTopic,
  };
};
