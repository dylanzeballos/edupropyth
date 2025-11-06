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
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        <p>No hay actividades disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {block.content.title && (
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
          {block.content.title}
        </h3>
      )}
      {block.content.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {block.content.description}
        </p>
      )}
      <div className="space-y-2 overflow-y-auto flex-1 scrollbar-none">
        {blockActivities.map((activity) => (
          <div
            key={activity.id}
            className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {activity.title}
            </h4>
            {activity.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {activity.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
