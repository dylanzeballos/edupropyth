import { Edit, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import type { Topic } from '../types/topic.types';

interface TopicCardProps {
  topic: Topic;
  courseStatus: 'draft' | 'active' | 'historic';
  index: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export const TopicCard = ({
  topic,
  courseStatus,
  index,
  onEdit,
  onDelete,
  onClick,
  isDragging,
  dragHandleProps,
}: TopicCardProps) => {
  const canEdit = courseStatus !== 'historic';
  const resourceCount = topic.resources?.length || 0;
  const activityCount = topic.activities?.length || 0;

  return (
    <div
      className={`
        group relative border border-gray-200 dark:border-gray-600 rounded-lg p-4 
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600'}
        ${onClick ? 'cursor-pointer' : ''}
        ${!topic.isActive ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}
      `}
      onClick={onClick}
    >
      {canEdit && dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      )}

      <div className={`flex items-start justify-between ${canEdit && dragHandleProps ? 'pl-6' : ''}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tópico {index + 1}
            </span>
            
            {!topic.isActive && (
              <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                <EyeOff className="w-3 h-3" />
                <span>Inactivo</span>
              </div>
            )}
            
            {topic.isActive && (
              <div className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-1 rounded">
                <Eye className="w-3 h-3" />
                <span>Activo</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {topic.title}
          </h3>

          {topic.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {topic.description}
            </p>
          )}

          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {resourceCount} recurso{resourceCount !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              {activityCount} actividad{activityCount !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        {canEdit && (onEdit || onDelete) && (
          <div className="flex gap-1 ml-4 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-8 px-2"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
