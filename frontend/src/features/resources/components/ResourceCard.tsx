import {
  FileText,
  Video,
  Music,
  Presentation,
  Link as LinkIcon,
  ExternalLink,
  Edit,
  Trash2,
} from 'lucide-react';
import { ResourceType } from '@/features/courses/types/course.types';
import { Button } from '@/shared/components/ui/Button';
import type { Resource } from '../types/resource.types';

interface ResourceCardProps {
  resource: Resource;
  onEdit?: (resource: Resource) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
}

const resourceTypeIcons: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  slide: Presentation,
  video: Video,
  audio: Music,
  document: FileText,
  link: LinkIcon,
};

const resourceTypeColors: Record<ResourceType, string> = {
  slide: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  video: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  audio: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
  document: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  link: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
};

export const ResourceCard = ({
  resource,
  onEdit,
  onDelete,
  isDragging = false,
}: ResourceCardProps) => {
  const IconComponent = resourceTypeIcons[resource.type];

  const handleOpenResource = () => {
    if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`
        group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all flex flex-col
        ${isDragging ? 'opacity-50' : 'hover:shadow-md dark:hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600'}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-lg ${resourceTypeColors[resource.type]}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {resource.title}
            </h3>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                resourceTypeColors[resource.type]
              }`}
            >
              {resource.type}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 mb-3">
        {resource.description ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {resource.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            Sin descripción
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenResource}
          className="flex-1"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir
        </Button>
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(resource)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(resource.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="absolute top-2 right-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
        #{resource.order}
      </div>
    </div>
  );
};
