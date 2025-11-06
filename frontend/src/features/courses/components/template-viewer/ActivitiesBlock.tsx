import type { ContentBlock } from '../../services/course-template.service';
import type { Activity } from '../../types/course.types';

interface ActivitiesBlockProps {
  block: ContentBlock;
  activities?: Activity[];
}

export const ActivitiesBlock = ({
  block,
  activities = [],
}: ActivitiesBlockProps) => {
  const blockActivities = block.content.activityIds
    ? activities.filter((a) => block.content.activityIds?.includes(a.id))
    : activities;

  if (blockActivities.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No hay actividades disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {block.content.title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {block.content.title}
        </h3>
      )}
      {block.content.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {block.content.description}
        </p>
      )}
      <div className="space-y-3 overflow-y-auto flex-1">
        {blockActivities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {activity.title}
            </h4>
            {activity.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {activity.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
