import { ExternalLink } from 'lucide-react';
import type { ContentBlock } from '../../services/course-template.service';
import type { Resource } from '../../types/course.types';

interface ResourceBlockProps {
  block: ContentBlock;
  resources?: Resource[];
}

const getResourceIcon = (resource: Resource) => {
  if (resource.type === 'link') {
    const url = resource.url.toLowerCase();
    if (
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('vimeo.com')
    ) {
      return (
        <svg
          className="w-4 h-4 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (
      url.includes('slides.google.com') ||
      url.includes('docs.google.com/presentation')
    ) {
      return (
        <svg
          className="w-4 h-4 text-orange-600 dark:text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      );
    }
  }
  return <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
};

export const ResourceBlock = ({
  block,
  resources = [],
}: ResourceBlockProps) => {
  const blockResources = block.content.resourceIds
    ? resources.filter(
        (r) =>
          block.content.resourceIds?.includes(r.id) &&
          r.type !== 'document' &&
          r.type !== 'audio',
      )
    : resources.filter((r) => r.type !== 'document' && r.type !== 'audio');

  if (blockResources.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        <p>No hay recursos disponibles</p>
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
        {blockResources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors border border-gray-200 dark:border-gray-700"
          >
            {getResourceIcon(resource)}
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
