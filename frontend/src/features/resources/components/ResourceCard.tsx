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
import { useState } from 'react';
import { ResourceType } from '@/features/courses/types/course.types';
import { Button } from '@/shared/components/ui/Button';
import type { Resource } from '../types/resource.types';

interface ResourceCardProps {
  resource: Resource;
  onEdit?: (resource: Resource) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
}

const resourceTypeIcons: Record<
  ResourceType,
  React.ComponentType<{ className?: string }>
> = {
  slide: Presentation,
  video: Video,
  audio: Music,
  document: FileText,
  link: LinkIcon,
};

const resourceTypeColors: Record<ResourceType, string> = {
  slide: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  video:
    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  audio: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
  document:
    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  link: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
};

const resourceTypeLabels: Record<ResourceType, string> = {
  slide: 'Presentación',
  video: 'Video',
  audio: 'Audio',
  document: 'Documento',
  link: 'Enlace',
};

export const ResourceCard = ({
  resource,
  onEdit,
  onDelete,
  isDragging = false,
}: ResourceCardProps) => {
  const IconComponent = resourceTypeIcons[resource.type];
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const handleOpenResource = () => {
    if (resource.type === 'audio') {
      setShowAudioPlayer(!showAudioPlayer);
    } else if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`
        group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all
        ${isDragging ? 'opacity-50' : 'hover:shadow-md dark:hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600'}
      `}
    >
      <div className="flex items-center gap-3 p-3">
        <div
          className={`p-2.5 rounded-lg flex-shrink-0 ${resourceTypeColors[resource.type]}`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {resource.title}
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${resourceTypeColors[resource.type]}`}
            >
              {resourceTypeLabels[resource.type]}
            </span>
          </div>
          {resource.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
              {resource.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenResource}
            className="h-8 px-2"
            title={resource.type === 'audio' ? 'Reproducir' : 'Abrir'}
          >
            {resource.type === 'audio' ? (
              <Music className="w-4 h-4" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
          </Button>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(resource)}
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
              onClick={() => onDelete(resource.id)}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {resource.type === 'audio' && showAudioPlayer && resource.url && (
        <div className="px-3 pb-3 pt-0">
          <audio
            controls
            className="w-full"
            src={resource.url}
            preload="metadata"
          >
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      )}
    </div>
  );
};
