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
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        <p>No hay archivos de audio disponibles</p>
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
      <div className="space-y-2 overflow-y-auto flex-1 scrollbar-none">
        {audioResources.map((resource) => (
          <div
            key={resource.id}
            className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <h4 className="text-md font-medium text-gray-900 dark:text-white flex-1 truncate">
                {resource.title}
              </h4>
            </div>
            {resource.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {resource.description}
              </p>
            )}
            <audio controls className="w-full h-8">
              <source src={resource.url} />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};
