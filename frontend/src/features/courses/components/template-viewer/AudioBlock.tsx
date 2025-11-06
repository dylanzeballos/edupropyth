import { Volume2 } from 'lucide-react';
import type { ContentBlock } from '../../services/course-template.service';
import type { Resource } from '../../types/course.types';

interface AudioBlockProps {
  block: ContentBlock;
  resources?: Resource[];
}

export const AudioBlock = ({ block, resources = [] }: AudioBlockProps) => {
  const audioResources = resources.filter((r) => r.type === 'audio');

  if (audioResources.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No hay archivos de audio disponibles</p>
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
      <div className="space-y-3 overflow-y-auto flex-1">
        {audioResources.map((resource) => (
          <div
            key={resource.id}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                {resource.title}
              </h4>
            </div>
            {resource.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {resource.description}
              </p>
            )}
            <audio controls className="w-full">
              <source src={resource.url} />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};
