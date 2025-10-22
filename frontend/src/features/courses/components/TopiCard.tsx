import { Topic } from '../types/course.types';
import { Button } from '@/shared/components/ui';

interface TopicCardProps {
  topic: Topic;
  isEnrolled?: boolean;
  onViewDetails: (topicId: string) => void;
}

export const TopicCard = ({
  topic,
  isEnrolled = false,
  onViewDetails,
}: TopicCardProps) => {
  const getDifficultyColor = (difficulty: Topic['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
    }
  };

  const getDifficultyText = (difficulty: Topic['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Intermedio';
      case 'hard':
        return 'Difícil';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {topic.title}
          </h3>
          {topic.isCompleted && (
            <span className="text-green-600 font-medium">Completado</span>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {topic.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(topic.difficulty)}`}
          >
            {getDifficultyText(topic.difficulty)}
          </span>
          <span className="text-sm text-gray-500">{topic.duration}</span>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Instructor: {topic.instructor.name}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <Button
            label="Ver Detalles"
            onClick={() => onViewDetails(topic.id)}
            variantColor="primary"
            className="text-sm"
          />
          {isEnrolled && (
            <Button
              label="Comenzar"
              onClick={() => onViewDetails(topic.id)}
              variantColor="tertiary"
              className="text-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};
