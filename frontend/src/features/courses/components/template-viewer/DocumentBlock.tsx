import { ExternalLink, FileText } from 'lucide-react';
import type { ContentBlock } from '../../services/course-template.service';
import type { Resource } from '../../types/course.types';

interface DocumentBlockProps {
  block: ContentBlock;
  resources?: Resource[];
}

export const DocumentBlock = ({
  block,
  resources = [],
}: DocumentBlockProps) => {
  const documentResources = resources.filter((r) => r.type === 'document');

  if (documentResources.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        <p>No hay documentos disponibles</p>
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
      <div className="space-y-1.5 overflow-y-auto flex-1 scrollbar-none">
        {documentResources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors border border-gray-200 dark:border-gray-700"
          >
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-md font-medium text-gray-900 dark:text-white truncate">
                {resource.title}
              </h4>
              {resource.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {resource.description}
                </p>
              )}
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};
