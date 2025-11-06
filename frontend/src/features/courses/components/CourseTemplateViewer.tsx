import { useMemo } from 'react';
import { cn } from '@/shared/utils/cn';
import { detectVideoProvider } from '@/shared/utils/media.utils';
import type { ContentBlock } from '../services/course-template.service';
import type { Resource, Activity } from '../types/course.types';
import {
  VideoBlock,
  ResourceBlock,
  HtmlBlock,
  DocumentBlock,
  AudioBlock,
  ActivitiesBlock,
} from './template-viewer';

interface CourseTemplateViewerProps {
  blocks: ContentBlock[];
  resources?: Resource[];
  activities?: Activity[];
}

export const CourseTemplateViewer = ({
  blocks,
  resources = [],
  activities = [],
}: CourseTemplateViewerProps) => {
  const visibleBlocks = useMemo(() => {
    return blocks.filter((block) => {
      switch (block.type) {
        case 'html':
          return !!block.content.html;

        case 'video':
          if (block.content.videoUrl) return true;
          return resources.some((r) => {
            const provider = detectVideoProvider(r.url);
            return (
              r.type === 'link' &&
              (provider === 'youtube' || provider === 'vimeo')
            );
          });

        case 'resource':
          if (block.content.resourceIds?.length) {
            return resources.some((r) =>
              block.content.resourceIds?.includes(r.id),
            );
          }
          return resources.some(
            (r) => r.type !== 'document' && r.type !== 'audio',
          );

        case 'document':
          if (block.content.documentUrl) return true;
          return resources.some((r) => r.type === 'document');

        case 'audio':
          return resources.some((r) => r.type === 'audio');

        case 'activities':
          if (block.content.activityIds?.length) {
            return activities.some((a) =>
              block.content.activityIds?.includes(a.id),
            );
          }
          return activities.length > 0;

        default:
          return false;
      }
    });
  }, [blocks, resources, activities]);

  const gridHeight = useMemo(() => {
    if (visibleBlocks.length === 0) return 0;
    const maxY = Math.max(
      ...visibleBlocks.map((b) => (b.position?.y || 0) + (b.position?.h || 4)),
    );
    return maxY * 70; // 70px per row unit
  }, [visibleBlocks]);

  const renderBlockContent = (block: ContentBlock) => {
    switch (block.type) {
      case 'html':
        return <HtmlBlock block={block} />;
      case 'video':
        return <VideoBlock block={block} resources={resources} />;
      case 'resource':
        return <ResourceBlock block={block} resources={resources} />;
      case 'document':
        return <DocumentBlock block={block} resources={resources} />;
      case 'audio':
        return <AudioBlock block={block} resources={resources} />;
      case 'activities':
        return <ActivitiesBlock block={block} activities={activities} />;
      default:
        return null;
    }
  };

  if (visibleBlocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">
          No hay contenido disponible
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-auto scrollbar-none">
      <div
        className="relative w-full origin-top-left"
        style={{ height: `${gridHeight}px` }}
      >
        {visibleBlocks.map((block) => {
          const pos = block.position || { x: 0, y: 0, w: 12, h: 4 };
          const colWidth = 100 / 12;
          const rowHeight = 70;

          return (
            <div
              key={block.id}
              className={cn(
                'absolute bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
                'p-3 md:p-4',
                'overflow-auto scrollbar-none',
              )}
              style={{
                left: `${pos.x * colWidth}%`,
                top: `${pos.y * rowHeight}px`,
                width: `calc(${pos.w * colWidth}% - 8px)`,
                height: `${pos.h * rowHeight}px`,
              }}
            >
              {renderBlockContent(block)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
